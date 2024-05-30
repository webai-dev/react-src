import React                       from 'react';
import { Row, Col }                from 'reactstrap';
import { inject, observer }        from 'mobx-react/index';
import getDateObjectFromString     from '../../../../util/getDateObjectFromString';
import { Button }                  from '../../../components/Button';
import { environment }             from '../../../../api';
import TransitionInterviewMutation from '../../../../mutations/TransitionInterviewMutation';
import RescheduleInterviewMutation from '../../../../mutations/RescheduleInterviewMutation';
import getFullDateFromDateString   from '../../../../util/getFullDateFromDateString';
import { RescheduleModal }         from './Modals';


@inject('store')
@observer
class JobInterview extends React.Component {
    state = { reschedule: null, submitting: false };
    onTransitionRequested = (interview, transition) => {
        this.setState({ submitting: true, reschedule: null });

        TransitionInterviewMutation.commit(environment, interview, transition)
            .then(() => {
                this.setState({ reschedule: null, submitting: false });
                this.props.onComplete ? this.props.onComplete() : null;
            })
            .catch(({ errors }) => {
                if (errors) {
                    this.setState({ errors });
                }
            });
    };

    onRescheduleSubmitted = (interview, schedule) => {

        this.setState({ submitting: true });
        RescheduleInterviewMutation.commit(environment, interview, schedule)
            .then(() => this.setState({ reschedule: null, submitting: false }))
            .catch(({ errors }) => {
                if (errors) {
                    this.setState({ errors });
                }
            })
            .then(() => (this.props.onComplete ? this.props.onComplete() : null));
    };

    render() {
        const { interview } = this.props;
        const { reschedule } = this.state;
        return (
            <React.Fragment>
                <Row className="mb-4">
                    <Col>
                        <h4>When</h4>
                        <div>
                            { getFullDateFromDateString(interview.date) }{ ' ' }
                            { getDateObjectFromString(interview.date)
                                .getHours() < 10 ? '0' : '' }
                            { getDateObjectFromString(interview.date)
                                .getHours() }:
                            { getDateObjectFromString(interview.date)
                                .getMinutes() < 10 ? '0' : '' }
                            { getDateObjectFromString(interview.date)
                                .getMinutes() }
                        </div>
                        <div>
                            { interview.interviewDuration / 60 === 60 ? 'an hour' : `${ interview.interviewDuration / 60 } minutes` }
                        </div>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <h4>ADDITIONAL AVAILABILITY</h4>
                        { interview.additionalAvailability }
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <h4>Location</h4>
                        { interview.location }
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <h4>Attendees</h4>
                        { (interview.attendees || []).map(it => (
                            <Row key={ `${ it.name }:${ it.jobTitle }:${ it.email }` }>
                                <Col>{ it.name }</Col>
                                <Col>{ it.jobTitle }</Col>
                            </Row>
                        )) }
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <h4>Special Instructions</h4>
                        { interview.specialInstructions }
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col className="text-center">
                        { [
                            'pending',
                            'recruiter_requested_reschedule',
                            'user_requested_reschedule'
                        ].indexOf(interview.status) >= 0 && (
                            <React.Fragment>
                                <Button
                                    disabled={ this.state.submitting }
                                    onClick={ () => {
                                        this.onTransitionRequested(interview, 'reject');
                                    } }
                                >
                                    Reject
                                </Button>
                                { ((interview.status !== 'recruiter_requested_reschedule' &&
                                    this.props.store.auth.isRecruiter()) ||
                                    (interview.status !== 'user_requested_reschedule' &&
                                        interview.status !== 'pending' &&
                                        this.props.store.auth.isUser())) && (
                                    <Button
                                        disabled={ this.state.submitting }
                                        onClick={ () => {
                                            this.onTransitionRequested(interview, 'accept');
                                        } }
                                    >
                                        Accept
                                    </Button>
                                ) }
                                <Button
                                    disabled={ this.state.submitting }
                                    onClick={ () => {
                                        this.setState({ reschedule: interview });
                                    } }
                                >
                                    Reschedule
                                </Button>
                            </React.Fragment>
                        ) }
                        { interview.status === 'accepted' && (
                            <Button
                                disabled={ this.state.submitting }
                                onClick={ e => {
                                    this.onTransitionRequested(interview, 'cancel');
                                } }
                            >
                                Cancel
                            </Button>
                        ) }
                    </Col>
                </Row>

                { reschedule !== null && (
                    <RescheduleModal
                        close={ () => this.setState({ reschedule: null }) }
                        onRescheduleSubmitted={ this.onRescheduleSubmitted }
                        key="reschedule-interview"
                        interview={ reschedule }
                    />
                ) }
            </React.Fragment>
        );
    }
}

export default JobInterview;
