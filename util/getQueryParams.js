/**
 * Get query params from query string - query string example '?tab=blog&search=search_text'
 *
 * @param {string} query
 * @returns {Object}
 */
const getQueryParams = query => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                    let [key, value] = param.split('=');
                    value = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                    if (key.includes('[]')) {
                        key = key.slice(0,-2);
                        value = value ? value.split(';') : [];
                    }
                    params[key] = value === 'null' ? null : value;
                    return params;
                }, {}
            )
        : {};
};

export default getQueryParams;
