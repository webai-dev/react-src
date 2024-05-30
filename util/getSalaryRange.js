import getDenominationValue from './getDenominationValue';
/**
 * Get number and returns range of salaries to display
 *
 * @param {number} salary
 * @returns {string}
 */
const getSalaryRange = (salary) => {
    const ranges = [
        60000,
        100000,
        150000,
        200000,
        300000,
    ];

    let indexOfMinRange = 0;

    for (let index = 0; index < (ranges.length + 1); index++) {
        indexOfMinRange = index;
        if (salary <= ranges[ index ]) {
            break;
        }
    }
    return indexOfMinRange === 0 ?
        `0 - $${getDenominationValue(ranges[ indexOfMinRange ])}` :
        indexOfMinRange === ranges.length ?
            `$${getDenominationValue(ranges[ ranges.length - 1 ] / 1000)}k +` :
            `$${getDenominationValue(ranges[ indexOfMinRange - 1 ] / 1000)}k - $${getDenominationValue(ranges[ indexOfMinRange ] / 1000)}k`;
};

export default getSalaryRange;
