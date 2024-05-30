import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import styles                   from './styles.scss';
import classNames               from 'classnames/bind';

class ColorInputComponent extends PureComponent {
    state = {
        isLabelActive: this.props.value,
        isInputError: false,
        touched: false,
    };

    /**
     * Set the value of the component, which in turn will validate it and the rest of the form (is required for Formsy
     * to work.)
     *
     * @param {Event} event
     */
    _handleChangeValue = (event) => {
        let value = event.currentTarget.value || this.props.defaultValue;
        this.props.setValue(value);
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
            touched: true,
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.touched) {
            this.setState({
                isInputError: this.props.errorMessage || (this.props.required && !this.props.value),
                touched: true,
            });
        }
        if (this.state.touched) {
            this.setState({
                isInputError: this.props.errorMessage || (this.props.required && !this.props.value),
            });
        }
    }

    render() {
        const {
            value = '',
            name,
            errorMessage,
            required,
            className,
            label,
            disabled,
            onClick,
        } = this.props;
        const { _handleChangeValue, _handleInputFocus } = this;
        const { isInputError } = this.state;

        return (
            <div
                onClick={ onClick }
                className={ classNames(styles.container, className, {
                    [ styles.containerError ]: isInputError,
                    [ styles.containerDisabled ]: disabled,
                }) }
            >
                <div
                    className={ styles.inputBox }
                >
                    <input
                        id={ name }
                        className={ styles.input }
                        type="color"
                        onChange={ disabled ? () => {} : _handleChangeValue }
                        onClick={ disabled ? () => {} : _handleChangeValue }
                        onFocus={ _handleInputFocus }
                        value={ value || this.props.defaultValue }
                        name={ name }
                    />
                    { label && <label
                        className={ styles.label }
                        htmlFor={ name }
                    >
                        { label }
                        { required &&
                        <span className={ styles.required }>*</span>
                        }
                    </label> }
                </div>
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
ColorInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired, // IMPORTANT save value in upper component (after modifyValueOnChange)
    value: PropTypes.string, // IMPORTANT pass value from upper component
    name: PropTypes.string.isRequired, // IMPORTANT used as id in inputs for labels
    big: PropTypes.bool,
    small: PropTypes.bool,
    touched: PropTypes.bool,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]), // label text
    type: PropTypes.string, // type of HTML input
    errorMessage: PropTypes.string, // will show error string
    required: PropTypes.bool, // will show asterisk
    className: PropTypes.string, // pass additional css class
    defaultValue: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ColorInputComponent;
