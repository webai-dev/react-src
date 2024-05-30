import React           from 'react';
import PropTypes       from 'prop-types';
import { withFormsy }  from 'formsy-react';
import SelectComponent from '../../SelectComponent';

const FormsySelectComponent = (props) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        required,
        className,
        label,
        values,
        isFormSubmitted,
        onChange,
        name,
        selectClassName,
        dataTest,
        notSelectedLabel,
        disabled,
    } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();

    return (
        <SelectComponent
            dataTest={ dataTest }
            selectClassName={ selectClassName }
            name={ name }
            touched={ isFormSubmitted() }
            value={ value }
            setValue={ setValue }
            values={ values }
            className={ className }
            errorMessage={ errorMessage }
            required={ required }
            label={ label }
            form
            onChange={ onChange }
            notSelectedLabel={ notSelectedLabel }
            disabled={ disabled }
        />
    );
};

FormsySelectComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    className: PropTypes.string,
    label: PropTypes.string,
    selectClassName: PropTypes.string,
    dataTest: PropTypes.string,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    notSelectedLabel: PropTypes.string,
    disabled: PropTypes.bool,
};

export default withFormsy(FormsySelectComponent);
