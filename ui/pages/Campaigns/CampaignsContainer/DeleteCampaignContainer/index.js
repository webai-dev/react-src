import PropTypes                from 'prop-types';
import React, { PureComponent } from 'react';
import DeleteCampaignComponent  from './DeleteCampaignComponent';

class AddPeopleToListContainer extends PureComponent {
    state = {
        showModal: false,
    };
    /**
     * Will open modal to send email
     */
    handleOpenModal = () => {
        this.setState({ showModal: true });
    };
    /**
     * Will close modal to send email
     */
    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    render() {
        const { handleOpenModal, handleCloseModal } = this;
        const { showModal } = this.state;
        const { isLoading, handleDelete, campaignTitle } = this.props;
        return (
            <DeleteCampaignComponent
                isLoading={ isLoading }
                showModal={ showModal }
                handleCloseModal={ handleCloseModal }
                handleOpenModal={ handleOpenModal }
                handleDelete={ handleDelete }
                campaignTitle={ campaignTitle }
            />
        );
    }
}

AddPeopleToListContainer.propTypes = {
    isLoading: PropTypes.bool,
    campaignTitle: PropTypes.string,
    handleDelete: PropTypes.func.isRequired,
};

export default AddPeopleToListContainer;
