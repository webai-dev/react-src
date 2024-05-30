import React                   from 'react';
import PropTypes               from 'prop-types';
import { withFormsy }          from 'formsy-react';
import DateInputComponent      from '../../Form/DateInputComponent';
import getDateObjectFromString from '../../../../util/getDateObjectFromString';

const FormsyDateInputComponent = (props) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        placeholder,
        name,
        required,
        className,
        label,
        isFormSubmitted,
        minDate,
        maxDate,
        onChange
    } = props;
    const value = getValue();
    const valueFormatted = value && getDateObjectFromString(value);
    const errorMessage = getErrorMessage();
    /**
     * Set value for  FormsyDateInputComponent
     *
     * @param {Date} rawValue
     */
    const setValueFormatted = (rawValue) => {
        let day = rawValue.getDate();
        day = day > 9 ? day : `0${ day }`;
        let month = rawValue.getMonth() + 1;
        month = month > 9 ? month : `0${ month }`;

        const z = (n) => (n < 10 ? '0' : '') + n;
        const sign = offset < 0 ? '+' : '-';
        let offset = Math.abs(rawValue.getTimezoneOffset());
        offset = sign + z(offset / 60 | 0) + ':' + z(offset % 60);

        const dateValue = `${ rawValue.getFullYear() }-${ month }-${ day }T00:00:00${ offset }`;
        setValue(dateValue);
    };

    return (
        <DateInputComponent
            touched={ isFormSubmitted() }
            value={ valueFormatted }
            errorMessage={ errorMessage }
            className={ className }
            placeholder={ placeholder }
            setValue={ setValueFormatted }
            name={ name }
            label={ label }
            required={ required }
            minDate={ minDate }
            maxDate={ maxDate }
            onChange={ onChange }
        />
    );
};

FormsyDateInputComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired, // from withFormsy
    placeholder: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string.isRequired,
    validations: PropTypes.oneOfType([ // used in withFormsy
        PropTypes.string,
        PropTypes.object,
    ]),
    validationError: PropTypes.oneOfType([ // used in withFormsy
        PropTypes.string,
        PropTypes.object,
    ]),
    required: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
};

export default withFormsy(FormsyDateInputComponent);
