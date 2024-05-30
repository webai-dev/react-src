import React, { PureComponent }             from 'react';
import PropTypes                            from 'prop-types';
import { withRouter }                       from 'react-router-dom';
import { isDevelopment }                    from '../../../constants';
import TEST_IDS                             from '../../../tests/testIds';
import OfferModalComponent                  from './OfferModalComponent';
import { toast }                            from 'react-toastify';
import gtmPush, { GTM_EVENTS, GTM_ACTIONS } from '../../../util/gtmPush';
import {
    graphql,
    QueryRenderer,
}                                           from 'react-relay';
import {
    commitMutation,
    environment,
}                                           from '../../../api';
import { Confirm }                          from '../../components/Modal';

const JOB_APPLICATION = graphql`
    query OfferModalContainerQuery($id: ID!) {
        node(id: $id) {
            ... on JobApplication {
                candidate {
                    grossRate
                    rateType
                    award
                }
                offers {
                    id
                    jobTitle
                    status
                    term
                    startDate
                    salary
                    rateType
                    award
                }
                job {
                    id
                    title
                    term
                    salary
                    rateType
                    award
                    type
                    feePercentage
                }
            }
        }
    }
`;

const mutationTransitionOffer = graphql`
    mutation OfferModalContainerTransitionMutation($input: TransitionOfferInput!) {
        mutator {
            transitionOffer(input: $input) {
                offer {
                    id
                    status
                    jobApplication {
                        id
                        status
                        job {
                            id
                            status
                        }
                        offers {
                            status
                            id
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

const mutationOfferModalContainer = graphql`
    mutation OfferModalContainerMutation($input: OfferJobInput!) {
        mutator {
            offerJob(input: $input) {
                offer {
                    id
                    jobApplication {
                        id
                        candidate {
                            id
                        }
                        job {
                            id
                        }
                        recruiter {
                            id
                        }
                    }
                    term
                    salary
                    startDate
                    status
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class OfferModalContainer extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            errors: null,
        };
    }

    /**
     * Commit send sendOffer mutation
     *
     * @param {Object} input - object from formsy
     */
    commitSendOffer = input => {
        return commitMutation(
            environment,
            {
                mutation: mutationOfferModalContainer,
                variables: {
                    input,
                },
                errorPath: 'mutator.sendOffer.errors',
            },
        );
    };

    /**
     * Handle send offer and loading and error state
     *
     * @param {Object} input - object from formsy
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitSendOffer(input)
            .then(() => {
                this.setState({ isLoading: false });
                this.props.handleCloseModal();
                gtmPush({
                    event: GTM_EVENTS.SUBMIT_OFFER,
                    action: this.props.isUser ? GTM_ACTIONS.OFFER_BY_EMPLOYER : GTM_ACTIONS.OFFER_BY_RECRUITER,
                    label: input.offerId,
                });
                toast.success(
                    'Your offer was sent successfully',
                    { className: isDevelopment && TEST_IDS.CANDIDATE_OFFER_SUCCESS }
                );
            })
            .catch(() => {
                toast.error('Something went wrong.');
            });
    };

    /**
     * Commit send sendOffer mutation
     *
     * @param {string} id - offer id
     * @param {string} transition - type of transition: Reject, Withdraw or Accept
     */
    commitTransitionOffer = (id, transition) => {
        const variables = {
            input: {
                transition,
                offerId: id,
            },
        };

        return commitMutation(
            environment,
            {
                mutation: mutationTransitionOffer,
                variables,
                errorPath: 'mutator.transitionOffer.errors',
            },
        );
    };

    /**
     *
     * @param {string} transition - type of transition: Reject, Withdraw or Accept
     * @param {string} id - offer id
     */
    handleTransition = (transition, id) => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitTransitionOffer(
            id,
            transition,
        )
            .then(() => {
                this.setState({
                    isLoading: false,
                });
                this.props.handleCloseModal();
            })
            .catch(({ errors }) => {
                this.setState({
                    isLoading: false,
                    errors,
                });
            });
    };

    /**
     * Display Withdraw modal
     * @param {string} id - offer id
     */
    handleWithdraw = (id) => {
        Confirm(
            <div className="confirmations-title">
                Are you sure you want to withdraw this job offer?
                Withdrawing your offer will automatically reject the candidate.
            </div>,
            {
                proceed: 'Withdraw',
                cancel: 'Cancel',
                title: 'Withdraw offer',
            },
        )
            .then(() => {
                this.handleTransition('withdraw', id);
            });
    };

    /**
     * Display Accept modal
     * @param {string} id - offer id
     */
    handleAccept = (id) => {
        Confirm(
            <div className="confirmations-title">
                Are you sure you want to accept this job
                offer?
            </div>,
            {
                proceed: 'Accept',
                cancel: 'Cancel',
                title: 'Accept offer',
            },
        )
            .then(() => {
                gtmPush({
                    event: GTM_EVENTS.ACCEPT_OFFER,
                    label: id,
                });
                this.handleTransition('accept', id);
            });
    };

    /**
     * Display Withdraw modal
     * @param {string} id - offer id
     */
    handleReject = (id) => {
        Confirm(
            <div className="confirmations-title">
                Are you sure you want to reject this job offer?
            </div>,
            {
                proceed: 'Reject',
                cancel: 'Cancel',
                title: 'Reject job ofer',
            },
        )
            .then(() => {
                this.handleTransition('reject', id);
            });
    };

    handleNegotiate = (jobId, applicationId) => {
        this.props.history.push(`/my-jobs/job/${ jobId }/candidate/${ applicationId }/candidateMessages`);
    };

    render() {
        const { isLoading } = this.state;
        const { handleSubmit, handleWithdraw, handleAccept, handleReject, handleNegotiate } = this;
        const { handleCloseModal, applicationId, isUser } = this.props;
        return (
            <QueryRenderer
                environment={ environment }
                query={ JOB_APPLICATION }
                variables={ { id: applicationId } }
                render={ ({ error, props: data }) => {
                    const isModalLoading = !data && !error;
                    let initialOffer = {};

                    if (!isModalLoading) {
                        const application = data && data.node;
                        const { offers, job, candidate } = application;
                        const offer = offers[ 0 ] || {};

                        initialOffer = {
                            offerId: offer.id,
                            jobTitle: offer.jobTitle || job.title,
                            status: offer.status,
                            term: offer.term || job.term,
                            startDate: offer.startDate,
                            salary: job.type === 'temp' ?
                                (offer.salary && `${ offer.salary }`) ||
                                (candidate.grossRate && `${ candidate.grossRate }`) :
                                (offer.salary && `${ offer.salary }`) || (job.salary && `${ job.salary }`),
                            rateType: offer.rateType || job.rateType,
                            award: job.award || candidate.award || offer.award,
                            type: job.type,
                            feePercentage: job.feePercentage,
                            applicationId: applicationId,
                            jobId: job.id,
                        };
                    }


                    return (
                        <OfferModalComponent
                            handleWithdraw={ handleWithdraw }
                            handleAccept={ handleAccept }
                            handleReject={ handleReject }
                            handleCloseModal={ handleCloseModal }
                            handleNegotiate={ handleNegotiate }
                            offer={ initialOffer }
                            applicationId={ applicationId }
                            handleSubmit={ handleSubmit }
                            isUser={ isUser }
                            isLoading={ isLoading }
                            isModalLoading={ isModalLoading }
                        />
                    );
                }
                }
            />
        );
    }
}

OfferModalContainer.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    applicationId: PropTypes.string.isRequired,
    isUser: PropTypes.bool,
};

export default withRouter(OfferModalContainer);
