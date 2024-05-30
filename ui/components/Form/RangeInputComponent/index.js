import React     from 'react';
import PropTypes from 'prop-types';
import Slider    from 'react-rangeslider';
import './styles.scss';

const RangeInputComponent = (props) => {
    const { value, setValue, ...restProps } = props;

    return (
        <Slider
            value={ value }
            onChange={ setValue }
            { ...restProps }
        />
    );
};

// check docs for mor props here https://github.com/whoisandy/react-rangeslider/
RangeInputComponent.propTypes = {
    value: PropTypes.number,
    setValue: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
};

export default RangeInputComponent;
