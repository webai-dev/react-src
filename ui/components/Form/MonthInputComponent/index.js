import React, {
    PureComponent,
    Fragment,
}                        from 'react';
import PropTypes         from 'prop-types';
import DropDownComponent from '../../DropDownComponent';
import PrevIcon          from '../../../../assets/icons/PrevIcon';
import NextIcon          from '../../../../assets/icons/NextIcon';
import { MONTH_LABELS }  from '../../../../constants';
import classNames        from 'classnames';
import styles            from './styles.scss';


class MonthInputComponent extends PureComponent {
    static CURRENT_DATE = new Date();
    state = {
        currentYear: (this.props.value && this.props.value.getFullYear()) || MonthInputComponent.CURRENT_DATE.getFullYear(),
        isLabelActive: this.props.value,
        isInputError: false,
        isInputFocus: false,
        touched: false,
    };

    /**
     * Set date corresponding to selected month and year
     *
     * @param {number} month - month index from 0 to 11
     */
    handleChangeMonthDate = (month) => {
        this.props.setValue(new Date(Date.UTC(this.state.currentYear, month)));
    };
    /**
     * Increment or Decrement currentYear year by diff
     *
     * @param {number} diff - 1 or -1
     */
    handleChangeYear = (diff) => {
        const newYear = this.state.currentYear + diff;
        const isChangeAllowed =
            (!this.props.minDate || this.props.minDate.getFullYear() <= newYear) &&
            (!this.props.maxDate || this.props.maxDate.getFullYear() >= newYear);
        if (isChangeAllowed) {
            this.setState({ currentYear: this.state.currentYear + diff });
        }
    };
    /**
     * Decrement currentYear year by 1
     */
    handleChangeYearPrev = (event) => {
        event.stopPropagation();
        this.handleChangeYear(-1);
    };
    /**
     * Decrement currentYear year by 1
     */
    handleChangeYearNext = (event) => {
        event.stopPropagation();
        this.handleChangeYear(1);
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
            name = 'datePicker',
            placeholder,
            value,
            label,
            errorMessage,
            required,
            className,
            dataTest,
        } = this.props;
        const { currentYear, isInputFocus, isLabelActive, isInputError } = this.state;
        const { handleChangeMonthDate, handleChangeYearPrev, handleChangeYearNext, _handleInputFocus, _handleInputBlur } = this;

        const monthItems = MONTH_LABELS.map((monthLabel, index) => (
            <button
                tabIndex={ isInputFocus ? 0 : -1 }
                data-test={ `${ dataTest }-${ index }` }
                key={ monthLabel }
                type="button"
                onClick={ () => {handleChangeMonthDate(index);} }
                className={ classNames(
                    styles.month,
                    {
                        [ styles.monthActive ]: (
                            this.props.value &&
                            this.props.value.getFullYear() === currentYear &&
                            this.props.value.getMonth() === index
                        ),
                        [ styles.buttonDisabled ]: (
                            (
                                this.props.minDate &&
                                this.props.minDate.getFullYear() === currentYear &&
                                this.props.minDate.getMonth() > index
                            ) ||
                            (
                                this.props.maxDate &&
                                this.props.maxDate.getFullYear() === currentYear &&
                                this.props.maxDate.getMonth() < index
                            )
                        ),
                    },
                ) }
            >
                { monthLabel }
            </button>
        ));

        const inputValue = (value && `${ MONTH_LABELS[ value.getUTCMonth() ] } ${ value.getFullYear() }`) || '';

        return (<div
                className={ classNames(styles.container, className, {
                    [ styles.containerActive ]: isInputFocus,
                    [ styles.containerLabelActive ]: isLabelActive,
                    [ styles.containerError ]: isInputError,
                }) }
            >
                <DropDownComponent
                    ariaLabel="monthPicker"
                    labelClassName={ styles.inputBox }
                    onBlur={ _handleInputBlur }
                    onFocus={ _handleInputFocus }
                    label={
                        <Fragment>
                            <input
                                data-test={ dataTest }
                                autoComplete="off"
                                id={ name }
                                className={ styles.input }
                                onChange={ () => {} }
                                value={ inputValue }
                                name={ name }
                                placeholder={ placeholder }
                            />
                            <span className={ styles.activeLine } />
                        </Fragment>
                    }
                    selectClassName={ styles.dropDownSelect }
                    select={
                        <Fragment>
                            <div className={ styles.yearBox }>
                                <button
                                    type="button"
                                    className={ classNames(
                                        styles.prevButton,
                                        {
                                            [ styles.buttonDisabled ]: this.props.minDate &&
                                            this.props.minDate.getFullYear() > (currentYear - 1),
                                        },
                                    ) }
                                    onClick={ handleChangeYearPrev }
                                    tabIndex={ isInputFocus ? 0 : -1 }
                                >
                                    <PrevIcon />
                                </button>
                                <div>
                                    { currentYear }
                                </div>
                                <button
                                    type="button"
                                    className={ classNames(
                                        styles.nextButton,
                                        {
                                            [ styles.buttonDisabled ]: this.props.maxDate &&
                                            this.props.maxDate.getFullYear() < (currentYear + 1),
                                        },
                                    ) }
                                    onClick={ handleChangeYearNext }
                                    tabIndex={ isInputFocus ? 0 : -1 }
                                >
                                    <NextIcon />
                                </button>
                            </div>
                            <div className={ styles.monthBox }>
                                { monthItems }
                            </div>
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

MonthInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    name: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    errorMessage: PropTypes.string,
    required: PropTypes.bool,
    touched: PropTypes.bool,
    className: PropTypes.string,
    dataTest: PropTypes.string,
};

export default MonthInputComponent;
