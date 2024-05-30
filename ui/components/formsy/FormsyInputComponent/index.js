import React          from 'react';
import PropTypes      from 'prop-types';
import { withFormsy } from 'formsy-react';
import InputComponent from '../../Form/InputComponent';

// TODO check if doesn't have validations add shouldComponentUpdate
// and don't update when other inputs are changing - this should speed up forms a lot
const FormsyInputComponent = (props) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        placeholder,
        name,
        type,
        required,
        className,
        modifyValueOnChange,
        modifyValueOnDisplay,
        label,
        big,
        small,
        pre,
        post,
        onChange,
        isFormSubmitted,
        disabled,
    } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();

    return (
        <InputComponent
            touched={ isFormSubmitted() }
            name={ name }
            value={ value }
            label={ label }
            setValue={ setValue }
            onChange={ onChange }
            modifyValueOnChange={ modifyValueOnChange }
            modifyValueOnDisplay={ modifyValueOnDisplay }
            required={ required }
            disabled={ disabled }
            errorMessage={ errorMessage }

            className={ className }
            type={ type }
            placeholder={ placeholder }

            small={ small }
            big={ big }
            pre={ pre }
            post={ post }
        />
    );
};

FormsyInputComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    validations: PropTypes.oneOfType([ // used in withFormsy
        PropTypes.string,
        PropTypes.object,
    ]),
    validationError: PropTypes.oneOfType([ // used in withFormsy
        PropTypes.string,
        PropTypes.object,
    ]),
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    big: PropTypes.bool, // will make input looks bigger
    small: PropTypes.bool, // will make input looks smaller
    className: PropTypes.string,
    modifyValueOnChange: PropTypes.func,
    modifyValueOnDisplay: PropTypes.func,
    onChange: PropTypes.func,
    pre: PropTypes.node,
    post: PropTypes.node,
};

export default withFormsy(FormsyInputComponent);
