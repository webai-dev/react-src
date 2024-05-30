import React      from 'react';
import PropTypes  from 'prop-types';
import styles     from './styles.scss';
import classNames from 'classnames';

const LoaderComponent = (props) => {
    const { small, row, full, invertColor } = props;
    return (
        <div
            className={ classNames(styles.box, 'spinner', {
                [ styles.row ]: row,
                [ styles.small ]: small,
                [ styles.full ]: full,
                [ styles.invertColor ]: invertColor,
            }) }
        >
            <div className={ styles.main }>
                <div className={ styles.left } />
                <div className={ styles.right } />
            </div>
        </div>
    );
};

LoaderComponent.propTypes = {
    small: PropTypes.bool,
    row: PropTypes.bool,
    full: PropTypes.bool,
    invertColor: PropTypes.bool,
};

export default LoaderComponent;
