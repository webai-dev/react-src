import getDateObjectFromString from './getDateObjectFromString';
/**
 * Receive date as string and returns two last numbers from year
 *
 * @param {string} dateString
 * @returns {string}
 */
const getYearFromDateString = (dateString) => {
    return `${getDateObjectFromString(dateString).getFullYear()}`.slice(-2);
};

export default getYearFromDateString;
