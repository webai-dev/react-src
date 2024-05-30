import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import getErrorMessage      from '../../../util/getErrorMessage';
import LoaderComponent      from '../../components/LoaderComponent';
import ErrorComponent       from '../../components/ErrorComponent';
import { generatePath }     from 'react-router-dom';
import getQueryParams       from '../../../util/getQueryParams';
import getQueryString       from '../../../util/getQueryString';
import {
    ROUTES,
    PLACEMENT_QUERY_TYPE,
    PARAM_PLACEMENT_TYPE,
    INTEGRATIONS,
}                           from '../../../constants';
import {
    graphql,
    QueryRenderer,
}                           from 'react-relay';
import {
    commitMutation,
    environment,
}                           from '../../../api';
import {
    inject,
    observer,
}                           from 'mobx-react';
import getPermissions       from '../../../util/getPermissions';
import { toast }            from 'react-toastify';
import PlacementsComponent  from './PlacementsComponent';

const mutationSendReminders = graphql`
    mutation PlacementsRemindersMutation($name: AvailableFlag!) {
        mutator {
            toggleFlag(name: $name) {
                user {
                    ...on Recruiter {
                        autoSendReminders
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

const mutationDeletePlacement = graphql`
    mutation PlacementsDeleteMutation($input: DeletePlacementInput!) {
        mutator {
            deletePlacement(input: $input) {
                placements {
                    id
                    jobTitle
                    companyName
                    placementDate
                    location
                    employerRating {
                        ratings {
                            id
                        }
                        title
                    }
                    candidateRating {
                        ratings {
                            id
                        }
                        title
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

const PLACEMENT_QUERY = graphql`
    query PlacementsViewQuery($type: String) {
        viewer {
            user {
                ...on Recruiter {
                    autoSendReminders
                    id
                    agency {
                        integrations
                        recruiters {
                            id
                            firstName
                            lastName
                            claimed
                        }
                    }
                    integrations
                }
            }
            visiblePlacementsCount: placementCount(type: "visible")
            incompletePlacementsCount: placementCount(type: "incomplete")
            inviteNeededPlacementsCount: placementCount(type: "invite_needed")
            placements(type: $type) {
                id
                jobTitle
                companyName(public: false)
                suburb
                employerRating {
                    ratings {
                        id
                    }
                    title
                }
                candidateRating {
                    ratings {
                        id
                    }
                    title
                }
                recruiter {
                    id
                    firstName
                    lastName
                }
            }
        }
    }
`;

class PlacementsView extends Component {
    state = {
        isLoading: false,
        errors: null,
        selectedRecruiterId: null
    };

    /**
     * If user is recruiter and agency admin there will be dropdown to change recruiter (in order to see recruiter
     * placements)
     *
     * @param {string} id - recruiter id from agency
     */
    handleSelectRecruiter = (id) => {
        this.setState({ selectedRecruiterId: id });
    };

    /**
     * Commit toggle reviews reminders mutation
     */
    commitTogglePlacementReminders = () => {
        const variables = {
            name: 'autoSendReminders'
        };

        return commitMutation(
            environment,
            {
                mutation: mutationSendReminders,
                variables,
            },
        );
    };

    /**
     * Handle toggle send reminders for imported placements
     */
    handleTogglePlacements = () => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitTogglePlacementReminders()
            .then((data) => {
                const autoSendReminders = data.mutator.toggleFlag.user.autoSendReminders;
                this.setState({ isLoading: false });
                toast.success(`Automatic review requests have now been switched ${
                    autoSendReminders ? 'on' : 'off' }`);
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

    /**
     * Commit DeletePlacement mutation
     *
     * @param {Object} input - represents GQL DeletePlacementInput
     */
    commitPlacementsDelete = input => {
        const variables = {
            input,
        };

        return commitMutation(
            environment,
            {
                mutation: mutationDeletePlacement,
                variables,
                errorPath: 'mutator.removeJob.errors',
            },
        );
    };

    /**
     * Handle placement deletion
     *
     * @param id - represents GQL id
     * @param retry - will reload GQL placements
     */
    handleDelete = (id, retry) => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitPlacementsDelete({ id })
            .then(() => {
                this.setState({ isLoading: false });
                retry();
                toast.success('Placement successfully deleted');
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

    handleEditPlacement = (placementId) => {
        this.props.history.push(generatePath(
            ROUTES.PLACEMENTS_EDIT,
            { id: placementId },
        ));
    };

    render() {
        const { handleDelete, handleTogglePlacements, handleEditPlacement, handleSelectRecruiter } = this;
        const { isLoading, selectedRecruiterId } = this.state;
        const { store, location, match: { params } } = this.props;

        const placementType = params[ PARAM_PLACEMENT_TYPE._NAME ];

        const queryParams = getQueryParams(location.search);
        const { search } = queryParams;
        const type = queryParams[ PLACEMENT_QUERY_TYPE._NAME ];

        const isAgencyAdmin = getPermissions(store, [ 'recruiter_admin' ]);
        return (
            <QueryRenderer
                environment={ environment }
                variables={ { type: placementType } } //'invite-needed' `visible` `incomplete`
                query={ PLACEMENT_QUERY }
                render={
                    ({ error, props: data, retry }) => {
                        if (error) {
                            return <ErrorComponent error={ error } />;
                        }
                        if (!data && !error) {
                            return <LoaderComponent row />;
                        }
                        const autoSendReminders = data.viewer.user.autoSendReminders;

                        const isFreelancer = !data.viewer.user.agency;
                        const isJobadderIntegrated =
                            (
                                isFreelancer &&
                                data.viewer.user.integrations &&
                                data.viewer.user.integrations.includes(INTEGRATIONS.JOBADDER)
                            ) || (
                                !isFreelancer &&
                                data.viewer.user.agency.integrations &&
                                data.viewer.user.agency.integrations.includes(INTEGRATIONS.JOBADDER)
                            );
                        let placements = (data && data.viewer.placements) || [];

                        placements = placements.map(placement => ({
                            ...placement,
                            candidateReviewId: placement.candidateRating && placement.candidateRating.ratings &&
                                placement.candidateRating.ratings[ 0 ] && placement.candidateRating.ratings[ 0 ].id,
                            employerReviewId: placement.employerRating && placement.employerRating.ratings &&
                                placement.employerRating.ratings[ 0 ] && placement.employerRating.ratings[ 0 ].id,
                            status: placement.employerRating ?
                                (placement.candidateRating ?
                                    PlacementsComponent.STATUS.REVIEWED : PlacementsComponent.STATUS.AWAIT_CANDIDATE) :
                                (placement.candidateRating ?
                                    PlacementsComponent.STATUS.AWAIT_EMPLOYER : PlacementsComponent.STATUS.UN_REVIEWED),
                        }));

                        // filter placements by search query if query exist
                        if (search) {
                            placements = placements.filter(
                                placement => `${ placement.jobTitle } ${ placement.companyName }`
                                    .toUpperCase()
                                    .includes(search.toUpperCase()),
                            );
                        }
                        // filter placements by type if type selected
                        if (type && type !== PLACEMENT_QUERY_TYPE.ALL) {
                            placements = placements.filter(
                                placement => type === PLACEMENT_QUERY_TYPE.REVIEWED ?
                                    placement.status === PlacementsComponent.STATUS.REVIEWED :
                                    placement.status !== PlacementsComponent.STATUS.REVIEWED,
                            );
                        }
                        if (selectedRecruiterId) {
                            placements = placements.filter(
                                placement => placement.recruiter.id === selectedRecruiterId
                            );
                        }

                        const pathToVisiblePlacements =
                            generatePath(
                                ROUTES.PLACEMENTS,
                                { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE },
                            ) + getQueryString(queryParams);
                        const pathToIncompletePlacements =
                            generatePath(
                                ROUTES.PLACEMENTS,
                                { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.INCOMPLETE },
                            ) +
                            getQueryString(queryParams);
                        const pathToInviteNeededPlacements =
                            generatePath(
                                ROUTES.PLACEMENTS,
                                { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.INVITE_NEEDED },
                            ) +
                            getQueryString(queryParams);

                        const recruiterId = data && data.viewer.user.id;

                        return (
                            <PlacementsComponent
                                placements={ placements }
                                pathToVisiblePlacements={ pathToVisiblePlacements }
                                pathToIncompletePlacements={ pathToIncompletePlacements }
                                pathToInviteNeededPlacements={ pathToInviteNeededPlacements }
                                visiblePlacementsCount={ data.viewer.visiblePlacementsCount }
                                incompletePlacementsCount={ data.viewer.incompletePlacementsCount }
                                inviteNeededPlacementsCount={ data.viewer.inviteNeededPlacementsCount }
                                placementType={ placementType }
                                handleEditPlacement={ handleEditPlacement }
                                handleDelete={ (id) => {handleDelete(id, retry);} }
                                recruiterId={ recruiterId }
                                isJobadderIntegrated={ isJobadderIntegrated }
                                isAgencyAdmin={ isAgencyAdmin }
                                isFreelancer={ isFreelancer }
                                isLoading={ isLoading }
                                handleTogglePlacements={ handleTogglePlacements }
                                autoSendReminders={ autoSendReminders }
                                handleSelectRecruiter={ handleSelectRecruiter }
                                selectedRecruiterId={ selectedRecruiterId }
                                agencyRecruiters={ isAgencyAdmin ? data.viewer.user?.agency?.recruiters : null }
                            />
                        );
                    }
                }
            />
        );
    }
}

PlacementsView.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default inject('store')(
    observer(PlacementsView),
);
