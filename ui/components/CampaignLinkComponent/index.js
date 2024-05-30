import React, { useEffect }                          from 'react';
import PropTypes                                     from 'prop-types';
import AvatarComponent                               from '../AvatarComponent';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../ButtonComponent';
import FormsyComponent                               from '../formsy/FormsyComponent';
import FormsyNumberInputComponent                    from '../formsy/FormsyNumberInputComponent';
import FormsySubmitComponent                         from '../formsy/FormsySubmitComponent';
import FormsyTextAreaComponent                       from '../formsy/FormsyTextAreaComponent';
import FormsyHiddenInputComponent                    from '../formsy/FormsyHiddenInputComponent';
import scrollToElemById                              from '../../../util/scrollToElemById';
import classNames                                    from 'classnames';
import styles                                        from './styles.scss';

const CampaignLinkComponent = (props) => {
    const {
        pageParams,
        errors,
        isLoading,
        handleSaveResponse,
        campaignId,
        recipientId,
        score,
    } = props;
    const {
        logoImage,
        buttonColor,
        campaignQuestion,
        lessScaleLabel,
        veryScaleLabel,
        passiveGoogleReview,
        promoterGoogleReview,
    } = pageParams;
    const formId = 'campaignResponse';

    useEffect(() => {
        if (score) {
            scrollToElemById(CampaignLinkComponent.IDS.COMMENT, true);
        }
    }, []);

    return (
        <FormsyComponent
            className={ styles.box }
            formId={ formId }
            onValidSubmit={ handleSaveResponse ? handleSaveResponse : () => {} }
            errorMessage={ errors }
        >
            <AvatarComponent
                className={ classNames(styles.avatar, styles.marginBottom) }
                url={ logoImage?.url }
                alt="Your avatar"
                jobType
            />
            <div className={ classNames(styles.title, styles.marginBottom) }>
                { campaignQuestion }
            </div>
            <FormsyHiddenInputComponent
                value={ campaignId }
                name="campaignId"
                required
            />
            { recipientId && <FormsyHiddenInputComponent
                value={ recipientId }
                name="recipientId"
            /> }
            <FormsyNumberInputComponent
                className={ styles.marginBottom }
                name="score"
                value={ (score || score === 0) ? score : null }
                required
                round
                labelMin={ lessScaleLabel }
                labelMax={ veryScaleLabel }
                color={ buttonColor }
            />
            <FormsyTextAreaComponent
                transparent
                className={ styles.marginBottom }
                name={ CampaignLinkComponent.IDS.COMMENT }
                placeholder="Please tell us a little more about your experience..."
            />
            { promoterGoogleReview && <FormsyHiddenInputComponent
                value={ promoterGoogleReview }
                name="promoterGoogleReview"
            /> }
            { passiveGoogleReview && <FormsyHiddenInputComponent
                value={ passiveGoogleReview }
                name="passiveGoogleReview"
            /> }
            { handleSaveResponse && <FormsySubmitComponent
                size={ BUTTON_SIZE.BIG }
                disabled={ isLoading }
                formId={ formId }
                style={ { backgroundColor: buttonColor, borderColor: buttonColor } }
            >
                Send
            </FormsySubmitComponent> }
            { !handleSaveResponse &&
            <ButtonComponent
                size={ BUTTON_SIZE.BIG }
                btnType={ BUTTON_TYPE.ACCENT }
                style={ { backgroundColor: buttonColor, borderColor: buttonColor } }
            >
                Send
            </ButtonComponent> }
        </FormsyComponent>
    );
};

CampaignLinkComponent.IDS = {
    COMMENT: 'comment'
};

CampaignLinkComponent.propTypes = {
    pageParams: PropTypes.object.isRequired,
    errors: PropTypes.string,
    isLoading: PropTypes.bool,
    static: PropTypes.bool,
    recipientId: PropTypes.string,
    campaignId: PropTypes.string,
    handleSaveResponse: PropTypes.func,
    score: PropTypes.number,
};

export default CampaignLinkComponent;
