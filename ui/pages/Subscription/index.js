import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { inject, observer }     from 'mobx-react';
import { toast }                from 'react-toastify';
import getErrorMessage          from '../../../util/getErrorMessage';
import getPermissions           from '../../../util/getPermissions';
import SubscriptionComponent    from './SubscriptionComponent';
import {
    graphql,
    QueryRenderer,
}                               from 'react-relay';
import {
    commitMutation,
    environment,
}                               from '../../../api';
import { withRouter }           from 'react-router-dom';
import ErrorComponent           from '../../components/ErrorComponent';
import LoaderComponent          from '../../components/LoaderComponent';

const REVIEWS_QUERY = graphql`
    query SubscriptionQuery {
        viewer {
            user {
                ...on Recruiter {
                    agency {
                        id
                    }
                }
            }
            activeSubscription {
                trialEnd
                status
                isActive
                scheduledCancellation
                plan
                currentTermEnd
            }
            individual: chargebeeConnect(planId: "individual") {
                portal
            }
            individualAnnual: chargebeeConnect(planId: "individual---annual") {
                portal
            }
            team: chargebeeConnect(planId: "team2") {
                portal
            }
            teamAnnual: chargebeeConnect(planId: "team---annual") {
                portal
            }
        }
    }
`;

const mutation = graphql`
    mutation SubscriptionMutation {
        mutator {
            cancelSubscription {
                viewer {
                    activeSubscription {
                        trialEnd
                        status
                        isActive
                        scheduledCancellation
                        plan
                        currentTermEnd
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


class SubscriptionView extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
    };
    /**
     * Commit cancelSubscription mutation
     */
    commitCancelSubscription = input => {
        return commitMutation(
            environment,
            {
                mutation,
                variables: { input },
            },
        );
    };

    /**
     * Handle cancel subscription and corresponding app logic
     */
    handleCancelSubscription = () => {
        this.setState({
            isLoading: true,
            errors: null,
        });

        this.commitCancelSubscription()
            .then(() => {
                this.setState({ isLoading: false });

                toast.success('Your has successfully canceled subscription');
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
        const { history, store } = this.props;
        const { handleCancelSubscription } = this;
        const { isLoading } = this.state;

        const isTeamSubscription = getPermissions(store, [ 'team_subscription' ]);
        const isIndividualSubscription = getPermissions(store, [ 'individual_subscription' ]);
        const isAgencyAdmin = getPermissions(store, [ 'recruiter_admin' ]);

        return (
            <QueryRenderer
                environment={ environment }
                query={ REVIEWS_QUERY }
                render={ ({ error, props: data }) => {
                    const loading = !error && !data;

                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (loading) {
                        return <LoaderComponent row />;
                    }

                    return (
                        <SubscriptionComponent
                            isAgencyAdmin={ isAgencyAdmin }
                            isFreelancer={ !data.viewer.user.agency }
                            handleCancelSubscription={ handleCancelSubscription }
                            isLoading={ isLoading }
                            history={ history }
                            individual={ data.viewer.individual?.portal }
                            individualAnnual={ data.viewer.individualAnnual?.portal }
                            team={ data.viewer.team?.portal }
                            teamAnnual={ data.viewer.teamAnnual?.portal }
                            subscription={ data.viewer.activeSubscription }
                            isTeamSubscription={ isTeamSubscription }
                            isIndividualSubscription={ isIndividualSubscription }
                        />
                    );
                } }
            />
        );
    }
}

SubscriptionView.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};

export default inject('store')(
    observer(withRouter(SubscriptionView)),
);
