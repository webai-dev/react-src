import React, { PureComponent, Fragment } from 'react';
import { withRouter }                     from 'react-router-dom';
import PropTypes                          from 'prop-types';
import ReactDOM                           from 'react-dom';
import { Helmet }                         from 'react-helmet';
import { KEYS }                           from '../../../constants';
import ClientContext                      from '../../../ClientContext';
import classNames                         from 'classnames';
import styles                             from './styles.scss';

class ModalComponent extends PureComponent {
    /**
     * Handle modal close
     */
    handleClose = () => {
        if (this.props.handleClose) {
            this.props.handleClose();
        } else if (this.props.linkToClose && this.props.history) {
            this.props.history.push(this.props.linkToClose);
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
        if (this.context.handleChangeModalsOpened) {
            this.context.handleChangeModalsOpened(1);
        }
        document.addEventListener(
            'keydown',
            this.handleCloseOnEsc,
            false,
        );
    }

    componentWillUnmount() {
        if (this.context.handleChangeModalsOpened) {
            this.context.handleChangeModalsOpened(-1);
        }
        document.removeEventListener(
            'keydown',
            this.handleCloseOnEsc,
            false,
        );
    }

    render() {
        const { children, classNameOuter, classNameInner, outside, isInPlace } = this.props;
        const { handleClose } = this;
        const modal = (
            <div
                className={ classNames(styles.modalContainer, { [ styles.modalVisible ]: isInPlace }) }
                onClick={ (e) => {e.stopPropagation(); handleClose();} }
                onSubmit={ (e) => {e.stopPropagation();} }
                onFocus={ (e) => {e.stopPropagation();} }
                onBlur={ (e) => {e.stopPropagation();} }
                onMouseDown={ (e) => {e.stopPropagation();} }
            >
                <div
                    className={ classNames(
                        classNameOuter,
                        styles.modal,
                    ) }
                    onClick={ (event) => {event.stopPropagation();} }
                >
                    { outside }
                    <div className={ classNames(styles.box, classNameInner) }>
                        { children }
                    </div>
                </div>
            </div>
        );
        if (isInPlace) {
            return modal;
        }
        return ReactDOM.createPortal(
            <Fragment>
                <Helmet>
                    <body data-modal="true" />
                </Helmet>
                { modal }
            </Fragment>,
            document.getElementById('modal'),
        );
    }
}

ModalComponent.propTypes = {
    classNameOuter: PropTypes.string, // use that class to restrict modal width
    classNameInner: PropTypes.string, // use that class to add padding and change display etc.
    handleClose: PropTypes.func, // required either handleClose or linkToClose
    linkToClose: PropTypes.string, // required either handleClose or linkToClose
    children: PropTypes.node.isRequired,
    history: PropTypes.object,
    outside: PropTypes.node,
    isInPlace: PropTypes.bool, // will render modal not inside portal used for widgets
};

export default withRouter(ModalComponent);
export { ModalComponent };
ModalComponent.contextType = ClientContext;
