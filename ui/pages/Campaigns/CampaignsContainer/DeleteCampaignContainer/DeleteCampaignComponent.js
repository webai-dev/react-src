import classNames          from 'classnames';
import React, { Fragment } from 'react';
import PropTypes           from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                          from '../../../../components/ButtonComponent';
import Cross2Icon          from '../../../../../assets/icons/Cross2Icon';
import ModalComponent      from '../../../../components/ModalComponent';
import styles              from './styles.scss';

const DeleteCampaignComponent = (props) => {
    const {
        handleOpenModal,
        handleCloseModal,
        handleDelete,
        showModal,
        isLoading,
        campaignTitle,
    } = props;
    const formId = 'SendCodeToEmail';

    return (
        <Fragment>
            <button
                type="button"
                className={ classNames(styles.item) }
                onClick={ handleOpenModal }
                disabled={ isLoading }
            >
                Delete
            </button>

            { // MODAL
                showModal &&
                <ModalComponent handleClose={ handleCloseModal }>
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
                            Are you sure you want to delete campaign: { campaignTitle }?
                        </h2>
                        <ButtonComponent
                            onClick={ () => {
                                handleCloseModal();
                                handleDelete();
                            } }
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                        >
                            Delete
                        </ButtonComponent>
                    </div>
                </ModalComponent>
            }
        </Fragment>
    );
};

DeleteCampaignComponent.propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    showModal: PropTypes.bool,
    isLoading: PropTypes.bool,
    campaignTitle: PropTypes.string,
};

export default DeleteCampaignComponent;
