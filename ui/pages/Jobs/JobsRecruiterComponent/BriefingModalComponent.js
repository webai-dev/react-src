import React, { Fragment }        from 'react';
import PropTypes                  from 'prop-types';
import { Row, Col }               from 'reactstrap';
import { Button }                 from '../../../components/Button';
import RequiresPermission         from '../../../components/User/RequiresPermission';
import { Modal }                  from '../../../components/Modal';
import BriefingForm               from '../../../components/BriefingFormComponent';
import { environment }            from '../../../../api';
import getFullDateFromDateString  from '../../../../util/getFullDateFromDateString';
import getDateObjectFromString    from '../../../../util/getDateObjectFromString';
import { graphql, QueryRenderer } from 'react-relay';

const BriefingModalComponent = (props) => {
    const {
        recruiterApplicationId,
        user,
        onTransitionRequested,
        onRescheduleRequested,
        onRescheduleCancelled,
        onBriefingRequested,
        reschedule,
        ...otherProps
    } = props;
    return (
        <Modal
            isOpen={ true } { ...otherProps }
            title={ `Briefing with ${ user.firstName } ${ user.lastName }` }
        >
            <QueryRenderer
                query={ graphql`
                query BriefingModalComponentQuery($recruiterApplicationId: ID!) {
                    viewer {
                        user {
                            ... on User {
                                id
                                firstName
                                lastName
                                contactNumber
                                company: company {
                                    id
                                }
                            }
                            ... on Recruiter {
                                id
                                firstName
                                lastName
                                contactNumber
                                aboutMe
                                placementHistory
                                company: agency {
                                    contactNumber
                                }
                            }
                        }
                    }
                    recruiterApplication: node(id: $recruiterApplicationId) {
                        ... on RecruiterApplication {
                            id
                            job {
                                id
                                title
                                postedBy {
                                    contactNumber
                                    id
                                    firstName
                                    lastName
                                }
                            }
                            recruiter {
                                id
                                firstName
                                lastName
                                contactNumber
                                aboutMe
                                placementHistory
                                agency {
                                    contactNumber
                                    id
                                }
                            }
                            briefingRequests {
                                id
                                status
                                dateTime
                                endDate
                                whoWillCall
                                numberToCall
                                notes
                                recruiterApplication {
                                    id
                                    recruiter {
                                        id
                                        firstName
                                        lastName
                                        contactNumber
                                        agency {
                                            id
                                            contactNumber
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ` }
                variables={ { recruiterApplicationId: recruiterApplicationId } }
                environment={ environment }
                render={ ({ props: data, error }) => {
                    if (error) {
                        return <div>Error loading briefing</div>;
                    }

                    if (data) {
                        const { recruiterApplication } = data;
                        let briefing = recruiterApplication.briefingRequests
                            ? recruiterApplication.briefingRequests[ 0 ]
                            : undefined;

                        if (briefing) {
                            briefing = {
                                ...briefing,
                                recruiterNumberToCall:
                                    data.viewer.user.contactNumber ||
                                    data.viewer.user.company.contactNumber,
                                managerNumberToCall:
                                    briefing.whoWillCall === 'recruiter'
                                        ? briefing.numberToCall
                                        : recruiterApplication.job.postedBy.contactNumber
                            };
                        }
                        if (reschedule) {
                            return (
                                <BriefingForm
                                    application={ recruiterApplication }
                                    onBriefingRequested={ onBriefingRequested }
                                    isEdit={ true }
                                    onCancel={ onRescheduleCancelled }
                                    enabledType="recruiter"
                                    viewer={ data.viewer }
                                    recruiter={ recruiterApplication.recruiter }
                                    briefing={ briefing }
                                />
                            );
                        }
                        return (
                            <Row>
                                <Col
                                    className="offset-3"
                                    xs={ 6 }
                                >
                                    { recruiterApplication.briefingRequests.map((briefingItem, index) => {
                                        return (
                                            <Fragment key={ index }>
                                                <Row
                                                    className={ `mb-4 briefing-request__status_${
                                                        briefingItem.status
                                                        }` }
                                                >
                                                    <Col>
                                                        <h4>Preferred Date</h4>
                                                        <div>
                                                            { getFullDateFromDateString(briefingItem.dateTime) }
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <h4>Preferred time</h4>
                                                        <div>
                                                            {
                                                                `${getDateObjectFromString(briefingItem.dateTime).getHours()}:${
                                                                    getDateObjectFromString(briefingItem.dateTime).getMinutes()}`
                                                            }
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <h4>Duration</h4>
                                                        <div>
                                                            an hour
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row
                                                    className={ `mb-4 briefing-request__status_${
                                                        briefingItem.status
                                                        }` }
                                                >
                                                    <Col>
                                                        <h4>Additional availability</h4>
                                                        <p>{ briefingItem.notes }</p>
                                                    </Col>
                                                </Row>
                                                <Row
                                                    className={ `mb-4 briefing-request__status_${
                                                        briefingItem.status
                                                        }` }
                                                >
                                                    <Col>
                                                        <h4>Contact Information</h4>
                                                        <p>
                                                            {
                                                                {
                                                                    recruiter: 'Recruiter',
                                                                    'hiring-manager': 'Hiring Manager'
                                                                }[ briefingItem.whoWillCall ]
                                                            }{ ' ' }
                                                            { briefingItem.status === 'pending'
                                                                ? ' wants to '
                                                                : ' will ' }{ ' ' }
                                                            call{ ' ' }
                                                            <strong>
                                                                <a
                                                                    href={ `tel:${
                                                                        briefingItem.numberToCall
                                                                        }` }
                                                                >
                                                                    { briefingItem.numberToCall }
                                                                </a>
                                                            </strong>{ ' ' }
                                                        </p>
                                                    </Col>
                                                </Row>
                                                <RequiresPermission roles={ [ 'super_admin' ] }>
                                                    <div>
                                                        DEV - Only shown for SUPER_ADMIN:{ ' ' }
                                                        { briefingItem.status }
                                                    </div>
                                                </RequiresPermission>
                                                { briefingItem.status !== 'rejected' && (
                                                    <Row
                                                        className={ `briefing-request__status_${
                                                            briefingItem.status
                                                            }` }
                                                    >
                                                        <Col className="text-center">
                                                            <Button
                                                                color="info"
                                                                onClick={ () =>
                                                                    onRescheduleRequested(
                                                                        briefingItem,
                                                                        'reject'
                                                                    )
                                                                }
                                                            >
                                                                Reschedule
                                                            </Button>

                                                            { briefingItem.status === 'pending' && (
                                                                <Button
                                                                    onClick={ () =>
                                                                        onTransitionRequested(
                                                                            briefingItem,
                                                                            'accept'
                                                                        )
                                                                    }
                                                                >
                                                                    Accept
                                                                </Button>
                                                            ) }

                                                            <Button
                                                                onClick={ () =>
                                                                    onTransitionRequested(
                                                                        briefingItem,
                                                                        'reject'
                                                                    )
                                                                }
                                                            >
                                                                Reject
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                ) }
                                            </Fragment>
                                        );
                                    }) }
                                </Col>
                            </Row>
                        );
                    }

                    return <div>Loading briefing...</div>;
                } }
            />
        </Modal>
    );
};

BriefingModalComponent.propTypes = {
    recruiterApplicationId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    onTransitionRequested: PropTypes.func.isRequired,
    onRescheduleRequested: PropTypes.func.isRequired,
    onRescheduleCancelled: PropTypes.func.isRequired,
    onBriefingRequested: PropTypes.func.isRequired,
    reschedule: PropTypes.object.isRequired,
};

export default BriefingModalComponent;
