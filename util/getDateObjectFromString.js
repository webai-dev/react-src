/**
 * Receive date as string and returns date object
 *
 * @param {string} dateString
 * @returns {Date}
 */
const getDateObjectFromString = (dateString) => {
    const timezoneMinutes = dateString.slice(-2);
    const datePart = dateString.slice(0, -2);
    return new Date(Date.parse(datePart.endsWith(':') ? `${ datePart }${ timezoneMinutes }` : `${ datePart }:${ timezoneMinutes }`));
};

export default getDateObjectFromString;

