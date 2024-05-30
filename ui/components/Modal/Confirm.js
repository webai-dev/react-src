import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import { confirmable, createConfirmation }           from 'react-confirm';
import TEST_IDS                                      from '../../../tests/testIds';
import Modal                                         from './Modal';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../ButtonComponent';
import { Provider }                                  from 'mobx-react';
import { store }                                     from '../../../stores';
import styles                                        from './Modal.scss';

const ConfirmDialog = confirmable(
    (props) => {
        const { show, proceed, dismiss, cancel, display, options } = props;
        return (
            <Provider store={ store }>
                <Modal
                    toggle={ dismiss }
                    isOpen={ show }
                    title={ options.title }
                >
                    <div>{ display }</div>
                    <div className={ styles.buttonBox }>
                        { options.cancel && (
                            <ButtonComponent
                                main
                                btnType={ BUTTON_TYPE.ACCENT }
                                size={ BUTTON_SIZE.BIG }
                                onClick={ () => cancel('cancel') }
                                className={ styles.button }
                            >
                                { options.cancel }
                            </ButtonComponent>
                        ) }
                        { options.proceed && (
                            <ButtonComponent
                                btnType={ BUTTON_TYPE.ACCENT }
                                size={ BUTTON_SIZE.BIG }
                                onClick={ () => proceed('proceed') }
                                className={ styles.button }
                                dataTest={ TEST_IDS.CONFIRM_SUBMIT }
                            >
                                { options.proceed }
                            </ButtonComponent>
                        ) }
                    </div>
                </Modal>
            </Provider>
        );
    }
);

ConfirmDialog.propTypes = {
    show: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
    proceed: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
    cancel: PropTypes.func, // from confirmable. call to close the dialog with promise rejected.
    dismiss: PropTypes.func, // from confirmable. call to only close the dialog.
    display: PropTypes.node, // arguments of your confirm function
    options: PropTypes.object // arguments of your confirm function
};

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.

const confirm = createConfirmation(ConfirmDialog);

export default function (display, options = {}) {
    // You can pass whatever you want to the component. These arguments will be your Component's props
    return confirm({ display, options });
}
