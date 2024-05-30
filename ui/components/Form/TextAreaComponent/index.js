import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import styles                   from './styles.scss';
import classNames               from 'classnames/bind';

const cx = classNames.bind(styles);

class TextAreaComponent extends PureComponent {
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
     * @param {Event} event
     */
    _handleChangeValue = (event) => {
        let value = this.props.modifyValueOnChange ?
            this.props.modifyValueOnChange(event.currentTarget.value) : event.currentTarget.value;
        this.props.setValue(value);
        if (this.props.onChange) {
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
        const {
            value,
            name,
            errorMessage,
            required,
            className,
            label,
            placeholder,
            transparent
        } = this.props;
        const { _handleChangeValue, _handleInputFocus, _handleInputBlur } = this;
        const { isLabelActive, isInputError, isInputFocus } = this.state;
        return (
            <div
                className={ cx(styles.container, className, {
                    [ styles.containerTransparent ]: transparent,
                    [ styles.containerActive ]: isInputFocus,
                    [ styles.containerLabelActive ]: isLabelActive,
                    [ styles.containerError ]: isInputError,
                }) }
            >
                <div
                    className={ styles.inputBox }
                >
                    <textarea
                        id={ name }
                        className={ styles.input }
                        onChange={ _handleChangeValue }
                        onFocus={ _handleInputFocus }
                        onBlur={ _handleInputBlur }
                        placeholder={ placeholder }
                        value={ value || '' }
                        name={ name }
                    />
                    <span className={ styles.activeLine } />
                </div>
                { (label || errorMessage) && <label
                    className={ styles.label }
                    htmlFor={ name }
                >
                    { label && label }
                    { label && required &&
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

TextAreaComponent.propTypes = {
    setValue: PropTypes.func.isRequired, // IMPORTANT save value in upper component (after modifyValueOnChange)
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]), // IMPORTANT pass value from upper component
    name: PropTypes.string.isRequired, // IMPORTANT used as id in inputs for labels

    label: PropTypes.string, // label text
    onChange: PropTypes.func, // lunch function on every change and pass corresponding value (after modifyValueOnChange)
    modifyValueOnChange: PropTypes.func, // take value change it and return new value (e.g use it to filter some
                                         // characters)
    errorMessage: PropTypes.string, // will show error string
    required: PropTypes.bool, // will show asterisk
    transparent: PropTypes.bool,
    touched: PropTypes.bool,
    className: PropTypes.string, // pass additional css class
    placeholder: PropTypes.string,
};

export default TextAreaComponent;
