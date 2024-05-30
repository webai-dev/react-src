/**
 * Receive date as Date and return string `2019-05-03` format
 *
 * @param {Date} date
 * @returns {string}
 */
const getStringFromDate = (date) => {
    return `${ date.getFullYear() }-${ (date.getMonth() + 1) }-${ date.getDate() }`;
};

export default getStringFromDate;
