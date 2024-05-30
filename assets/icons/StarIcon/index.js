import React     from 'react';
import PropTypes from 'prop-types';
import styles    from './styles.scss';

/* eslint-disable max-len */
const StarIcon = ({ offset, stopColor }) => {
    let id = '';
    let pathProps = {};
    let linearGradient = null;
    if (offset && stopColor) {
        const offsetStop = offset.toFixed(2) * 100;
        id = offset && stopColor && `StarIconGradient${offsetStop}${stopColor}`;
        pathProps = { fill: `url(#${id})` };
        linearGradient = (
            <defs>
                <linearGradient id={ id } x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset={ 0 } stopOpacity="1" style={ { stopColor: stopColor } } />
                    <stop offset={ `${offsetStop}%` } stopOpacity="1" style={ { stopColor: stopColor } } />
                    <stop offset={ `${offsetStop}%` } stopOpacity="0" />
                    <stop offset="100%" stopOpacity="0" />
                </linearGradient>
            </defs>
        );
    }
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-2 -2 28 28"
            className={ styles.icon }
        >
            { linearGradient }
            <path
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
                { ...pathProps }
            />
        </svg>
    );
};
/* eslint-enable max-len */

StarIcon.propTypes = {
    offset: PropTypes.number,
    stopColor: PropTypes.string,
};

export default StarIcon;
