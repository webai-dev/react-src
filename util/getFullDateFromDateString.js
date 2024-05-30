import getMonthFromDateString  from './getMonthFromDateString';
import getDateObjectFromString from './getDateObjectFromString';

/**
 * Receive date as string and returns full date string - e.g. May 28, 2019
 *
 * @param {string} dateString
 * @returns {string}
 */
const getFullDateFromDateString = (dateString) => {
    return `${
        getMonthFromDateString(dateString) } ${
        (getDateObjectFromString(dateString)).getDate() }, ${
        (getDateObjectFromString(dateString)).getFullYear()
        }`;
};

export default getFullDateFromDateString;
