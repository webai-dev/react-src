import React      from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';
import CrossIcon  from '../../../assets/icons/CrossIcon';
import styles     from './styles.scss';

const AlertComponent = (props) => {
    const { children, type, className, onClose } = props;
    return (
        <div
            className={ classNames(styles.alert, className, {
                [ styles.alertSuccess ]: type === AlertComponent.TYPE.SUCCESS,
                [ styles.alertWarning ]: type === AlertComponent.TYPE.WARNING,
                [ styles.alertError ]: type === AlertComponent.TYPE.ERROR,
                [ styles.alertInfo ]: !type || type === AlertComponent.TYPE.INFO,
                [ styles.alertWithClose ]: !!onClose,
            }) }
        >
            { children }
            { onClose && <div
                className={ styles.close }
                onClick={ onClose }
            >
                <CrossIcon />
            </div> }
        </div>
    );
};

AlertComponent.TYPE = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
};

AlertComponent.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClose: PropTypes.func,
    type: PropTypes.oneOf([
        AlertComponent.TYPE.SUCCESS,
        AlertComponent.TYPE.WARNING,
        AlertComponent.TYPE.ERROR,
        AlertComponent.TYPE.INFO,
    ]),
};

export default AlertComponent;
