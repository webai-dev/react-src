import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import ReactDOM                 from 'react-dom';
import { KEYS, widgetModalId }  from '../../../../constants';
import classNames               from 'classnames';
import styles                   from './styles.scss';

class ModalWidgetComponent extends PureComponent {
    /**
     * Handle modal close
     */
    handleClose = () => {
        if (this.props.handleClose) {
            this.props.handleClose();
        }
    };
    /**
     * Handle modal close when Esc is pressed
     *
     * @param event
     */
    handleCloseOnEsc = (event) => {
        if (event.key === KEYS.ESC) {
            this.handleClose();
        }
    };

    componentDidMount() {
        document.addEventListener(
            'keydown',
            this.handleCloseOnEsc,
            false,
        );
    }

    componentWillUnmount() {
        document.removeEventListener(
            'keydown',
            this.handleCloseOnEsc,
            false,
        );
    }

    render() {
        const { children, classNameOuter, classNameInner, outside, isInPlace } = this.props;
        const modal = (
            <div
                className={ classNames(
                    classNameOuter,
                    styles.modal,
                    { [ styles.modalVisible ]: isInPlace }
                ) }
                onClick={ (event) => {event.stopPropagation();} }
            >
                { outside }
                <div className={ classNames(styles.box, classNameInner) }>
                    { children }
                </div>
            </div>
        );
        if (isInPlace) {
            return modal;
        }
        return ReactDOM.createPortal(
            modal,
            document.getElementById(widgetModalId),
        );
    }
}

ModalWidgetComponent.propTypes = {
    classNameOuter: PropTypes.string, // use that class to restrict modal width
    classNameInner: PropTypes.string, // use that class to add padding and change display etc.
    handleClose: PropTypes.func, // required either handleClose or linkToClose
    linkToClose: PropTypes.string, // required either handleClose or linkToClose
    children: PropTypes.node.isRequired,
    history: PropTypes.object,
    outside: PropTypes.node,
    isInPlace: PropTypes.bool, // will render modal not inside portal used for widgets
};

export default ModalWidgetComponent;
