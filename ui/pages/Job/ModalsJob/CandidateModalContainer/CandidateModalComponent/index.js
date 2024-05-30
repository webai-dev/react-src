import React, { Fragment }     from 'react';
import PropTypes               from 'prop-types';
import LinkedInIcon            from '../../../../../../assets/icons/LinkedInIcon';
import CandidateAvatar         from '../../../../../../images/candidate_avatar.png';
import AvatarComponent         from '../../../../../components/AvatarComponent';
import { ErrorList }           from '../../../../../components/Misc';
import FixedInputComponent     from '../../../../../components/Form/FixedInputComponent';
import { RescheduleModal }     from '../../Modals';
import ButtonComponent, {
    BUTTON_TYPE, BUTTON_SIZE
}                              from '../../../../../components/ButtonComponent';
import Cross2Icon              from '../../../../../../assets/icons/Cross2Icon';
import ErrorComponent          from '../../../../../components/ErrorComponent';
import ModalComponent          from '../../../../../components/ModalComponent';
import LoaderComponent         from '../../../../../components/LoaderComponent';
import getMonthFromDateString  from '../../../../../../util/getMonthFromDateString';
import getDateObjectFromString from '../../../../../../util/getDateObjectFromString';
import classNames              from 'classnames';
import styles                  from './styles.scss';

const JobApplicationInterviews = (props) => {
    const
        {
            application: { interviewRequests, job },
            handleReschedule,
            onTransitionRequested,
            cancelReason = '',
            handleViewInterview,
            isEmployer,
            cancelInterviewModal,
            handleCloseCancelModal,
            handleOpenCancelModal,
        } = props;
    return (
        <Fragment>
            <h3 className={ styles.interviewTitle }>Interview Requests</h3>
            <div className={ styles.requestBox }>
                { interviewRequests.length === 0 && (
                    <div className={ styles.requestItem }>
                        The candidate has yet to receive any request to interview for this job
                    </div>
                ) }
                { interviewRequests.map(interview => {
                    return (
                        <div
                            key={ interview.id }
                            className={ styles.requestItem }
                        >
                            <div className={ styles.requestItemPiece }>
                                { `${ getMonthFromDateString(interview.date) } ${ getDateObjectFromString(interview.date)
                                    .getDate() } ` }
                                { `at ${getDateObjectFromString(interview.date)
                                    .getHours() < 10 ? '0': ''}${ getDateObjectFromString(interview.date)
                                    .getHours() }:${getDateObjectFromString(interview.date)
                                    .getMinutes()< 10 ? '0': ''}${
                                    getDateObjectFromString(interview.date)
                                        .getMinutes() }` }
                            </div>
                            <div className={ styles.requestItemPiece }>
                                { interview.attendees.map((request, index) => {
                                    return (
                                        <div key={ index }>
                                            <a href={ `mailto:${ request.email }` }>{ request.name }</a>
                                            { ' ' }-{ ' ' }{ request.jobTitle }
                                        </div>
                                    );
                                }) }
                            </div>
                            { job.status !== 'filled' && (
                                <div className={ classNames(styles.requestItemPiece, styles.requestItemButtons) }>
                                    { (interview.status === 'filled' ||
                                        interview.status === 'cancelled' ||
                                        interview.status === 'completed' ||
                                        interview.status === 'rejected') && (
                                        <span className={ styles.status }>
                                        { interview.status[ 0 ].toUpperCase() }
                                            { interview.status.slice(1) }
                                    </span>
                                    ) }

                                    { !(interview.status === 'completed' || interview.status === 'rejected') && (
                                        <Fragment>
                                            { interview.status !== 'cancelled' &&
                                            <ButtonComponent
                                                className={ styles.button }
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                onClick={ () => handleReschedule(interview) }
                                            >
                                                Reschedule
                                            </ButtonComponent>
                                            }
                                            { interview.status === 'pending' && !isEmployer &&
                                            <ButtonComponent
                                                className={ styles.button }
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                onClick={ () => onTransitionRequested(interview, 'accept') }
                                            >
                                                Accept
                                            </ButtonComponent>
                                            }
                                            { interview.status === 'pending' && !isEmployer &&
                                            <ButtonComponent
                                                className={ styles.button }
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                onClick={ () => onTransitionRequested(interview, 'reject') }
                                            >
                                                Reject
                                            </ButtonComponent>
                                            }
                                            { interview.status === 'user_requested_reschedule' && !isEmployer &&
                                            <ButtonComponent
                                                className={ styles.button }
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                onClick={ () => onTransitionRequested(interview, 'accept') }
                                            >
                                                Accept reschedule
                                            </ButtonComponent>
                                            }
                                            { interview.status === 'recruiter_requested_reschedule' && !isEmployer &&
                                            <ButtonComponent
                                                className={ styles.button }
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                onClick={ () => onTransitionRequested(interview, 'reject') }
                                            >
                                                Reject
                                            </ButtonComponent>
                                            }
                                            { interview.status === 'recruiter_requested_reschedule' && isEmployer &&
                                            <ButtonComponent
                                                className={ styles.button }
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                onClick={ () => onTransitionRequested(interview, 'accept') }
                                            >
                                                Accept reschedule
                                            </ButtonComponent>
                                            }
                                            { interview.status === 'accepted' && isEmployer &&
                                            <ButtonComponent
                                                className={ styles.button }
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                onClick={ () => onTransitionRequested(interview, 'completed') }
                                            >
                                                Completed
                                            </ButtonComponent>
                                            }
                                            { interview.status !== 'cancelled' && interview.status !== 'rejected' && isEmployer &&
                                            <ButtonComponent
                                                className={ styles.button }
                                                btnType={ BUTTON_TYPE.ACCENT }
                                                onClick={ () => {handleOpenCancelModal(interview.id);} }
                                            >
                                                Cancel
                                            </ButtonComponent>
                                            }
                                            { cancelInterviewModal === interview.id && <ModalComponent
                                                handleClose={ handleCloseCancelModal }
                                                classNameOuter={ styles.modal }
                                            >
                                                <ButtonComponent
                                                    ariaLabel="close modal"
                                                    btnType={ BUTTON_TYPE.LINK }
                                                    className={ styles.close }
                                                    onClick={ handleCloseCancelModal }
                                                >
                                                    <Cross2Icon />
                                                </ButtonComponent>
                                                <div className={ styles.form }>
                                                    <h2 className={ styles.title }>
                                                        Cancel Interview
                                                    </h2>
                                                    <div className={ styles.infoText }>
                                                        Are you sure you want to cancel this interview?
                                                    </div>
                                                    <div className={ styles.buttonBox }>
                                                        <ButtonComponent
                                                            className={ styles.button }
                                                            btnType={ BUTTON_TYPE.ACCENT }
                                                            onClick={ handleCloseCancelModal }
                                                        >
                                                            No
                                                        </ButtonComponent>
                                                        <ButtonComponent
                                                            className={ styles.button }
                                                            btnType={ BUTTON_TYPE.ACCENT }
                                                            onClick={ () => {
                                                                onTransitionRequested(
                                                                    interview,
                                                                    'cancel',
                                                                    cancelReason,
                                                                );
                                                            } }
                                                        >
                                                            Cancel Interview
                                                        </ButtonComponent>
                                                    </div>
                                                </div>
                                            </ModalComponent> }
                                        </Fragment>
                                    ) }
                                    <ButtonComponent
                                        className={ styles.button }
                                        btnType={ BUTTON_TYPE.ACCENT }
                                        onClick={ () => handleViewInterview(interview) }
                                    >
                                        View details
                                    </ButtonComponent>
                                </div>
                            ) }
                        </div>
                    );
                }) }
            </div>
        </Fragment>
    );
};

JobApplicationInterviews.propTypes = {
    handleViewInterview: PropTypes.func.isRequired,
    handleReschedule: PropTypes.func.isRequired,
    onTransitionRequested: PropTypes.func.isRequired,
    cancelReason: PropTypes.string,
    application: PropTypes.object.isRequired,
    isEmployer: PropTypes.bool,
    cancelInterviewModal: PropTypes.string,
    handleCloseCancelModal: PropTypes.func.isRequired,
    handleOpenCancelModal: PropTypes.func.isRequired,
};

const CandidateModalComponent = (props) => {
    const {
        handleCloseModal,
        handleViewInterview,
        handleReschedule,
        handleCancelReason,
        handleTransitionInterview,
        handleRescheduleSubmit,
        error,
        isLoading,
        application,
        isEmployer,
        reschedule,
        errors,
        cancelReason,

        cancelInterviewModal,
        handleCloseCancelModal,
        handleOpenCancelModal,
    } = props;

    const candidate = application && application.candidate;
    const files = application && application.files;

    return (
        <ModalComponent
            handleClose={ handleCloseModal }
            classNameOuter={ styles.modal }
        >
            <ButtonComponent
                ariaLabel="close modal"
                btnType={ BUTTON_TYPE.LINK }
                className={ styles.close }
                onClick={ handleCloseModal }
            >
                <Cross2Icon />
            </ButtonComponent>
            <div className={ styles.form }>
                {
                    error &&
                    <ErrorComponent error={ error } />
                }
                {
                    isLoading &&
                    <LoaderComponent row />
                }
                {
                    !error && !isLoading &&
                    <div className={ styles.box }>
                        <div className={ styles.topButtons }>
                            { candidate.linkedinUrl && (
                                <ButtonComponent
                                    className={ styles.socialButton }
                                    ariaLabel="LinkedIn account"
                                    btnType={ BUTTON_TYPE.ICON }
                                    to={ candidate.linkedinUrl }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <LinkedInIcon />
                                </ButtonComponent>
                            ) }
                        </div>
                        <AvatarComponent
                            url={ CandidateAvatar }
                            alt={ `${ candidate.firstName } ${ candidate.lastName } avatar` }
                        />
                        { files && files.length > 0 && (
                            <div className={ styles.fileBox }>
                                { files.map(({ id, url, name }) => (
                                    <ButtonComponent
                                        key={ id }
                                        ariaLabel="LinkedIn account"
                                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                                        size={ BUTTON_SIZE.SMALL }
                                        to={ url }
                                        forceHref
                                    >
                                        { name }
                                    </ButtonComponent>
                                )) }
                            </div>
                        ) }
                        <ErrorList
                            errors={ errors }
                        />

                        <div className={ styles.valueBox }>
                            <FixedInputComponent
                                className={ styles.smallValue }
                                value={ candidate.firstName }
                                label="First Name"
                            />
                            <FixedInputComponent
                                className={ styles.smallValue }
                                value={ candidate.lastName }
                                label="Last Name"
                            />
                            <FixedInputComponent
                                className={ styles.smallValue }
                                value={ `${ candidate.noticePeriod } weeks` }
                                label="Notice period"
                            />
                            <FixedInputComponent
                                className={ styles.smallValue }
                                value={ (candidate.workRights || '').toLowerCase() === 'restricted'
                                    ? 'Restricted'
                                    : 'Unrestricted' }
                                label="Working Rights"
                            />
                            { application.job.type === 'temp' && (
                                <FixedInputComponent
                                    className={ styles.smallValue }
                                    value={ `${ candidate.grossRate }` }
                                    label="Gross rate"
                                />
                            ) }
                            { application.job.type === 'temp' && (
                                <FixedInputComponent
                                    className={ styles.smallValue }
                                    value={ candidate.rateType || 'N/A' }
                                    label="Rate type"
                                />
                            ) }
                        </div>
                        { application.job.type !== 'temp' && (
                            <div className={ styles.valueBox }>
                                <FixedInputComponent
                                    value={ candidate.salaryExpectations }
                                    label="Salary Expectations"
                                />
                            </div>
                        ) }
                        <div className={ styles.valueBox }>
                            <FixedInputComponent
                                value={ candidate.additionalInformation || 'No information' }
                                multipleLine
                                label="Additional Information"
                            />
                        </div>
                        <JobApplicationInterviews
                            isEmployer={ isEmployer }
                            application={ application }
                            cancelReason={ cancelReason }
                            handleReschedule={ handleReschedule }
                            onTransitionRequested={ handleTransitionInterview }
                            handleViewInterview={ handleViewInterview }
                            handleCancelReason={ handleCancelReason }
                            cancelInterviewModal={ cancelInterviewModal }
                            handleCloseCancelModal={ handleCloseCancelModal }
                            handleOpenCancelModal={ handleOpenCancelModal }
                        />
                        <div className={ styles.buttonBox }>
                            { !isEmployer && application.status !== 'withdrawn' &&
                            application.status !== 'rejected' &&
                            application.status !== 'placed' && (
                                <ButtonComponent
                                    className={ styles.button }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    to={ `/my-jobs/job/${ application.job
                                        .id }/candidate/${ application.id }/withdraw-candidate` }
                                >
                                    Withdraw
                                </ButtonComponent>
                            ) }
                            { isEmployer && (application.status === 'submitted' ||
                                application.status === 'interviewing' ||
                                application.status === 'offered') && (
                                <ButtonComponent
                                    className={ styles.button }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    to={ `/jobs/${ application.job
                                        .id }/candidate/${ application.id }/reject` }
                                >
                                    Reject candidate
                                </ButtonComponent>
                            ) }
                            { isEmployer && (application.status === 'submitted' ||
                                application.status === 'interviewing' ||
                                (application.status === 'offered' && application.offers.length === 0)) && (
                                <ButtonComponent
                                    className={ styles.button }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    to={ `/jobs/${ application.job.id }/candidate/${ application.id }/offer` }
                                >
                                    Offer
                                </ButtonComponent>
                            ) }
                            { isEmployer && application.status === 'offered' &&
                            application.offers.length > 0 && (
                                <ButtonComponent
                                    className={ styles.button }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    to={ `/jobs/${ application.job
                                        .id }/candidate/${ application.id }/offer/${ application.offers[ 0 ]
                                        .id }` }
                                >
                                    View offer
                                </ButtonComponent>
                            ) }
                            { isEmployer && (application.status === 'submitted' ||
                                application.status === 'interviewing') && (
                                <ButtonComponent
                                    className={ styles.button }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    to={ `/jobs/${ application.job
                                        .id }/candidate/${ application.id }/schedule-interview` }
                                >
                                    Schedule Interview
                                </ButtonComponent>
                            ) }
                        </div>
                        { reschedule !== null && (
                            <RescheduleModal
                                close={ () => handleReschedule(null) }
                                onRescheduleSubmitted={ handleRescheduleSubmit }
                                interview={ reschedule }
                            />
                        ) }
                    </div>
                }
            </div>
        </ModalComponent>
    );
};

CandidateModalComponent.propTypes = {
    cancelInterviewModal: PropTypes.string,
    handleCloseCancelModal: PropTypes.func.isRequired,
    handleOpenCancelModal: PropTypes.func.isRequired,

    handleCloseModal: PropTypes.func.isRequired,
    error: PropTypes.string,
    isLoading: PropTypes.bool,
    isEmployer: PropTypes.bool,
    application: PropTypes.object,
    handleViewInterview: PropTypes.func.isRequired,
    handleRequestBack: PropTypes.func,
    handleReschedule: PropTypes.func.isRequired,
    handleCancelReason: PropTypes.func.isRequired,
    handleTransitionInterview: PropTypes.func.isRequired,
    handleRescheduleSubmit: PropTypes.func.isRequired,
    reschedule: PropTypes.object,
    errors: PropTypes.array,
    cancelReason: PropTypes.string,
};

export default CandidateModalComponent;
