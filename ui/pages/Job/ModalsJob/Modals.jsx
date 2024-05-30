import PropTypes               from 'prop-types';
import React, { Component }    from 'react';
import { Modal }               from '../../../components/Modal';
import {
    FormGroup,
    Select,
    Input,
}                              from '../../../components/Form';
import OfferModalContainer     from '../../../components/OfferModalContainer';
import { Button }              from '../../../components/Button';
import BriefingForm            from '../../../components/BriefingFormComponent';
import InterviewForm           from './InterviewForm';
import JobApplicationForm      from './JobApplicationForm';
import JobInterview            from './JobInterview';
import RescheduleInterviewForm from './RescheduleInterviewForm';

export const InterviewModal = (props) => {
    const {
        job,
        interview,
        applicationId,
        history,
        onInterviewRequested,
        isEmployer,
    } = props;
    return (
        <Modal
            isOpen={ true }
            toggle={ () => {
                history.push(
                    isEmployer ? `/jobs/${ job.id }/candidates` : `/my-jobs/job/${ job.id }/candidates`
                );
            } }
            title="Scheduled interview"
        >
            <JobInterview
                onInterviewRequested={ onInterviewRequested }
                onComplete={ () => {
                    history.push(
                        isEmployer ? `/jobs/${ job.id }/candidates` : `/my-jobs/job/${ job.id }/candidates`
                    );
                } }
                job={ job }
                interview={ interview }
                applicationId={ applicationId }
            />
        </Modal>
    );
};

export const JobOfferModal = (props) => {
    const {
        job,
        applicationId,
        viewType,
        history,
        isEmployer,
    } = props;
    return (
        <OfferModalContainer
            handleCloseModal={ () => {
                history.push(
                    isEmployer ? `/jobs/${ job.id }/candidates` : `/${ viewType }/job/${ job.id }/candidates`
                );
            } }
            applicationId={ applicationId }
            isUser={ isEmployer }
        />
    );
};

export const ScheduleInterviewModal = ({ job, applicationId, history, onInterviewRequested }) => (
    <Modal
        isOpen={ true }
        toggle={ () => {
            history.push(`/jobs/${ job.id }/candidates`);
        } }
        title="Schedule interview"
    >
        <InterviewForm
            applicationId={ applicationId }
            onInterviewRequested={ onInterviewRequested }
        />
    </Modal>
);

export const BriefRecruiterModal = (props) => {
    const {
        job,
        contactNumber,
        application,
        history,
        onBriefingRequested,
    } = props;
    return (
        <Modal
            isOpen={ true }
            toggle={ () => {
                history.push(`/jobs/${ job.id }/recruiters`);
            } }
            title={ `Book Briefing with ${ application.recruiter.firstName } ${ application.recruiter
                .lastName }` }
        >
            <BriefingForm
                enabledType="user"
                onBriefingRequested={ onBriefingRequested }
                briefing={ application.briefingRequests[ 0 ] || undefined }
                isEdit={ typeof application.briefingRequests[ 0 ] !== 'undefined' }
                contactNumber={ contactNumber }
                recruiter={ application.recruiter }
                application={ application }
            />
        </Modal>
    );
};

export class WithdrawModal extends Component {
    state = {
        reason: 'Unable to source',
        reasonText: '',
    };

    render() {
        const { job, history, viewType, onRecruiterApplicationWithdraw } = this.props;
        const isOther = this.state.reason.toLowerCase() === 'other';
        return (
            <Modal
                isOpen={ true }
                title="Confirm application withdrawal"
                toggle={ () => {
                    history.push(`/${ viewType }/job/${ job.id }`);
                } }
                className="text-center"
            >
                <div className="confirmations-title">
                    Are you sure you want to withdraw the application?
                </div>
                <FormGroup>
                    <label htmlFor="reason-for-withdrawal">Reason for Withdrawal</label>
                    <Select
                        value={ this.state.reason }
                        onChange={ e => {
                            this.setState({ reason: e.target.value });
                        } }
                    >
                        <option>Unable To Source candidates</option>
                        <option>Not Enough Time to dedicate to the role</option>
                        <option>Brief Not Within Specialisation</option>
                        <option>Other</option>
                    </Select>
                </FormGroup>
                <div style={ { display: isOther ? 'block' : 'none' } }>
                    <Input
                        type="textarea"
                        value={ this.state.reasonText }
                        onChange={ e => this.setState({ reasonText: e.target.value }) }
                        placeholder="Tell the employer why you wish to withdraw on this role"
                    />
                </div>
                <div className="text-center mt-4">
                    <Button
                        onClick={ () =>
                            onRecruiterApplicationWithdraw(
                                job.myApplication,
                                this.state.reason === 'Other' ? this.state.reasonText : this.state.reason,
                            ) }
                    >
                        Withdraw
                    </Button>
                </div>
            </Modal>
        );
    }
}

export const SubmitCandidateModal = (props) => {
    const { job, history, viewType, onCandidateSubmitted } = props;
    return (
        <Modal
            isOpen={ true }
            toggle={ () => {
                history.push(`/${ viewType }/job/${ job.id }/candidates`);
            } }
            title="Submit a candidate"
        >
            <JobApplicationForm
                history={ history }
                viewType={ viewType }
                job={ job }
                onCandidateSubmitted={ onCandidateSubmitted }
            />
        </Modal>
    );
};

export const RescheduleModal = (props) => {
    const { interview, onRescheduleSubmitted, close } = props;
    return (
        <Modal
            toggle={ close }
            isOpen={ true }
        >
            <RescheduleInterviewForm
                interview={ interview }
                onRescheduleSubmitted={ onRescheduleSubmitted }
            />
        </Modal>
    );
};

RescheduleModal.propTypes = {
    interview: PropTypes.object,
    onRescheduleSubmitted: PropTypes.func,
    close: PropTypes.func,
};
