import getMonthFromDateString  from './getMonthFromDateString';
import getDateObjectFromString from './getDateObjectFromString';

/**
 * Receive date as string and returns full date string - e.g. May 28, 2019
 *
 * @param {string} dateString
 * @returns {string}
 */
const getMonthYearDateFromDateString = (dateString) => {
    return `${
        getMonthFromDateString(dateString) } ${
        getDateObjectFromString(dateString)
            .getFullYear()
        }`;
};

export default getMonthYearDateFromDateString;
