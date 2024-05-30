import React, { Component, Fragment }         from 'react';
import PropTypes                              from 'prop-types';
import { generatePath }                       from 'react-router-dom';
import { Badge }                              from 'reactstrap';
import Relay, { graphql }                     from 'react-relay';
import { Link }                               from 'react-router-dom';
import { environment }                        from '../../../../api';
import DownIcon                               from '../../../../assets/icons/DownIcon';
import TEST_IDS                               from '../../../../tests/testIds';
import getFullDateFromDateString              from '../../../../util/getFullDateFromDateString';
import gtmPush, { GTM_EVENTS, GTM_ACTIONS }   from '../../../../util/gtmPush';
import RecruiterApplicationTransitionMutation from '../../../../mutations/RecruiterApplicationTransitionMutation';
import { Button }                             from '../../../components/Button';
import DropDownComponent                      from '../../../components/DropDownComponent';
import Table                                  from '../../../components/Table/Table';
import TableRow                               from '../../../components/Table/TableRow';
import TableCell                              from '../../../components/Table/TableCell';
import ThreadModal                            from '../../../components/Thread';
import { Confirm }                            from '../../../components/Modal';
import ProfileSnippet                         from '../../../components/User/ProfileSnippet';
import RecruiterApplicationStatus             from '../../../components/Recruiter/RecruiterApplicationStatus';
import { PARAM_SLUG, ROUTES }                 from '../../../../constants';
import classNames                             from 'classnames';
import './styles.scss';
import styles                                 from './styles.scss';

const RecruiterBriefingRequests = Relay.createFragmentContainer(
    ({ briefingRequests }) =>
        briefingRequests.briefingRequests.map((it, index) => (
            <div key={ index }>
                { { recruiter: 'Recruiter', 'hiring-manager': 'Hiring Manager' }[ it.whoWillCall ] } to
                call{ ' ' }
                <strong>
                    <a href={ `tel:${ it.numberToCall }` }>{ it.numberToCall }</a>
                </strong>
                <br />
                <div>
                    { getFullDateFromDateString(it.dateTime) }
                </div>
            </div>
        )),
    {
        briefingRequests: graphql`
            fragment JobTabRecruitersComponent_briefingRequests on RecruiterApplication {
                briefingRequests {
                    id
                    dateTime
                    endDate
                    whoWillCall
                    numberToCall
                    notes
                    status
                }
            }`
    }
);
const ButtonsForRow = (props) => {
    const {
        job,
        recruiter,
        applicationId,
        status,
        hasRated,
        onTransitionRequested,
        onBriefRequested,
        onMessagesShowRequested
    } = props;
    if (job.status === 'filled' && status === 'engaged') {
        if (hasRated) {
            return 'Complete';
        }
        return (
            <Button
                color="blue"
                className="soft"
                size="sm"
                tag={ Link }
                to={ generatePath(
                    ROUTES.RECRUITER_PROFILE,
                    {
                        [ PARAM_SLUG ]: recruiter.slug,
                    },
                ) }
            >
                View
            </Button>
        );
    }
    if (status === 'pending') {
        return (
            <DropDownComponent
                dataTest={ TEST_IDS.JOB_RECRUITER_ACTIONS }
                labelClassName={ styles.dropDownLabel }
                label={
                    <Fragment>
                        Actions
                        { ' ' }
                        <DownIcon />
                    </Fragment>
                }
                selectClassName={ styles.dropDownSelect }
                select={
                    <Fragment>
                        <button
                            data-test={ TEST_IDS.JOB_RECRUITER_ACTION_ENGAGE }
                            type="button"
                            className={ classNames(styles.item) }
                            onClick={ e => {
                                e.stopPropagation();

                                Confirm(
                                    <div className="confirmations-title">
                                        <p>Are you sure you want to engage this recruiter?</p>
                                    </div>,
                                    { proceed: 'Engage', cancel: 'Cancel', title: 'Engage Recruiter' }
                                )
                                    .then(
                                        () => {
                                            onTransitionRequested({ id: applicationId }, 'engage');
                                        },
                                        () => {}
                                    );

                                return false;
                            } }
                        >
                            Engage
                        </button>
                        <button
                            type="button"
                            className={ classNames(styles.item) }
                            onClick={ e => {
                                e.stopPropagation();

                                Confirm(
                                    <div className="confirmations-title">
                                        <p>Are you sure you want to reject this recruiter?</p>
                                    </div>,
                                    { proceed: 'Reject', cancel: 'Cancel', title: 'Reject recruiter' }
                                )
                                    .then(
                                        () => {
                                            onTransitionRequested({ id: applicationId }, 'reject');
                                        },
                                        () => {}
                                    );

                                return false;
                            } }
                        >
                            Reject
                        </button>
                        <button
                            type="button"
                            className={ classNames(styles.item) }
                            onClick={ onMessagesShowRequested }
                        >
                            Message
                        </button>
                    </Fragment>
                }
            />
        );
    }

    if (status === 'withdrawn') {
        return null;
    }

    return (
        <DropDownComponent
            labelClassName={ styles.dropDownLabel }
            label={
                <Fragment>
                    Actions
                    { ' ' }
                    <DownIcon />
                </Fragment>
            }
            selectClassName={ styles.dropDownSelect }
            select={
                <Fragment>
                    { status === 'engaged' && <button
                        type="button"
                        className={ classNames(styles.item) }
                        onClick={ e => {
                            e.stopPropagation();
                            onBriefRequested({ id: applicationId }, recruiter);
                        } }
                    >
                        Brief
                    </button> }
                    { (status === 'engaged' || status === 'pending' || status === 'invited') && <button
                        type="button"
                        className={ classNames(styles.item) }
                        onClick={ e => {
                            e.stopPropagation();

                            Confirm(
                                <div className="confirmations-title">
                                    <p>Are you sure you want to reject this recruiter?</p>
                                </div>,
                                { proceed: 'Reject', cancel: 'Cancel', title: 'Reject recruiter' }
                            )
                                .then(
                                    () => {
                                        onTransitionRequested({ id: applicationId }, 'reject');
                                    },
                                    () => {}
                                );

                            return false;
                        } }
                    >
                        Reject
                    </button> }
                    <button
                        type="button"
                        className={ classNames(styles.item) }
                        onClick={ onMessagesShowRequested }
                    >
                        Message
                    </button>
                </Fragment>
            }
        />
    );
};

ButtonsForRow.propTypes = {
    job: PropTypes.object.isRequired,
    recruiter: PropTypes.object.isRequired,
    applicationId: PropTypes.string.isRequired,
    status: PropTypes.string,
    hasRated: PropTypes.bool,
    onTransitionRequested: PropTypes.func.isRequired,
    onBriefRequested: PropTypes.func.isRequired,
    onMessagesShowRequested: PropTypes.func.isRequired,
};

const EngagedRecruiterTableRow = (props) => {
    const {
        onClick,
        onMessagesShowRequested,
        recruiterApplication,
        job,
        onTransitionRequested,
        onBriefRequested,
        className,
        type,
    } = props;
    return (
        <TableRow
            className={ className }
            type={ type }
        >
            <TableCell
                valign="center"
                name="recruiter"
            >
                <ProfileSnippet
                    onClick={ () => onClick(recruiterApplication.recruiter) }
                    type="recruiter"
                    profile={ recruiterApplication.recruiter }
                />
            </TableCell>
            <TableCell
                valign="center"
                name="candidate-count"
            >
                <Badge color={ recruiterApplication.applications.length > 0 ? 'pink' : 'empty-value' }>
                    { recruiterApplication.applications.length } candidates
                </Badge>
            </TableCell>
            <TableCell
                valign="center"
                name="status"
            >
                <RecruiterApplicationStatus data={ recruiterApplication } />
            </TableCell>
            <TableCell
                valign="center"
                name="briefingRequests"
            >
                <RecruiterBriefingRequests briefingRequests={ recruiterApplication } />
            </TableCell>
            <TableCell
                valign="center"
                align="right"
                name="actions"
            >
                <ButtonsForRow
                    job={ job }
                    applicationId={ recruiterApplication.id }
                    onTransitionRequested={ onTransitionRequested }
                    onBriefRequested={ onBriefRequested }
                    onMessagesShowRequested={ onMessagesShowRequested }
                    recruiter={ recruiterApplication.recruiter }
                    status={ recruiterApplication.status }
                    hasRated={ recruiterApplication.rating !== null }
                />
            </TableCell>
        </TableRow>
    );
};
EngagedRecruiterTableRow.propTypes = {
    onClick: PropTypes.func.isRequired,
    onMessagesShowRequested: PropTypes.func.isRequired,
    recruiterApplication: PropTypes.object.isRequired,
    job: PropTypes.object.isRequired,
    onTransitionRequested: PropTypes.func.isRequired,
    onBriefRequested: PropTypes.func.isRequired,
    className: PropTypes.string,
    type: PropTypes.string,
};

class JobTabRecruitersComponent extends Component {
    state = {
        messageModalId: null
    };
    onMessagesShowRequested = (messageModalId) => {
        this.setState({ messageModalId });
    };

    render() {
        const { job, history, className, activeId, relay } = this.props;

        const onTransitionRequested = (application, transition) => {
            RecruiterApplicationTransitionMutation
                .commit(
                    environment,
                    application,
                    transition,
                )
                .then(() => {
                    if (transition === 'engage') {
                        gtmPush({
                            event: GTM_EVENTS.ENGAGE_WITH_RECRUITER,
                            action: GTM_ACTIONS.JOB,
                            label: application.id,
                        });
                    }
                });
        };
        const onBriefRequested = (application, recruiter) => {
            history.push(`/jobs/${ job.id }/recruiter/${ recruiter.id }/brief`);
        };
        const onRecruiterSelected = recruiter =>
            history.push(`/jobs/${ job.id }/recruiter/${ recruiter.id }`);
        return (
            <Fragment>
                { this.state.messageModalId && (
                    <ThreadModal
                        toggle={ () => this.setState({ messageModalId: null }) }
                        threadId={ this.state.messageModalId }
                    />
                ) }
                <Table type="engaged-recruiter--table">
                    { job.appliedRecruiters.map(recruiterApplication => (
                        <EngagedRecruiterTableRow
                            key={ recruiterApplication.id }
                            onClick={ onRecruiterSelected }
                            onMessagesShowRequested={ () => {
                                this.onMessagesShowRequested(recruiterApplication.id);
                            } }
                            recruiterApplication={ recruiterApplication }
                            job={ job }
                            relay={ relay }
                            onTransitionRequested={ onTransitionRequested }
                            onBriefRequested={ onBriefRequested }

                            className={ classNames(className, {
                                'recruiter-table--row__active':
                                    recruiterApplication.recruiter.id === activeId
                            }) }
                        />
                    )) }
                    { job.appliedRecruiters.length === 0 && (
                        <tr className="card no-items-row">
                            <td className="text-center">
                                <span>There are currently no recruiters on this role</span>
                            </td>
                        </tr>
                    ) }
                </Table>
            </Fragment>
        );
    }
}

JobTabRecruitersComponent.propTypes = {
    job: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    className: PropTypes.string,
    activeId: PropTypes.string,
    relay: PropTypes.object.isRequired
};

export default Relay.createFragmentContainer(
    JobTabRecruitersComponent, {
        job: graphql`
            fragment JobTabRecruitersComponent_job on Job {
                status
                id
                appliedRecruiters {
                    id
                    status
                    ...RecruiterApplicationStatus_data
                    ...JobTabRecruitersComponent_briefingRequests
                    rating {
                        communication
                    }
                    recruiter {
                        id
                        firstName
                        lastName
                        aboutMe
                        placementHistory
                        profilePhoto {
                            url
                            id
                            name
                            path
                        }
                        agency {
                            id
                            name
                            logo
                            agencyRelationship {
                                id
                                isPsa
                                psaDocument {
                                    id
                                    name
                                    url
                                }
                            }
                        }
                        recruiterRelationship {
                            id
                            isFavourite
                        }
                        slug
                    }
                    applications {
                        id
                        status
                        job {
                            id
                        }
                        recruiter {
                            id
                            aboutMe
                            placementHistory
                            profilePhoto {
                                url
                                id
                                name
                                path
                            }
                            firstName
                            lastName
                            agency {
                                id
                                name
                                logo
                                agencyRelationship {
                                    id
                                    isPsa
                                    psaDocument {
                                        id
                                        name
                                        url
                                    }
                                }
                            }
                            recruiterRelationship {
                                id
                                isFavourite
                            }
                            slug
                        }
                        candidate {
                            id
                            firstName
                            lastName
                            email
                            workRights
                            noticePeriod
                            linkedinUrl
                            salaryExpectations
                            additionalInformation
                        }
                    }
                }
            }
        `
    }
);
