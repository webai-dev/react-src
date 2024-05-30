import React                from 'react';
import PropTypes            from 'prop-types';
import SelectInputComponent from '../SelectInputComponent';

const TimeInputComponent = (props) => {
    const {
        name,
        placeholder,
        label,
        errorMessage,
        required,
        className,
        disabled,
        isLoading,
        onInputChange,
        setValue,
        touched,
        value,
    } = props;
    let hours = value.getHours();
    let minutes = value.getMinutes();
    const realValue = (minutes === '30' || minutes === '00') ? '00:00' : `${ hours }:${minutes<10 ? '0': ''}${ minutes }`;
    const timeItems = [ { 'key': '00:00', 'label': '00:00' }, { 'key': '00:30', 'label': '00:30' }, {
        'key': '01:00',
        'label': '01:00'
    }, { 'key': '01:30', 'label': '01:30' }, { 'key': '02:00', 'label': '02:00' }, {
        'key': '02:30',
        'label': '02:30'
    }, { 'key': '03:00', 'label': '03:00' }, { 'key': '03:30', 'label': '03:30' }, {
        'key': '04:00',
        'label': '04:00'
    }, { 'key': '04:30', 'label': '04:30' }, { 'key': '05:00', 'label': '05:00' }, {
        'key': '05:30',
        'label': '05:30'
    }, { 'key': '06:00', 'label': '06:00' }, { 'key': '06:30', 'label': '06:30' }, {
        'key': '07:00',
        'label': '07:00'
    }, { 'key': '07:30', 'label': '07:30' }, { 'key': '08:00', 'label': '08:00' }, {
        'key': '08:30',
        'label': '08:30'
    }, { 'key': '09:00', 'label': '09:00' }, { 'key': '09:30', 'label': '09:30' }, {
        'key': '10:00',
        'label': '10:00'
    }, { 'key': '10:30', 'label': '10:30' }, { 'key': '11:00', 'label': '11:00' }, {
        'key': '11:30',
        'label': '11:30'
    }, { 'key': '12:00', 'label': '12:00' }, { 'key': '12:30', 'label': '12:30' }, {
        'key': '13:00',
        'label': '13:00'
    }, { 'key': '13:30', 'label': '13:30' }, { 'key': '14:00', 'label': '14:00' }, {
        'key': '14:30',
        'label': '14:30'
    }, { 'key': '15:00', 'label': '15:00' }, { 'key': '15:30', 'label': '15:30' }, {
        'key': '16:00',
        'label': '16:00'
    }, { 'key': '16:30', 'label': '16:30' }, { 'key': '17:00', 'label': '17:00' }, {
        'key': '17:30',
        'label': '17:30'
    }, { 'key': '18:00', 'label': '18:00' }, { 'key': '18:30', 'label': '18:30' }, {
        'key': '19:00',
        'label': '19:00'
    }, { 'key': '19:30', 'label': '19:30' }, { 'key': '20:00', 'label': '20:00' }, {
        'key': '20:30',
        'label': '20:30'
    }, { 'key': '21:00', 'label': '21:00' }, { 'key': '21:30', 'label': '21:30' }, {
        'key': '22:00',
        'label': '22:00'
    }, { 'key': '22:30', 'label': '22:30' }, { 'key': '23:00', 'label': '23:00' }, {
        'key': '23:30',
        'label': '23:30'
    } ];

    return (
        <SelectInputComponent
            touched={ touched }
            setValue={ setValue }
            realValue={ { key: realValue, label: realValue } }
            value={ realValue }
            name={ name }
            placeholder={ placeholder }
            labe={ label }
            errorMessage={ errorMessage }
            required={ required }
            className={ className }
            disabled={ disabled }
            isLoading={ isLoading }
            onInputChange={ onInputChange }
            values={ [ { items: timeItems } ] }
        />
    );
};

TimeInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    errorMessage: PropTypes.string,
    required: PropTypes.bool,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    touched: PropTypes.bool,
    className: PropTypes.string,
    onInputChange: PropTypes.func,
};

export default TimeInputComponent;
