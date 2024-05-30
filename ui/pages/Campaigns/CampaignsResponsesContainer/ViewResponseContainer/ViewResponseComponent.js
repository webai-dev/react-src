import React, { Fragment }        from 'react';
import PropTypes                  from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                 from '../../../../components/ButtonComponent';
import Cross2Icon                 from '../../../../../assets/icons/Cross2Icon';
import getFullDateFromDateString  from '../../../../../util/getFullDateFromDateString';
import getNpsType                 from '../../../../../util/getNpsType';
import ModalComponent             from '../../../../components/ModalComponent';
import FormsyComponent            from '../../../../components/formsy/FormsyComponent';
import FormsySubmitComponent      from '../../../../components/formsy/FormsySubmitComponent';
import FormsyInputComponent       from '../../../../components/formsy/FormsyInputComponent';
import FormsyHiddenInputComponent from '../../../../components/formsy/FormsyHiddenInputComponent';
import FormsyTextAreaComponent    from '../../../../components/formsy/FormsyTextAreaComponent';
import StatusComponent            from '../../../../components/StatusComponent';
import ButtonActionComponent      from '../../../../components/RowItemComponent/ButtonActionComponent';
import ErrorComponent             from '../../../../components/ErrorComponent';
import LoaderComponent            from '../../../../components/LoaderComponent';
import classNames                 from 'classnames';
import styles                     from './styles.scss';

const ViewResponseComponent = (props) => {
    const {
        handleOpenModal,
        handleCloseModal,
        handleSubmit,
        showModal,
        response,
        isLoading,
        error
    } = props;
    const formId = 'SendReply';

    return (
        <Fragment>
            <ButtonActionComponent
                onClick={ handleOpenModal }
                text="View"
            />

            { // MODAL
                showModal &&
                <ModalComponent
                    handleClose={ handleCloseModal }
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
                            error && <ErrorComponent error={ error } />
                        }
                        {
                            isLoading && <div className={ styles.loader }>
                                <LoaderComponent full />
                            </div>
                        }
                        { response && <div>
                            <h2 className={ styles.title }>
                                { (response.firstName || response.lastName) ?
                                    `${ response.firstName || '' } ${ response.lastName || '' }` :
                                    'Anonymous' }
                            </h2>
                            <div className={ classNames(styles.marginBottom, styles.text) }>
                                { response.userType }
                                { response.jobCategory && ` - ${ response.jobCategory }` }
                                { response.campaignName && ` - ${ response.campaignName }` }
                                { response.reviewStatus && ` - ${ response.reviewStatus }` }
                            </div>
                            { (response.recruiterFirstName || response.recruiterLastName) &&
                            <div className={ classNames(styles.marginBottom, styles.text) }>
                                <span className={ styles.important }>Recruiter: </span>
                                <ButtonComponent
                                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                                    size={ BUTTON_SIZE.SMALL }
                                >
                                    { `${ response.recruiterFirstName || '' } ${ response.recruiterLastName || '' }` }
                                </ButtonComponent>
                            </div> }
                            { response.npsSurveyActivities && !!response.npsSurveyActivities.length &&
                            <div className={ styles.marginBottom }>
                                <div className={ classNames(styles.marginBottom, styles.important) }>
                                    Activity
                                </div>
                                <ul>
                                    { response.npsSurveyActivities.map((activity, index) => (
                                        <li
                                            className={ styles.li }
                                            key={ index }
                                        >
                                            <div className={ styles.liContent }>
                                                <span>{ activity.event }</span>
                                                <span className={ styles.date }>
                                                { getFullDateFromDateString(activity.createdAt) }
                                            </span>
                                            </div>
                                        </li>
                                    )) }
                                </ul>
                            </div> }
                            <div className={ classNames(styles.subTitle, styles.marginBottom) }>
                                <StatusComponent
                                    status={
                                        getNpsType(
                                            response.score,
                                            StatusComponent.STATUS.SUCCESS,
                                            StatusComponent.STATUS.WARNING,
                                            StatusComponent.STATUS.DANGER
                                        ) }
                                    big
                                />NPS: { response.score }
                            </div>
                            { response.comment && <div className={ styles.marginBottom }>
                                { response.comment }
                            </div> }
                            { response.email && !response.replySubject && <FormsyComponent
                                onValidSubmit={ handleSubmit }
                                formId={ formId }
                            >
                                <div className={ styles.subTitle }>
                                    Send a reply
                                </div>
                                <FormsyHiddenInputComponent
                                    value={ response.id }
                                    name="npsScoreId"
                                />
                                <FormsyInputComponent
                                    required
                                    placeholder="Subject"
                                    name="subject"
                                />
                                <FormsyTextAreaComponent
                                    required
                                    name="message"
                                />
                                <FormsySubmitComponent
                                    formId={ formId }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    size={ BUTTON_SIZE.BIG }
                                >
                                    Send
                                </FormsySubmitComponent>
                            </FormsyComponent> }
                            { response.replySubject && <Fragment>
                                <div className={ classNames(styles.subTitle, styles.marginBottom) }>
                                    { response.replySubject }
                                </div>
                                <div>
                                    { response.replyMessage }
                                </div>
                            </Fragment> }
                        </div> }
                    </div>
                </ModalComponent>
            }
        </Fragment>
    );
};

ViewResponseComponent.propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    showModal: PropTypes.bool,
    response: PropTypes.object,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
};

export default ViewResponseComponent;
