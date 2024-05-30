import React, {
    PureComponent,
    Fragment,
}                        from 'react';
import PropTypes         from 'prop-types';
import DropDownComponent from '../../DropDownComponent';
import LoaderComponent   from '../../LoaderComponent';
import classNames        from 'classnames';
import styles            from './styles.scss';


class SelectInputComponent extends PureComponent {
    state = {
        isLabelActive: this.props.value,
        isInputError: false,
        isInputFocus: false,
        valueToShow: '',
        touched: false,
        realValue: this.props.realValue // object {key, label}
    };

    /**
     * Handle input onChange - will show current value of input but not real value
     *
     * @param {ReactEvent} event
     */
    _handleSetVisibleValue = (event) => {
        const valueToShow = event.target.value;
        this.setState({ valueToShow });
        if (this.props.onInputChange) {
            this.props.onInputChange(valueToShow);
        }
        // clear value if user clear input filed
        if (!valueToShow) {
            this._handleSetValue('');
        }
    };

    /**
     * Handle input onChange - will show current value of input not real value
     *
     * @param {Object} value - {label, key}
     */
    _handleSetValue = (value) => {
        this.ref.blur();
        this.setState({ valueToShow: value && value.label, realValue: value });
        this.props.setValue(value.key, value.label);
        if (this.props.onInputChange) {
            this.props.onInputChange(value.key);
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
            valueToShow: this.state.realValue && this.state.realValue.label,
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
                isInputError: this.props.errorMessage || (this.props.required && !nextProps.value),
                touched: true,
            });
        }
        if (!this.state.isInputFocus && this.state.touched) {
            this.setState({
                isInputError: this.props.errorMessage || (this.props.required && !nextProps.value),
            });
        }
    }

    render() {
        const {
            name,
            placeholder,
            label,
            errorMessage,
            required,
            className,
            values,
            disabled,
            isLoading,
        } = this.props;
        const { isInputFocus, isLabelActive, isInputError, valueToShow, realValue: value } = this.state;
        const { _handleInputFocus, _handleInputBlur, _handleSetVisibleValue, _handleSetValue } = this;

        const suggestions = values.map((group, index) => {
            return (
                <Fragment key={ index }>
                    { group.title && <div className={ styles.title }>
                        { group.title }
                    </div> }
                    { group.items.map((item) => {
                        return (
                            <button
                                key={ item.key }
                                type="button"
                                className={ styles.item }
                                onClick={ () => {_handleSetValue(item);} }
                                data-test={ item.key }
                            >
                                { item.label }
                            </button>
                        );
                    }) }
                </Fragment>
            );
        });

        return (<div
                className={ classNames(
                    styles.container,
                    className,
                    {
                        [ styles.containerActive ]: isInputFocus,
                        [ styles.containerLabelActive ]: isLabelActive,
                        [ styles.containerError ]: isInputError,
                        [ styles.containerDisabled ]: disabled,
                    },
                ) }
            >
                <DropDownComponent
                    ariaLabel="selectInput"
                    labelClassName={ styles.inputBox }
                    onBlur={ _handleInputBlur }
                    onFocus={ _handleInputFocus }
                    isLabelFocusable
                    label={
                        <Fragment>
                            <input
                                autoComplete="off"
                                id={ name }
                                className={ styles.input }
                                onChange={ _handleSetVisibleValue }
                                value={ (isInputFocus ? valueToShow : value && value.label) || '' }
                                name={ name }
                                placeholder={ placeholder }
                                ref={ ref => {this.ref = ref;} }
                            />
                            <span className={ styles.activeLine } />
                        </Fragment>
                    }
                    selectClassName={ styles.dropDownSelect }
                    select={
                        <Fragment>
                            { !isLoading ? suggestions : <LoaderComponent
                                small
                                row
                            /> }
                        </Fragment>
                    }
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
                { errorMessage &&
                <span className={ styles.error }>
                    { errorMessage }
                </span> }
            </div>
        );
    }
}

SelectInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    realValue: PropTypes.object,
    label: PropTypes.string,
    errorMessage: PropTypes.string,
    required: PropTypes.bool,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    touched: PropTypes.bool,
    className: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.object).isRequired, // should contain 'title' - string, and 'items' - array of
                                                            // strings
    onInputChange: PropTypes.func,
};

export default SelectInputComponent;
