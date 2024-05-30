import React      from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';
import styles     from './styles.scss';

const BadgeComponent = (props) => {
    const { children, className } = props;

    return (
        <div className={ classNames(styles.badge, className) }>
            { children }
        </div>
    );
};

BadgeComponent.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default BadgeComponent;
