import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import styles                   from './styles.scss';
import classNames               from 'classnames/bind';

class InputComponent extends PureComponent {
    state = {
        isLabelActive: this.props.value,
        isInputError: false,
        isInputFocus: false,
        touched: false,
    };

    /**
     * Fix google chrome auto fill
     *
     * @param {Object} ref
     */
    _handleFixAutoFill = ( ref ) => {
        setTimeout(() => {
            if ( ref && (window.getComputedStyle(ref).backgroundColor === 'rgb(250, 255, 189)')) {
                this.setState({ isLabelActive: true });
            }
        }, 100);
    };

    /**
     * Set the value of the component, which in turn will validate it and the rest of the form (is required for Formsy to work.)
     *
     * @param {Event} event
     */
    _handleChangeValue = ( event ) => {
        let value = this.props.modifyValueOnChange ?
            this.props.modifyValueOnChange(event.currentTarget.value) : event.currentTarget.value;
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
        if ( !this.state.isInputFocus && this.state.touched ) {
            this.setState({
                isInputError: this.props.errorMessage || (this.props.required && !this.props.value),
            });
        }
    }

    render() {
        const {
            placeholder,
            value = '',
            name,
            type = 'text',
            errorMessage,
            required,
            className,
            label,
            big,
            small,
            pre,
            post,
            modifyValueOnDisplay,
            disabled,
        } = this.props;
        const { _handleChangeValue, _handleInputFocus, _handleInputBlur, _handleFixAutoFill } = this;
        const { isInputError, isInputFocus } = this.state;

        return (
            <div
                className={ classNames(styles.container, className, {
                    [ styles.containerBig ]: big,
                    [ styles.containerSmall ]: small,
                    [ styles.containerActive ]: isInputFocus,
                    [ styles.containerError ]: isInputError,
                    [ styles.containerDisabled ]: disabled,
                }) }
            >
                <div
                    className={ styles.inputBox }
                >
                    { pre && <div className={ styles.pre }>{ pre }</div> }
                    <input
                        id={ name }
                        className={ styles.input }
                        type={ type }
                        onChange={ disabled ? () => {} : _handleChangeValue }
                        onFocus={ _handleInputFocus }
                        onBlur={ _handleInputBlur }
                        value={ modifyValueOnDisplay ? modifyValueOnDisplay(value|| '') : value|| '' }
                        name={ name }
                        placeholder={ placeholder }
                        ref={ _handleFixAutoFill }
                    />
                    <span className={ styles.activeLine } />
                    { post && <div className={ styles.post }>{ post }</div> }
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

// This component assumes you will save value and change it inside some upper component (use "setValue" and "value" for that)
InputComponent.propTypes = {
    setValue: PropTypes.func.isRequired, // IMPORTANT save value in upper component (after modifyValueOnChange)
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]), // IMPORTANT pass value from upper component
    name: PropTypes.string.isRequired, // IMPORTANT used as id in inputs for labels
    big: PropTypes.bool,
    small: PropTypes.bool,
    touched: PropTypes.bool,
    placeholder: PropTypes.string, // text to show when input has nothing
    label: PropTypes.string, // label text
    type: PropTypes.string, // type of HTML input
    onChange: PropTypes.func, // lunch function on every change and pass corresponding value (after modifyValueOnChange)
    modifyValueOnChange: PropTypes.func, // take value change it and return new value (e.g use it to filter some characters)
    errorMessage: PropTypes.string, // will show error string
    required: PropTypes.bool, // will show asterisk
    className: PropTypes.string, // pass additional css class
    pre: PropTypes.node, // additional label before input ($    100)
    post: PropTypes.node, // additional label after input (100   $)
    modifyValueOnDisplay: PropTypes.func,
    disabled: PropTypes.bool,
};

export default InputComponent;
