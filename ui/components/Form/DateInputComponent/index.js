import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import DatePicker               from 'react-date-picker/dist/entry.nostyle';
import classNames               from 'classnames';
import styles                   from './styles.scss';

class DateInputComponent extends PureComponent {
    state = {
        isLabelActive: this.props.value,
        isInputError: false,
        isInputFocus: false,
        touched: false,
    };

    /**
     * Set the value of the component, which in turn will validate it and the rest of the form (is required for Formsy
     * to work.)
     *
     * @param {Event} value
     */
    _handleChangeValue = (value) => {
        this.props.setValue(value);
        if ( this.props.onChange ) {
            this.props.onChange(value);
        }
    };

    /**
     * Handle input styles on input focus
     *
     * @private
     */
    _handleInputFocus = () => {
        this.setState({
            isLabelActive: true,
            isInputError: false,
            isInputFocus: true,
            touched: true,
        });
    };

    /**
     * Handle Input styles on input blur
     *
     * @private
     */
    _handleInputBlur = () => {
        this.setState({
            isLabelActive: this.props.value || '',
            isInputError: this.props.errorMessage || (this.props.required && !this.props.value),
            isInputFocus: false,
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.touched) {
            this.setState({
                isInputError: this.props.errorMessage || (this.props.required && !this.props.value),
                touched: true,
            });
        }
        if (!this.state.isInputFocus && this.state.touched) {
            this.setState({
                isInputError: this.props.errorMessage || (this.props.required && !this.props.value),
            });
        }
    }

    render() {
        const { _handleChangeValue, _handleInputFocus, _handleInputBlur } = this;
        const { value, className, label, name, required, errorMessage, minDate, maxDate } = this.props;
        const { isInputError, isInputFocus } = this.state;

        return (
            <div
                className={ classNames(styles.container, className, {
                    [ styles.containerActive ]: isInputFocus,
                    [ styles.containerError ]: isInputError,
                }) }
            >
                <div
                    id={ name }
                    className={ styles.inputBox }
                >
                    <DatePicker
                        onFocus={ _handleInputFocus }
                        onChange={ _handleChangeValue }
                        onBlur={ _handleInputBlur }
                        value={ value }
                        clearIcon={ false }
                        calendarIcon={ false }
                        className={ styles.input }
                        minDate={ minDate }
                        maxDate={ maxDate }
                    />
                    <span className={ styles.activeLine } />
                </div>
                { label && <label
                    className={ styles.label }
                    htmlFor={ name }
                >
                    { label }
                    { required &&
                    <span className={ styles.required }>*</span>
                    }
                </label> }
                { errorMessage &&
                <span className={ styles.error }>
                { errorMessage }
            </span> }
            </div>
        );
    }
}

// This component assumes you will save value and change it inside some upper component (use "setValue" and "value" for
// that)
DateInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired, // IMPORTANT save value in upper component (after modifyValueOnChange)
    value: PropTypes.instanceOf(Date), // IMPORTANT pass value from upper component
    name: PropTypes.string.isRequired, // IMPORTANT used as id in inputs for labels
    onChange: PropTypes.func, // lunch function on every change and pass corresponding value (after modifyValueOnChange)
    label: PropTypes.node,
    errorMessage: PropTypes.string, // will show error string
    required: PropTypes.bool, // will show asterisk
    className: PropTypes.string, // pass additional css class
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    touched: PropTypes.bool,
};

export default DateInputComponent;
