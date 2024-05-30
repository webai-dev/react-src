import React               from 'react';
import PropTypes           from 'prop-types';
import { withFormsy }      from 'formsy-react';
import ColorInputComponent from '../../Form/ColorInputComponent';

// TODO check if doesn't have validations add shouldComponentUpdate
// and don't update when other inputs are changing - this should speed up forms a lot
const FormsyColorInputComponent = (props) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        name,
        type,
        required,
        className,
        label,
        isFormSubmitted,
        disabled,
        onClick,
    } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();

    return (
        <ColorInputComponent
            touched={ isFormSubmitted() }
            name={ name }
            value={ value }
            label={ label }
            setValue={ setValue }
            required={ required }
            disabled={ disabled }
            errorMessage={ errorMessage }

            className={ className }
            type={ type }
            onClick={ onClick }
            defaultValue="#ffffff"
        />
    );
};

FormsyColorInputComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    onClick: PropTypes.func,
    getErrorMessage: PropTypes.func.isRequired,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
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
    small: PropTypes.bool, // will make input looks smaller
    className: PropTypes.string,
};

export default withFormsy(FormsyColorInputComponent);
