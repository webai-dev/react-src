import React             from 'react';
import PropTypes         from 'prop-types';
import { withFormsy }    from 'formsy-react';
import CheckBoxComponent from '../../CheckBoxComponent';

const FormsyCheckboxComponent = (props) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        name,
        required,
        className,
        label,
        isInnerApp,
        isFormSubmitted,
        dataTest,
    } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();

    return (
        <CheckBoxComponent
            dataTest={ dataTest }
            touched={ isFormSubmitted() }
            name={ name }
            value={ value }
            onChange={ setValue }
            label={ label }
            className={ className }
            errorMessage={ errorMessage }
            required={ required }
            isInnerApp={ isInnerApp }
        />
    );
};

FormsyCheckboxComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    className: PropTypes.string,
    dataTest: PropTypes.string,
    label: PropTypes.string,
    isInnerApp: PropTypes.bool,
};

export default withFormsy(FormsyCheckboxComponent);
