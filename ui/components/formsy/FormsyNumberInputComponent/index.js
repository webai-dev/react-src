import React                from 'react';
import PropTypes            from 'prop-types';
import { withFormsy }       from 'formsy-react';
import NumberInputComponent from '../../Form/NumberInputComponent';

const FormsyNumberInputComponent = (props) => {
    const {
        getValue,
        setValue,
        placeholder,
        required,
        className,
        label,
        isFormSubmitted,
        name,
        labelMax,
        labelMin,
        dataTest,
        round,
        color,
        getErrorMessage,
    } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();
    return (
        <NumberInputComponent
            dataTest={ dataTest }
            name={ name }
            touched={ isFormSubmitted() }
            value={ value }
            isError={ isFormSubmitted() && required && value === undefined }
            errorMessage={ errorMessage }
            className={ className }
            placeholder={ placeholder }
            setValue={ setValue }
            label={ label }
            required={ required }
            labelMax={ labelMax }
            labelMin={ labelMin }
            round={ round }
            color={ color }
        />
    );
};

FormsyNumberInputComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired, // from withFormsy
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
    round: PropTypes.bool,
    className: PropTypes.string,
    labelMin: PropTypes.string,
    labelMax: PropTypes.string,
    dataTest: PropTypes.string,
    color: PropTypes.string,
};

export default withFormsy(FormsyNumberInputComponent);
