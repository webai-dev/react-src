import React      from 'react';
import PropTypes  from 'prop-types';
import StarIcon   from '../../../../assets/icons/StarIcon';
import classNames from 'classnames';
import styles     from './styles.scss';

const RateStarComponent = (props) => {
    const {
        handleRateHover,
        rate = 0,
        selfRate, // Rate for exactly that star (1 or 2 or 3 or 4 or 5)
        selectedRate, // Rate passed as total rating (from 1 to 5)
        glimpseRate, // Rate selected on user click action (will be displayed for short time)
        fixed,
        handleRateSelect,
        dataTest,
    } = props;
    const handleSelfRateHover = () => {handleRateHover(selfRate);};
    const handleSelfRateSelect = () => {handleRateSelect(selfRate);};

    const isPartialFill = selfRate !== selectedRate && selfRate === Math.ceil(selectedRate) && !rate;
    const rateToShow = glimpseRate || selectedRate;

    const rateStarProps = fixed ? {} : {
        onMouseOver: handleSelfRateHover,
        onFocus: handleSelfRateHover,
        onClick: handleSelfRateSelect,
        tabIndex: '0',
    };

    const Component = fixed ? 'div' : 'button';
    return (
        <Component
            data-test={ dataTest }
            type={ fixed ? null : 'button' }
            { ...rateStarProps }
            className={ classNames(
                styles.star,
                {
                    [ styles.starActive ]: selfRate <= rate,
                    [ styles.starFixed ]: fixed,
                    [ styles.starCompleted ]: selfRate <= rateToShow && (glimpseRate || !rate),
                    [ styles.starPartialCompleted ]: isPartialFill && !rate && !glimpseRate,
                },
            ) }
        >
            { isPartialFill ? <StarIcon
                    stopColor={ styles.stopColor }
                    offset={ 1 + rateToShow - selfRate }
                /> :
                <StarIcon /> }
        </Component>
    );
};
RateStarComponent.propTypes = {
    selfRate: PropTypes.number.isRequired,
    rate: PropTypes.number,
    dataTest: PropTypes.string,
    handleRateHover: PropTypes.func,
    handleRateSelect: PropTypes.func,
    fixed: PropTypes.bool,
    selectedRate: PropTypes.number,
    glimpseRate: PropTypes.number,
};

export default RateStarComponent;
