import React                from 'react';
import PropTypes            from 'prop-types';
import { withFormsy }       from 'formsy-react';
import SelectInputComponent from '../../Form/SelectInputComponent';

const FormsySelectInputComponent = ( props ) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        placeholder,
        name,
        required,
        className,
        label,
        values,
        disabled,
        onInputChange,
        isFormSubmitted,
        isLoading,
        realValue,
    } = props;

    const value = getValue();
    // note! value is a string received from realValue.key and it will be used on form
    const errorMessage = getErrorMessage();
    return (
        <SelectInputComponent
            isLoading={ isLoading }
            touched={ isFormSubmitted() }
            disabled={ disabled }
            onInputChange={ onInputChange }
            values={ values }
            value={ value }
            realValue={ realValue }
            errorMessage={ errorMessage }
            className={ className }
            placeholder={ placeholder }
            setValue={ setValue }
            name={ name }
            label={ label }
            required={ required }
        />
    );
};

FormsySelectInputComponent.propTypes = {
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
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool, // will shade input and will not process input change
    className: PropTypes.string,
    onInputChange: PropTypes.func,
    // {key, label}
    realValue: PropTypes.object,
    // should contain 'title' - string, and 'items' - array of objects {key, label}
    values: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withFormsy(FormsySelectInputComponent);
