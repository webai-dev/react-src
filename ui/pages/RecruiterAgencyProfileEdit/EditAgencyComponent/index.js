import React, { Fragment }   from 'react';
import PropTypes             from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                            from '../../../components/ButtonComponent';
import Cross2Icon            from '../../../../assets/icons/Cross2Icon';
import ModalComponent        from '../../../components/ModalComponent';
import InputComponent        from '../../../components/Form/InputComponent';
import PencilIcon            from '../../../../assets/icons/PencilIcon';
import SearchAgencyContainer from './SearchAgencyContainer';
import NewAgencyContainer    from './NewAgencyContainer';
import styles                from './styles.scss';

const EditAgencyComponent = (props) => {
    const {
        handleOpenFormModal,
        showFormModal,
        handleOpenEditModal,
        handleCloseEditModal,
        showEditModal,
        agencyName,
        agencyId,
    } = props;

    return (
        <Fragment>
            <div
                className={ styles.inputBox }
                onMouseDown={ e => {
                    e.preventDefault(); // Prevent input focus which may have suggestions and result in cover modal
                    handleOpenEditModal();
                } }
            >
                <InputComponent
                    setValue={ () => {} }
                    placeholder="Enter agency"
                    name="agencyPlaceholder"
                    post={ <PencilIcon /> }
                    value={ agencyName }
                />
            </div>

            { // MODAL
                showEditModal &&
                <ModalComponent
                    handleClose={ handleCloseEditModal }
                    classNameOuter={ styles.modal }
                >
                    <ButtonComponent
                        ariaLabel="close modal"
                        btnType={ BUTTON_TYPE.LINK }
                        className={ styles.close }
                        onClick={ handleCloseEditModal }
                    >
                        <Cross2Icon />
                    </ButtonComponent>

                    { !showFormModal ?

                        <div className={ styles.form }>
                            <h2 className={ styles.title }>
                                Change agency
                            </h2>
                            <ButtonComponent
                                onClick={ handleOpenFormModal }
                                size={ BUTTON_SIZE.SMALL }
                                btnType={ BUTTON_TYPE.LINK_ACCENT }
                            >
                                Cannot find your agency? Click here
                            </ButtonComponent>
                            <SearchAgencyContainer
                                handleCloseEditModal={ handleCloseEditModal }
                                agencyId={ agencyId }
                            />
                        </div>
                        :

                        <NewAgencyContainer
                            handleCloseEditModal={ handleCloseEditModal }
                            agencyId={ agencyId }
                        /> }

                </ModalComponent>
            }
        </Fragment>
    );
};

EditAgencyComponent.propTypes = {
    handleOpenEditModal: PropTypes.func.isRequired,
    handleCloseEditModal: PropTypes.func.isRequired,
    showEditModal: PropTypes.bool,
    handleOpenFormModal: PropTypes.func.isRequired,
    showFormModal: PropTypes.bool,
    agencyName: PropTypes.string,
    agencyId: PropTypes.string,
};

export default EditAgencyComponent;
