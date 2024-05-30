/**
 * Get object and transpiling it to query string - e.g {foo: 'ab', bar: 'fg'} to '?foo=ab&bar=fg'
 *
 * @param {Object} queryParams
 * @returns {string}
 */
const getQueryString = (queryParams) => {
    const queryArray = [];
    for (let name in queryParams) {
        if (queryParams.hasOwnProperty(name)) {
            const isArray = Array.isArray(queryParams[ name ]);
            const value = isArray ? queryParams[ name ].join(';') : encodeURIComponent(queryParams[ name ]);
            name = isArray ? `${name}[]` : encodeURIComponent(name);
            queryArray.push(name + '=' + value);
        }
    }
    return `?${queryArray.join('&')}`;
};

export default getQueryString;
