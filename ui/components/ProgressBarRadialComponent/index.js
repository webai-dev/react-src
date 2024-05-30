import React      from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';
import styles     from './styles.scss';

const ProgressBarRadialComponent = (props) => {
    const { progress, big } = props;

    return (
        <div className={ classNames(styles.donut, { [ styles.donutBig ]: big }) }>
            <div
                className={ styles.one }
                style={ {
                    transform: `rotate(${ progress < 50 ? (-180 + 180 * (progress * 2 / 100)) : 0 }deg)`
                } }
            />
            <div
                className={ styles.two }
                style={ {
                    backgroundColor: progress < 50 ? styles.colorEmpty : styles.colorFill,
                    transform: `rotate(${ progress < 50 ? 0 : (180 + 180 * (2 * (progress - 50) / 100)) }deg)`
                } }
            />
            <div className={ styles.center }>
                <span>{ progress }%</span>
            </div>
        </div>
    );
};

ProgressBarRadialComponent.propTypes = {
    progress: PropTypes.number.isRequired, // from 0 to 100
    big: PropTypes.bool, // from 0 to 100
};

export default ProgressBarRadialComponent;
