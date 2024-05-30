import React               from 'react';
import PropTypes           from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
} from '../../../../components/ButtonComponent';
import ModalComponent               from '../../../../components/ModalComponent';
import FormsyComponent              from '../../../../components/formsy/FormsyComponent';
import FormsySubmitComponent        from '../../../../components/formsy/FormsySubmitComponent';
import FormsyInputComponent         from '../../../../components/formsy/FormsyInputComponent';
import LocationFormsyInputComponent from '../../../../components/LocationFormsyInputComponent';
import styles                       from './styles.scss';

const SearchAgencyComponent = (props) => {
    const {
        handleSubmit,
        isLoading,
        error,
        isConfirmModal,
        handleCloseConfirmModal,
        handleOpenConfirmModal,
        agencyId,
    } = props;

    const formId = 'SendAgencyProposalId';

    return (
        <div className={ styles.form }>
            <h2 className={ styles.title }>
                What is your agency
            </h2>
            <FormsyComponent
                onValidSubmit={ handleOpenConfirmModal }
                formId={ formId }
                errorMessage={ error }
            >
                <FormsyInputComponent
                    name="name"
                    placeholder="Enter agency name"
                    label="Agency name"
                    required
                />
                <LocationFormsyInputComponent
                    label="City and state"
                    name="postcode"
                    limit={ 5 }
                />
                <FormsyInputComponent
                    label="LinkedIn Url"
                    placeholder="Enter agency URL"
                    name="website"
                />
                <FormsySubmitComponent
                    className={ styles.button }
                    formId={ formId }
                    disabled={ isLoading }
                >
                    Send
                </FormsySubmitComponent>
            </FormsyComponent>
            { isConfirmModal && <ModalComponent
                handleClose={ handleCloseConfirmModal }
                classNameInner={ styles.confirmModal }
            >
                <h2 className={ styles.title }>
                    {
                        agencyId ?
                            'Are you sure you wish to change agency?' :
                            'Are you sure you wish to join this agency?'
                    }
                </h2>
                { agencyId && <div>
                    Any jobs your are currently working on will be transferred to another recruiter or withdrawn
                </div> }
                <div className={ styles.buttonBox }>
                    <ButtonComponent
                        onClick={ handleSubmit }
                        className={ styles.button }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                    >
                        {
                            agencyId ?
                                'Change agency' :
                                'Join agency'
                        }
                    </ButtonComponent>
                    <ButtonComponent
                        onClick={ handleCloseConfirmModal }
                        className={ styles.button }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                    >
                        Cancel
                    </ButtonComponent>
                </div>
            </ModalComponent> }
        </div>

    );
};

SearchAgencyComponent.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleCloseConfirmModal: PropTypes.func.isRequired,
    handleOpenConfirmModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    isConfirmModal: PropTypes.bool,
    error: PropTypes.string,
    agencyId: PropTypes.string,
};

export default SearchAgencyComponent;
