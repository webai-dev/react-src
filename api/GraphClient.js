import {
    Environment,
    Network,
    RecordSource,
    Store,
    ConnectionHandler,
    ViewerHandler
}                                from 'relay-runtime';
import LoginManager              from './api';
import Storage                   from './Storage';
import { StorageKeys, ApiPaths } from '../constants';
import RelayQueryResponseCache   from 'relay-runtime/lib/RelayQueryResponseCache';

const oneMinute = 60 * 1000;

const cache = new RelayQueryResponseCache({ size: 250, ttl: oneMinute });
LoginManager.graphCache = cache;

const formatGraphqlError = error =>
    `Got error fetching GraphQL query!
${ error.debugMessage }
`;

const addDeep = (data, formData, formPath = '', objectPath = []) => {
    let keys = [];
    const [ prefix, suffix ] = (() => {
        if (formPath) {
            return [ `${ formPath }_`, '' ];
        }
        return [ '', '' ];
    })();

    if (data instanceof File) {
        formData.append(formPath, data);
        keys.push([ formPath, objectPath ]);
    } else if (typeof data === 'object') {
        if (Array.isArray(data)) {
            for (let i in data) {
                const newObjStack = [ ...objectPath, i ];
                keys = keys.concat(
                    addDeep(data[ i ], formData, `${ prefix }${ i }${ suffix }`, newObjStack)
                );
            }
        } else {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    const newObjStack = [ ...objectPath, key ];
                    keys = keys.concat(
                        addDeep(data[ key ], formData, `${ prefix }${ key }${ suffix }`, newObjStack)
                    );
                }
            }
        }
    }

    return keys;
};

function fetchQuery(operation, variables, cacheConfig, uploadables = []) {
    const queryID = operation.text;
    const isMutation = operation.operationKind === 'mutation';
    const isQuery = operation.operationKind === 'query';
    const forceFetch = cacheConfig && cacheConfig.force;

    return LoginManager.getUser()
        .then(user => {
            if (!user) {
                cache.clear();
            }
            const headers = {};
            if (user && user.token && user.token.trim()) {
                headers[ 'Authorization' ] = 'Bearer ' + user.token;
            }
            if (Storage.get(StorageKeys.switchUser)) {
                headers[ 'X-Switch-User' ] = Storage.get(StorageKeys.switchUser);
            }

            const fromCache = cache.get(queryID, variables);

            if (isQuery && fromCache !== null && !forceFetch) {
                return {
                    json: () => fromCache
                };
            }

            const newVariables = { ...variables };
            const formData = new FormData();
            const fileKeys = Object.keys(uploadables);
            if (uploadables && fileKeys.length > 0) {
                const fileNames = addDeep(uploadables, formData);
                const map = fileNames.reduce((mapResult, [ name, path ]) => {
                    mapResult[ name ] = [ [ 'variables', 'input', ...path ].join('.') ];
                    return mapResult;
                }, {});

                fileKeys.forEach(key => {
                    newVariables.input = {
                        ...newVariables.input,
                        [ key ]: uploadables[ key ] ? Array(uploadables[ key ].length) : undefined
                    };
                });

                formData.append(
                    'operations',
                    JSON.stringify({ query: operation.text, variables: newVariables })
                );
                formData.append('map', JSON.stringify(map));
            } else {
                formData.append('query', operation.text);
                formData.append('variables', JSON.stringify(newVariables));
            }

            return fetch(ApiPaths.graphql, {
                method: 'POST',
                credentials: 'include',
                headers: headers,
                body: formData
            });
        })
        .then(response => {
            return response.json();
        })
        .then(response => {
            if (response && response.code === 401) {
                cache.clear();
                throw new Error(response);
            }
            if (response.errors) {
                /* eslint-disable no-console */
                response.errors.map(it => console.error(formatGraphqlError(it)));
                /* eslint-enable no-console */
            }
            return response;
        })
        .then(json => {
            if (isQuery && json) {
                cache.set(queryID, variables, json);
            }
            // Clear cache on mutations
            if (isMutation) {
                cache.clear();
            }

            return json;
        });
}

function handlerProvider(handle) {
    switch (handle) {
        // Augment (or remove from) this list:
        case 'connection':
            return ConnectionHandler;
        case 'viewer':
            return ViewerHandler;
    }
    throw new Error(`handlerProvider: No handler provided for ${ handle }`);
}

const relayStore = new Store(new RecordSource());
window.relayStore = relayStore;
// installRelayDevTools(); // TODO throws errors constantly
export const environment = new Environment({
    network: Network.create(fetchQuery),
    store: relayStore,
    handlerProvider
});
window.relayEnvironment = environment;

export default environment;
