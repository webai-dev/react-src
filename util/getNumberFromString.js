/**
 * Remove all chars except 0-9 and '.'
 *
 * @param {string} value
 * @param {number} [round] - 0 === integer; undefined === don't round
 * @returns {string|undefined}
 */
const getNumberFromString = (value, round) => {
    const numberString = value.replace(/[^-?\d*.?\d+$]/g,'');
    if (numberString === '') {
        return undefined;
    }
    const numberSplit = numberString.split('.');
    if (round === 0) {
        return numberSplit[0];
    }

    return numberSplit.length === 1 ?
        numberSplit[0] :
        `${numberSplit[0]}.${round ? numberSplit[1].slice(0, round) : numberSplit[1]}`;
};

export default getNumberFromString;

