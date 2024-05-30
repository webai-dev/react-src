import React                from 'react';
import PropTypes            from 'prop-types';
import { withFormsy }       from 'formsy-react';
import ToggleYesNoComponent from '../../Form/ToggleYesNoComponent';

const FormsyTextAreaComponent = (props) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        name,
        className,
        label,
        disabled,
    } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();

    return (
        <ToggleYesNoComponent
            value={ value }
            errorMessage={ errorMessage }
            className={ className }
            setValue={ setValue }
            name={ name }
            label={ label }
            disabled={ disabled }
        />
    );
};

FormsyTextAreaComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired,
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
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default withFormsy(FormsyTextAreaComponent);
