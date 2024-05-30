import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames';
import styles                   from './styles.scss';

class NumberInputComponent extends PureComponent {
    render() {
        const {
            rateLevel = 10,
            className,
            isError,
            value,
            setValue,
            name,
            required,
            labelMax,
            labelMin,
            dataTest,
            round,
            color,
            errorMessage,
        } = this.props;
        const colorToUse = color || styles.color;

        const nuberItems = [];
        for (let i = 0; i <= rateLevel; i++) {
            nuberItems.push(
                <button
                    key={ i }
                    type="button"
                    className={ classNames(
                        styles.item,
                        {
                            [ styles.itemActive ]: value === i,
                        })
                    }
                    onClick={ () => {setValue(i);} }
                    data-test={ `${ dataTest }-${ i }` }
                    style={ round ? {
                        backgroundColor: colorToUse,
                        borderColor: colorToUse,
                        color: colorToUse,
                    } : {} }
                >
                    { i }
                </button>,
            );
        }

        return (
            <div
                className={ classNames(
                    className, styles.rateContainer, {
                        [ styles.round ]: round,
                        [ styles.row ]: !round
                    }) }
            >
                <div className={ styles.rateBox }>
                    <div
                        id={ name }
                        className={ classNames(
                            styles.rateButtons,
                            {
                                [ styles.isError ]: isError,
                            },
                        ) }
                        style={ round ? {
                            color: colorToUse,
                        } : {} }
                    >
                        { nuberItems }
                    </div>
                    { (labelMax || labelMin) &&
                    <div className={ styles.labelsBox }>
                        <div className={ styles.labels }>
                            <span>{ labelMin }</span>
                            { round && ', ' }
                            <span>{ labelMax }</span>
                        </div>
                        { required && <span className={ styles.required }>*</span> }
                    </div> }
                </div>
                { errorMessage &&
                <span className={ styles.error }>
                    { errorMessage }
                </span> }
            </div>
        );
    }
}

NumberInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired,
    value: PropTypes.number,
    rateLevel: PropTypes.number, // Will change stars amount to display default 5
    rating: PropTypes.number,
    className: PropTypes.string,
    name: PropTypes.string,
    small: PropTypes.bool,
    isError: PropTypes.bool,
    errorMessage: PropTypes.string, // will show error string
    required: PropTypes.bool,
    labelMax: PropTypes.string,
    labelMin: PropTypes.string,
    dataTest: PropTypes.string,
    color: PropTypes.string,
    round: PropTypes.bool,
};

export default NumberInputComponent;
