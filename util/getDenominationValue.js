/**
 * Will check if value big enough and will add denomination to the number
 *
 * @param {number|string} value
 * @returns {string}
 */
const getDenominationValue = (value) => {
    const isNumberFloat = value.toString().includes('.');
    const stringArrayValue = value.toString().split('.'); // get part of float number
    const floatPart = stringArrayValue[1];

    const stringValue = stringArrayValue[0];
    if (stringValue.length <= 3) {
        return isNumberFloat ? `${stringValue}.${floatPart}` : stringValue;
    }
    const valueString = stringValue.toString().split('');
    let denominateValue = '';
    const firstPosition = valueString.length % 3;
    valueString.forEach((char, index) => {
        denominateValue = denominateValue + (
            (index + 1) % 3 === firstPosition && (index + 1) !== valueString.length ? `${char},`: char
        );
    });
    return isNumberFloat ? `${denominateValue}.${floatPart}` : denominateValue;
};

export default getDenominationValue;
