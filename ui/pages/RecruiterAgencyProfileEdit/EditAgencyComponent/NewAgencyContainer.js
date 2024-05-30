import React, { PureComponent }                      from 'react';
import PropTypes                                     from 'prop-types';
import { toast }                                     from 'react-toastify';
import { PARAM_SLUG, ROUTES }                        from '../../../../constants';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../../components/ButtonComponent';
import NewAgencyComponent                            from './NewAgencyComponent';
import { generatePath }                              from 'react-router-dom';
import { graphql }                                   from 'react-relay';
import {
    commitMutation,
    environment,
}                                                    from '../../../../api';
import getErrorMessage                               from '../../../../util/getErrorMessage';


const mutationSendNewAgency = graphql`
    mutation NewAgencyContainerMutation($agency: ID, $input: CreateAgencyInput) {
        mutator {
            changeAgency(agency: $agency, input: $input) {
                viewer {
                    user {
                        ...on Recruiter {
                            agency {
                                slug
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
        isLoading: false,
        error: null,
        isConfirmModal: false,
        input: null,
    };
    /**
     * Will open modal to confirm agency change and save input from form to state
     * input will be reused when user confirm his action
     *
     */
    handleOpenConfirmModal = (input) => {
        this.setState({ isConfirmModal: true, input });
    };
    /**
     * Will close modal to confirm agency change
     */
    handleCloseConfirmModal = () => {
        this.setState({ isConfirmModal: false });
    };

    /**
     * Commit send new agency mutation
     *
     * @param {Object} input - object from formsy
     */
    commitNewAgency = input => {
        return commitMutation(
            environment,
            {
                mutation: mutationSendNewAgency,
                variables: { input },
                errorPath: 'mutator.sendReminder.errors',
            },
        );
    };

    /**
     * Handle send new agency and loading and error state
     */
    handleSubmit = () => {
        this.setState({
            isLoading: true,
            error: null,
        });
        this.commitNewAgency(this.state.input)
            .then((data) => {
                this.setState({ isLoading: false });
                this.props.handleCloseEditModal();

                toast.success(<span>
                    We have now created your new agency. To claim this agency profile{ ' ' }
                    <ButtonComponent
                        to={ generatePath(

                            ROUTES.AGENCY_PROFILE_CLAIM,
                            { [ PARAM_SLUG ]: data.mutator.changeAgency.viewer.user.agency.slug },
                        ) }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                    >click here</ButtonComponent>
                </span>);
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    error: errorParsed.message,
                });
            });
    };


    render() {
        const { handleSubmit, handleOpenConfirmModal, handleCloseConfirmModal } = this;
        const { isLoading, error, isConfirmModal } = this.state;
        const { agencyId } = this.props;
        return (
            <NewAgencyComponent
                handleSubmit={ handleSubmit }
                isLoading={ isLoading }
                error={ error }
                isConfirmModal={ isConfirmModal }
                handleOpenConfirmModal={ handleOpenConfirmModal }
                handleCloseConfirmModal={ handleCloseConfirmModal }
                agencyId={ agencyId }
            />
        );
    }
}

SearchAgencyContainer.propTypes = {
    handleCloseEditModal: PropTypes.func.isRequired,
    agencyId: PropTypes.string,
};

export default SearchAgencyContainer;
