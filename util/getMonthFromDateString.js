import { MONTH_LABELS }        from '../constants';
import getDateObjectFromString from './getDateObjectFromString';

/**
 * Receive date as string and returns month name
 *
 * @param {string} dateString
 * @returns {string}
 */
const getMonthFromDateString = (dateString) => {
    return MONTH_LABELS[
        getDateObjectFromString(dateString)
            .getMonth()
        ];
};

export default getMonthFromDateString;
