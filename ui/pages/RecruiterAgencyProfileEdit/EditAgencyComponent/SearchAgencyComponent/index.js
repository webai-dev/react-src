import React                 from 'react';
import PropTypes             from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                            from '../../../../components/ButtonComponent';
import ModalComponent        from '../../../../components/ModalComponent';
import SearchComponent       from '../../../../components/Form/SearchComponent';
import AgencyResultContainer from './AgencyResultContainer';
import styles                from './styles.scss';

const SearchAgencyComponent = (props) => {
    const {
        handleSearchAgency,
        agencyValue,
        handleSelectAgency,
        errorMessage,
        agencyId,
        isConfirmModal,
        handleCloseConfirmModal,
        handleOpenConfirmModal,
        isBecomeFreelancer,
        valueToSearch,
        isLoading,
    } = props;

    return (
        <div className={ styles.content }>
            { agencyId && <div className={ styles.freeLancer }>
                <ButtonComponent
                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                    size={ BUTTON_SIZE.SMALL }
                    onClick={ () => {handleOpenConfirmModal();} }
                >
                    I no longer work for an agency
                </ButtonComponent>
            </div> }
            <SearchComponent
                value={ agencyValue }
                name="searchAgency"
                label="Search Agency Name"
                handleChangeValue={ handleSearchAgency }
            />
            <div className={ styles.contentBox }>
                { !valueToSearch && <div className={ styles.noSearchError }>Please type your agency name</div> }
                { valueToSearch && <AgencyResultContainer
                    valueToSearch={ valueToSearch }
                    agencyId={ agencyId }
                    handleOpenConfirmModal={ handleOpenConfirmModal }
                    isLoading={ isLoading }
                /> }
            </div>
            <div className={ styles.error }>
                { errorMessage }
            </div>
            { isConfirmModal && <ModalComponent
                handleClose={ handleCloseConfirmModal }
                classNameInner={ styles.confirmModal }
            >
                <h2 className={ styles.title }>
                    {
                        agencyId ? isBecomeFreelancer ?
                            'Are you sure you wish to become a freelancer?' :
                            'Are you sure you wish to change agency?' :
                            'Are you sure you wish to join this agency?'
                    }
                </h2>
                { agencyId && <div>
                    Any jobs your are currently working on will be transferred to another recruiter or withdrawn
                </div> }
                <div className={ styles.buttonBox }>
                    <ButtonComponent
                        onClick={ handleSelectAgency }
                        className={ styles.button }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                    >
                        {
                            agencyId ? isBecomeFreelancer ?
                                'Become a freelancer' :
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
    handleSearchAgency: PropTypes.func.isRequired,
    agencyValue: PropTypes.string,
    agencyId: PropTypes.string,
    isFreelancer: PropTypes.bool,
    isBecomeFreelancer: PropTypes.bool,
    errorMessage: PropTypes.string,
    valueToSearch: PropTypes.string,
    handleSelectAgency: PropTypes.func.isRequired,
    isConfirmModal: PropTypes.bool,
    isLoading: PropTypes.bool,
    handleCloseConfirmModal: PropTypes.func.isRequired,
    handleOpenConfirmModal: PropTypes.func.isRequired,
};

export default SearchAgencyComponent;
