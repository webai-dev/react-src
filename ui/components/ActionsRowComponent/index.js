import React      from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';
import styles     from './styles.scss';

const ActionsRowComponent = (props) => {
    const { itemActions, pageActions, className } = props;
    return (
        <div className={ classNames(styles.box, className) }>
            <div className={ styles.items }>
                { itemActions }
            </div>
            <div className={ styles.page }>
                { pageActions }
            </div>
        </div>
    );
};

ActionsRowComponent.propTypes = {
    itemActions: PropTypes.node,
    pageActions: PropTypes.node,
    className: PropTypes.string,
};

export default ActionsRowComponent;
