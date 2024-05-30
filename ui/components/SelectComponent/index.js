import React, {
    PureComponent,
    Fragment,
}                        from 'react';
import PropTypes         from 'prop-types';
import DropDownComponent from '../DropDownComponent';
import DownIcon          from '../../../assets/icons/DownIcon';
import classNames        from 'classnames';
import styles            from './styles.scss';

class SelectComponent extends PureComponent {
    state = {
        isLabelActive: this.props.value,
        isInputError: false,
        isInputFocus: false,
        touched: false,
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

    /**
     * Set the value of the component, which in turn will validate it and the rest of the form (is required for Formsy
     * to work.)
     *
     * @param {string} value
     */
    _handleChangeValue = (value) => {
        this.props.setValue(value);
        if (this.props.onChange) {
            this.props.onChange(value);
        }
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
        const { isInputError, isInputFocus } = this.state;
        const { _handleInputFocus, _handleInputBlur, _handleChangeValue } = this;
        const {
            value,
            values,
            className,
            label,
            required,
            name,
            selectClassName,
            dataTest,
            isWhite,
            notSelectedLabel,
            disabled,
        } = this.props;
        let currentLabel = '';
        values.forEach((itemValue) => {
            if (itemValue.key === value) {
                currentLabel = itemValue.label;
            }
        });
        currentLabel = currentLabel || notSelectedLabel || 'Please select';

        return (
            <div
                className={ classNames(
                    className,
                    styles.container,
                    {
                        [ styles.containerError ]: isInputError,
                        [ styles.containerDisabled ]: disabled,
                    },
                ) }
            >
                <DropDownComponent
                    className={ styles.dropDown }
                    onFocus={ _handleInputFocus }
                    onBlur={ _handleInputBlur }
                    labelClassName={ classNames(styles.dropDownLabel, { [ styles.whiteLabel ]: isWhite }) }
                    labelId={ name }
                    label={
                        <Fragment>
                            <span
                                className={ styles.value }
                                data-test={ dataTest }
                            >{ currentLabel }</span>
                            { ' ' }
                            <DownIcon />
                        </Fragment>
                    }
                    selectClassName={ classNames(styles.dropDownSelect, selectClassName) }
                    select={
                        <Fragment>
                            { values.map((item) => {
                                return (
                                    <button
                                        data-test={ item.label }
                                        key={ item.key }
                                        type="button"
                                        className={ classNames(styles.item, { [ styles.itemActive ]: item.key === value }) }
                                        onClick={ () => {_handleChangeValue(item.key);} }
                                        tabIndex={ isInputFocus ? 0 : -1 }
                                    >
                                        { item.label }
                                    </button>
                                );
                            }) }
                        </Fragment>
                    }
                />
                { label &&
                <div className={ styles.label }>
                    { label }
                    { required && <span className={ styles.required }>*</span> }
                </div>
                }
            </div>

        );
    }
}

SelectComponent.propTypes = {
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.string, PropTypes.bool ]),
    name: PropTypes.string,
    setValue: PropTypes.func.isRequired,
    values: PropTypes.array.isRequired,
    className: PropTypes.string,
    errorMessage: PropTypes.string,
    selectClassName: PropTypes.string,
    dataTest: PropTypes.string,
    label: PropTypes.string, // will change styles for dropdown select for form and add label
    required: PropTypes.bool, // if form it will add asterisk
    touched: PropTypes.bool, // if form it will add asterisk
    onChange: PropTypes.func, // lunch function on every change and pass corresponding value
    isWhite: PropTypes.bool,
    notSelectedLabel: PropTypes.string,
    disabled: PropTypes.bool,
};

export default SelectComponent;
