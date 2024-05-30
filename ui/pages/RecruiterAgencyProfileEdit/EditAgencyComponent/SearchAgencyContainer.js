import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import SearchAgencyComponent    from './SearchAgencyComponent';
import { toast }                from 'react-toastify';
import {
    graphql,
}                               from 'react-relay';
import {
    LoginManager,
    commitMutation,
    environment,
}                               from '../../../../api';
import debounce                 from 'lodash/debounce';
import {
    THROTTLE_TIME,
}                               from '../../../../constants';
import getErrorMessage          from '../../../../util/getErrorMessage';

const mutationChangeAgency = graphql`
    mutation SearchAgencyContainerChangeMutation($agency: ID) {
        mutator {
            changeAgency(agency: $agency) {
                viewer {
                    user {
                        ...on Recruiter {
                            agency {
                                name
                                slug
                                id
                            }
                        }
                    }
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class SearchAgencyContainer extends PureComponent {
    state = {
        valueToShow: '', // will be shown immediately
        valueToSearch: '', // will be throttled
        isLoading: null,
        error: null,
        isConfirmModal: false,
        id: null,
    };
    /**
     * Will open modal to confirm agency change and save input from form to state
     * input will be reused when user confirm his action
     *
     * @param {string} [id] - agency id
     */
    handleOpenConfirmModal = (id) => {
        this.setState({ isConfirmModal: true, id });
    };
    /**
     * Will close modal to confirm agency change
     */
    handleCloseConfirmModal = () => {
        this.setState({ isConfirmModal: false });
    };

    /**
     * Commit changeAgency mutation
     *
     * @param {string} [id] - agency id
     */
    commitChangeAgency = id => {
        return commitMutation(
            environment,
            {
                mutation: mutationChangeAgency,
                variables: { agency: id },
                errorPath: 'mutator.changeAgency.errors',
            },
        );
    };
    /**
     * Handle agency select
     */
    handleSelectAgency = () => {
        this.setState({
            isLoading: true,
            error: null,
        });
        this.commitChangeAgency(this.state.id)
            .then(() => {
                this.setState({
                    isLoading: false,
                });

                LoginManager.refreshUserToken();
                this.props.handleCloseEditModal();
                toast.success(this.state.id ?
                    'You have successfully requested to change agency. The agency admin will be notified to review.' :
                    'You have successfully become a freelancer'
                );
            })
            .catch(error => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    error: errorParsed.message,
                });
            });

    };

    /**
     * Handle input onChange
     *
     * @param {ReactEvent} event
     */
    handleChangeValue = (event) => {
        const value = event.target.value;
        this.setState({ valueToShow: value });
        this.handleSetValue(value);
    };
    /**
     * Handle input onChange
     *
     * @param {string} value
     */
    handleSetValue = debounce(
        (value) => {
            this.setState({ valueToSearch: value });
        },
        THROTTLE_TIME,
    );


    render() {
        const { handleChangeValue, handleSelectAgency, handleOpenConfirmModal, handleCloseConfirmModal } = this;
        const { valueToShow, valueToSearch, isLoading, error, isConfirmModal, id } = this.state;
        const { agencyId } = this.props;
        return (
            <SearchAgencyComponent
                handleSearchAgency={ handleChangeValue }
                agencyValue={ valueToShow }
                isLoading={ isLoading }
                errorMessage={ error }
                agencyId={ agencyId }
                handleSelectAgency={ handleSelectAgency }
                isConfirmModal={ isConfirmModal }
                handleOpenConfirmModal={ handleOpenConfirmModal }
                handleCloseConfirmModal={ handleCloseConfirmModal }
                isBecomeFreelancer={ !id }
                valueToSearch={ valueToSearch }
            />
        );
    }
}

SearchAgencyContainer.propTypes = {
    handleCloseEditModal: PropTypes.func.isRequired,
    agencyId: PropTypes.string,
};

export default SearchAgencyContainer;
