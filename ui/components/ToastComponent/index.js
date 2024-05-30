import React              from 'react';
import PropTypes          from 'prop-types';
import { ToastContainer } from 'react-toastify';
import CrossIcon          from '../../../assets/icons/CrossIcon';
import ClientContext      from '../../../ClientContext';
import classNames         from 'classnames';
import styles             from './styles.scss';

/* eslint-disable react/prop-types */
const CloseButton = ({ closeToast }) => (
    <div
        onClick={ closeToast }
        className={ styles.closeButton }
    >
        <CrossIcon />
    </div>
);
/* eslint-enable react/prop-types */

const ToastComponent = (props) => {
    const { className } = props;
    return (
        <ClientContext.Consumer>
            { context => (
                <ToastContainer
                    className={ classNames(className, styles.container, {
                        [styles.containerModal]: !!context.openedModals
                    }) }
                    hideProgressBar
                    closeButton={ <CloseButton /> }
                    autoClose={ 3000 }
                    pauseOnFocus
                />
            ) }

        </ClientContext.Consumer>
    );
};

ToastComponent.propTypes = {
    className: PropTypes.string,

};

export default ToastComponent;
