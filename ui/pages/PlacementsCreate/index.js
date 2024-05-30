import React, { PureComponent }                                         from 'react';
import PropTypes                                                        from 'prop-types';
import { generatePath }                                                 from 'react-router-dom';
import { ROUTES, PARAM_REVIEW_ID, isDevelopment, PARAM_PLACEMENT_TYPE } from '../../../constants';
import TEST_IDS                                                         from '../../../tests/testIds';
import LoaderComponent                                                  from '../../components/LoaderComponent';
import ErrorComponent                                                   from '../../components/ErrorComponent';
import PlacementsCreateComponent                                        from './PlacementsCreateComponent';
import gtmPush, { GTM_EVENTS, GTM_ACTIONS }                             from '../../../util/gtmPush';
import { toast }                                                        from 'react-toastify';
import {
    graphql,
    QueryRenderer,
}                                          from 'react-relay';
import {
    commitMutation,
    environment,
}                                           from '../../../api';
import getErrorMessage                      from '../../../util/getErrorMessage';

const PLACEMENT_CREATE_QUERY = graphql`
    query PlacementsCreateQuery {
        viewer {
            recruiter: user {
                ...on Recruiter {
                    email
                }
            }
            jobCategories {
                label: name
                key: id
            }
            industries {
                label: name
                key: id
            }
        }
    }
`;
const PLACEMENT_EDIT_QUERY = graphql`
    query PlacementsCreateEditQuery($id: ID!) {
        node(id: $id) {
            ... on Placement {
                jobTitle
                category {
                    key: id
                }
                companyName
                jobType
                placementDate
                locationPostcode
                suburb
                industry {
                    id
                    name
                }
                fee
                salary
                employerFirstName
                employerLastName
                employerEmail
                messageToEmployer
                candidateFirstName
                candidateLastName
                candidateEmail
                messageToCandidate
                requestEmployerCompanyNameVisible
                rate
                rateType
            }
            ... on Rating {
                responsiveness
            }
        }
        viewer {
            recruiter: user {
                ...on Recruiter {
                    email
                }
            }
            jobCategories {
                label: name
                key: id
            }
            industries {
                label: name
                key: id
            }
        }
    }
`;

const mutationCreate = graphql`
    mutation PlacementsCreateMutation($input: CreatePlacementInput!) {
        mutator {
            createPlacement(input: $input) {
                placement {
                    id
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;
const mutationEdit = graphql`
    mutation PlacementsCreateEditMutation($input: UpdatePlacementInput!) {
        mutator {
            updatePlacement(input: $input) {
                placement {
                    id
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class PlacementsCreateView extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        isPlacementEdit: this.props.match.path === ROUTES.PLACEMENTS_EDIT
    };

    /**
     * Commit CreatePlacement mutation
     *
     * @param {Object} input - represents GQL CreatePlacementInput
     */
    commitPlacementsCreate = input => {
        const variables = {
            input: this.state.isPlacementEdit ? {
                placement: input.placement,
                id: this.props.match.params.id
            } : input,
        };

        return commitMutation(
            environment,
            {
                mutation: this.state.isPlacementEdit ? mutationEdit : mutationCreate,
                variables,
            },
        );
    };

    /**
     * Handle placement creation and corresponding app logic
     *
     * @param {Object} input - object
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });

        this.commitPlacementsCreate({ placement: input })
            .then(data => {
                this.setState({ isLoading: false });

                if (!this.state.isPlacementEdit) {
                    gtmPush({
                        event: GTM_EVENTS.CREATE_PLACEMENT,
                        action: GTM_ACTIONS.PLACEMENT,
                        label: data.mutator.createPlacement.placement.id,
                    });
                    toast.success(
                        'Your placement has successfully been created and review requests have been sent',
                        { className: isDevelopment && TEST_IDS.CREATE_PLACEMENT_SUCCESS }
                    );
                } else {
                    toast.success('Your placement was successfully edited',
                        { className: isDevelopment && TEST_IDS.UPDATE_PLACEMENT_SUCCESS }
                    );
                }
                this.props.history.push(generatePath(ROUTES.PLACEMENTS, { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }));
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    errors: errorParsed.message,
                });
            });
    };

    render() {
        const { handleSubmit } = this;
        const { isLoading, errors, isPlacementEdit } = this.state;
        const { match } = this.props;
        const reviewId = match.path === ROUTES.PLACEMENTS_FOR_REVIEW ? match.params[ PARAM_REVIEW_ID ] : null;

        return (
            <QueryRenderer
                environment={ environment }
                query={ (isPlacementEdit || reviewId) ? PLACEMENT_EDIT_QUERY : PLACEMENT_CREATE_QUERY }
                variables={ isPlacementEdit ? { id: match.params.id } : reviewId ? { id: reviewId } : null }
                render={
                    ({ error, props: data }) => {
                        if (error) {
                            return <ErrorComponent error={ error } />;
                        }
                        if (!data && !error) {
                            return <LoaderComponent row />;
                        }

                        const placement = isPlacementEdit ? data && data.node : {};
                        const review = reviewId && data && { id: reviewId, ...data.node };
                        const jobCategories = data && data.viewer.jobCategories;
                        const industries = data && data.viewer.industries;
                        const recruiterEmail = data && data.viewer.recruiter.email;

                        return (
                            <PlacementsCreateComponent
                                isPlacementEdit={ isPlacementEdit }
                                handleSubmit={ handleSubmit }
                                isLoading={ isLoading }
                                errors={ errors }
                                placement={ placement }
                                jobCategories={ jobCategories }
                                industries={ industries }
                                review={ review }
                                recruiterEmail={ recruiterEmail }
                            />
                        );
                    }
                }
            />
        );
    }
}

PlacementsCreateView.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default PlacementsCreateView;

