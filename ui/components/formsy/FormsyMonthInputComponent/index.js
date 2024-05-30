import React               from 'react';
import PropTypes           from 'prop-types';
import { withFormsy }      from 'formsy-react';
import MonthInputComponent from '../../Form/MonthInputComponent';

const FormsyMonthInputComponent = (props) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        placeholder,
        name,
        required,
        className,
        label,
        minDate,
        maxDate,
        isFormSubmitted,
        dataTest,
    } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();
    return (
        <MonthInputComponent
            dataTest={ dataTest }
            touched={ isFormSubmitted() }
            value={ value }
            errorMessage={ errorMessage }
            className={ className }
            placeholder={ placeholder }
            setValue={ setValue }
            name={ name }
            label={ label }
            required={ required }
            minDate={ minDate }
            maxDate={ maxDate }
        />
    );
};

FormsyMonthInputComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string,
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
    dataTest: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
};

export default withFormsy(FormsyMonthInputComponent);
