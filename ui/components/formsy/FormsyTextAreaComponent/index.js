import React             from 'react';
import PropTypes         from 'prop-types';
import { withFormsy }    from 'formsy-react';
import TextAreaComponent from '../../Form/TextAreaComponent';

const FormsyTextAreaComponent = ( props ) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        name,
        required,
        className,
        modifyValueOnChange,
        label,
        placeholder,
        transparent,
        isFormSubmitted,
    } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();

    return (
        <TextAreaComponent
            touched={ isFormSubmitted() }
            value={ value }
            errorMessage={ errorMessage }
            className={ className }
            setValue={ setValue }
            name={ name }
            modifyValueOnChange={ modifyValueOnChange }
            label={ label }
            required={ required }
            placeholder={ placeholder }
            transparent={ transparent }
        />
    );
};

FormsyTextAreaComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired,
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
    transparent: PropTypes.bool,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    modifyValueOnChange: PropTypes.func
};

export default withFormsy(FormsyTextAreaComponent);
