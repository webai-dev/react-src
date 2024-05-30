import { commitMutation as commitMutationDefault } from 'react-relay';
import { store }                                   from '../stores';

export default (environment, { errorPath, ...options }) => {
    return new Promise((resolve, reject) => {
        store.notifications.startSaveNotificationOverlay();
        commitMutationDefault(environment, {
            ...options,
            onError: (error) => {
                reject(error);
                store.notifications.stopSaveNotificationOverlay();
            },
            onCompleted: (response, error) => {
                let errors = [];
                const responseKeys = response.mutator ? Object.keys(response.mutator) : Object.keys(response);
                responseKeys.forEach(key => {
                    const errorItem = response.mutator ?
                        (response.mutator[ key ] && response.mutator[ key ].errors) :
                        (response[ key ] && response[ key ].errors);
                    errors = errorItem ? errors.concat(errorItem) : errors;
                });

                store.notifications.stopSaveNotificationOverlay();
                if (error) {
                    return reject(error);
                }
                if (errors && errors.length) {
                    return reject(errors);
                }
                return resolve(response);
            }
        });
    });
};
