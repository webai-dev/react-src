import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import EditAgencyComponent      from './EditAgencyComponent';

class EditAgencyContainer extends PureComponent {
    state = {
        showEditModal: false,
        showFormModal: false,
    };
    /**
     * Will open modal to edit agency
     */
    handleOpenFormModal = () => {
        this.setState({ showFormModal: true });
    };
    /**
     * Will open modal to edit agency
     */
    handleOpenEditModal = () => {
        this.setState({ showEditModal: true });
    };
    /**
     * Will close modal to edit agency
     */
    handleCloseEditModal = () => {
        this.setState({ showEditModal: false, showFormModal: false });
    };

    render() {
        const { agencyName, agencyId } = this.props;
        const { handleOpenFormModal, handleOpenEditModal, handleCloseEditModal } = this;
        const { showFormModal, showEditModal } = this.state;
        return (
            <EditAgencyComponent
                agencyId={ agencyId }
                agencyName={ agencyName }
                showEditModal={ showEditModal }
                handleCloseEditModal={ handleCloseEditModal }
                handleOpenEditModal={ handleOpenEditModal }
                showFormModal={ showFormModal }
                handleOpenFormModal={ handleOpenFormModal }
            />
        );
    }
}

EditAgencyContainer.propTypes = {
    agencyName: PropTypes.string,
    agencyId: PropTypes.string
};

export default EditAgencyContainer;
