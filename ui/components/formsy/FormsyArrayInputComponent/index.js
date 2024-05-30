import React               from 'react';
import PropTypes           from 'prop-types';
import { withFormsy }      from 'formsy-react';
import ArrayInputComponent from '../../Form/ArrayInputComponent';

const FormsyArrayInputComponent = (props) => {
    const { setValue, values, name, isInnerApp, maxValues, maxValuesText, getValue, dataTest } = props;
    const value = getValue();
    return (
        <ArrayInputComponent
            dataTest={ dataTest }
            setValue={ setValue }
            values={ values }
            value={ value }
            name={ name }
            isInnerApp={ isInnerApp }
            maxValues={ maxValues }
            maxValuesText={ maxValuesText }
        />
    );
};

FormsyArrayInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    values: PropTypes.array.isRequired,
    value: PropTypes.array,
    name: PropTypes.string.isRequired,
    isInnerApp: PropTypes.bool,
    maxValues: PropTypes.number,
    maxValuesText: PropTypes.string,
    dataTest: PropTypes.string,
};

export default withFormsy(FormsyArrayInputComponent);
