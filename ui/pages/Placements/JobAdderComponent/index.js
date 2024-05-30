import React, { Fragment } from 'react';
import PropTypes           from 'prop-types';
import { ROUTES }          from '../../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                          from '../../../components/ButtonComponent';
import Cross2Icon          from '../../../../assets/icons/Cross2Icon';
import ModalComponent      from '../../../components/ModalComponent';
import styles              from './styles.scss';

const JobAdderComponent = (props) => {
    const { handleCloseModal, showModal, isJobadderIntegrated, handleOpenModal } = props;

    return (
        <Fragment>
            { !isJobadderIntegrated ?
                <ButtonComponent
                    className={ styles.jobAdderButton }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.BIG }
                    onClick={ handleOpenModal }
                >
                    Connect To JobAdder
                </ButtonComponent>
                :
                <div className={ styles.jobAdderStatement }>
                    Integrated to JobAdder
                </div> }

            { // MODAL
                showModal &&
                <ModalComponent
                    handleClose={ handleCloseModal }
                    classNameOuter={ styles.modal }
                >
                    <ButtonComponent
                        ariaLabel="close modal"
                        btnType={ BUTTON_TYPE.LINK }
                        className={ styles.close }
                        onClick={ handleCloseModal }
                    >
                        <Cross2Icon />
                    </ButtonComponent>
                    <div
                        className={ styles.form }
                    >
                        <h2 className={ styles.title }>
                            Connect To JobAdder
                        </h2>
                        <div className={ styles.text }>
                            <p>
                                Connecting to JobAdder will import your placement data to create seamless automation of review collection.
                            </p>
                            <p>
                                After connecting, your previous 12 months of placements will be available to request reviews.
                                Any future placements will be imported for you to automate review collection.
                            </p>
                            <p>
                                By connecting your JobAdder account you are confirming you have the authority or approval to do so.
                            </p>
                        </div>
                        <div className={ styles.buttonBox }>
                            <ButtonComponent
                                className={ styles.button }
                                btnType={ BUTTON_TYPE.LINK }
                                size={ BUTTON_SIZE.BIG }
                                forceHref
                                onClick={ handleCloseModal }
                            >
                                Cancel
                            </ButtonComponent>
                            <ButtonComponent
                                className={ styles.button }
                                btnType={ BUTTON_TYPE.ACCENT }
                                size={ BUTTON_SIZE.BIG }
                                forceHref
                                to={ ROUTES.JOBADDER_LOGIN }
                            >
                                Connect
                            </ButtonComponent>
                        </div>
                    </div>
                </ModalComponent>
            }
        </Fragment>
    );
};

JobAdderComponent.propTypes = {
    handleSubmit: PropTypes.func,
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    showModal: PropTypes.bool,
    isJobadderIntegrated: PropTypes.bool,
};

export default JobAdderComponent;
