import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import RateStarComponent        from './RateStarComponent';
import classNames               from 'classnames';
import styles                   from './styles.scss';

class RatingComponent extends PureComponent {
    state = {
        rate: null,
        glimpseRate: null,
    };

    /**
     * Set temporary selected state on hover or focus
     *
     * @param {number} rate
     */
    handleRateHover = (rate) => {
        this.setState({ rate });
    };
    /**
     * Show selected rate for short period of time
     *
     * @param {number} rate
     */
    handleGlimpseRate = (rate) => {
        this.setState({ glimpseRate: rate });
        setTimeout(
            () => {
                this.setState({ glimpseRate: null });
            },
            1000,
        );
    };

    /**
     * Handler rate click and lunch onRateSelect if there is such prop
     *
     * @param {number} rate
     */
    handleRateSelect = (rate) => {
        this.handleGlimpseRate(rate);
        if (this.props.onRateSelect) {
            this.props.onRateSelect(rate);
        }
    };

    render() {
        const {
            fixed,
            rating: selectedRate,
            small,
            rateLevel = 5,
            className,
            isError,
            dataTest,
            label,
            name,
            errorMessage,
            required,
        } = this.props;
        const { rate, glimpseRate } = this.state;
        const { handleRateHover, handleRateSelect } = this;

        const handleResetRate = () => {handleRateHover(0);};

        const rateProps = fixed ? {} : {
            onBlur: handleResetRate,
            onMouseLeave: handleResetRate,
        };

        const rateStars = [];
        for (let i = 1; i <= rateLevel; i++) {
            rateStars.push(
                <RateStarComponent
                    key={ i }
                    selfRate={ i }
                    rate={ rate }
                    fixed={ fixed }
                    handleRateHover={ handleRateHover }
                    handleRateSelect={ handleRateSelect }
                    selectedRate={ selectedRate }
                    glimpseRate={ glimpseRate }
                    dataTest={ `${ dataTest }-${ i }` }
                />,
            );
        }

        return (
            <div className={ classNames(className, styles.ratingContainer) }>
                <div
                    id={ name }
                    className={ classNames(
                        styles.ratingBox,
                        {
                            [ styles.ratingSmall ]: small,
                        },
                    ) }
                    { ...rateProps }
                >
                    { label &&
                    <span className={ styles.ratingLabel }>
                        { label }
                        { required && <span className={ styles.required }>*</span> }
                     </span>
                    }
                    <div
                        className={ classNames(
                            styles.rating,
                            {
                                [ styles.isError ]: isError
                            }
                        ) }
                    >
                        { rateStars }
                    </div>
                </div>
                { errorMessage &&
                <span className={ styles.error }>
                    { errorMessage }
                </span> }
            </div>

        );
    }
}

RatingComponent.propTypes = {
    rateLevel: PropTypes.number, // Will change stars amount to display default 5
    rating: PropTypes.number,
    className: PropTypes.string,
    label: PropTypes.string,
    dataTest: PropTypes.string,
    name: PropTypes.string,
    small: PropTypes.bool,
    fixed: PropTypes.bool,
    required: PropTypes.bool,
    errorMessage: PropTypes.string, // will show error string
    onRateSelect: PropTypes.func,
    isError: PropTypes.bool,
};

export default RatingComponent;
