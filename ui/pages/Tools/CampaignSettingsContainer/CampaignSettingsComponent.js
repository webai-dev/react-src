import React                        from 'react';
import PropTypes                    from 'prop-types';
import { BUTTON_SIZE }              from '../../../components/ButtonComponent';
import FormsyComponent              from '../../../components/formsy/FormsyComponent';
import FormsyImageDropZoneComponent from '../../../components/formsy/FormsyImageDropZoneComponent';
import FormsySubmitComponent        from '../../../components/formsy/FormsySubmitComponent';
import FormsyColorInputComponent    from '../../../components/formsy/FormsyColorInputComponent';
import FormsyInputComponent         from '../../../components/formsy/FormsyInputComponent';
import FormsyTextAreaComponent      from '../../../components/formsy/FormsyTextAreaComponent';
import FormsyToggleYesNoComponent   from '../../../components/formsy/FormsyToggleYesNoComponent';
import CampaignLinkComponent        from '../../../components/CampaignLinkComponent';
import classNames                   from 'classnames';
import styles                       from './styles.scss';

const CampaignSettingsComponent = (props) => {
    const {
        handleSave,
        isLoading,
        errors,
        handleSaveForm,
        form,
        npsCampaignSettings,
        isGoogleIntegrated,
    } = props;
    const formId = 'setCampaignTemplate';
    return (
        <div className={ styles.box }>
            <div
                className={ styles.column }
            >
                <h2>NPS Survey</h2>
                <div className={ styles.border }>
                    <CampaignLinkComponent
                        pageParams={ form || npsCampaignSettings }
                    />
                </div>
            </div>
            <FormsyComponent
                className={ styles.column }
                formId={ formId }
                onValidSubmit={ handleSave }
                errorMessage={ errors }
                onChange={ handleSaveForm }
            >
                <h2>Configuration</h2>
                <div className={ classNames(styles.inputsBox, styles.marginBottom) }>
                    <FormsyImageDropZoneComponent
                        className={ classNames(styles.backgroundImage, styles.input) }
                        dropZoneClassName={ classNames(styles.dropZone) }
                        name="logoImage"
                        value={ npsCampaignSettings.logoImage?.url }
                        cropperProps={ {
                            width: +styles.avatarWidth,
                            widthToHeightRatio: +styles.backgroundImageWidthToHeightRatio,
                            border: +styles.cropperBorder,
                        } }
                        borderRadius={ +styles.avatarWidth / 2 }
                        tip="700 x 580px recommended"
                        isRemovable
                    >
                        <span>Upload logo image</span>
                    </FormsyImageDropZoneComponent>
                    <FormsyColorInputComponent
                        className={ styles.input }
                        name="buttonColor"
                        value={ npsCampaignSettings.buttonColor }
                        label="Select a button colour"

                    />
                </div>
                <b>
                    Your Question
                </b>
                <div className={ styles.inputsBox }>
                    <FormsyTextAreaComponent
                        className={ styles.inputBig }
                        name="campaignQuestion"
                        value={ npsCampaignSettings.campaignQuestion }
                        required
                    />
                </div>
                <b>
                    Scale Labels
                </b>
                <div className={ styles.inputsBox }>
                    <FormsyInputComponent
                        className={ styles.input }
                        name="lessScaleLabel"
                        value={ npsCampaignSettings.lessScaleLabel }
                        required
                    />
                    <FormsyInputComponent
                        className={ styles.input }
                        name="veryScaleLabel"
                        value={ npsCampaignSettings.veryScaleLabel }
                        required
                    />
                </div>
                <b className={ classNames(styles.subTitle, styles.marginBottom) }>
                    Promoter Thank You Message
                </b>
                { isGoogleIntegrated && <FormsyToggleYesNoComponent
                    className={ styles.marginBottom }
                    name="promoterGoogleReview"
                    value={ npsCampaignSettings.promoterGoogleReview }
                    label={ 'Ask for Google review?' }
                /> }
                <div className={ styles.inputsBox }>
                    <FormsyTextAreaComponent
                        name="promoterMessage"
                        value={ npsCampaignSettings.promoterMessage }
                        required
                    />
                </div>
                <b className={ classNames(styles.subTitle, styles.marginBottom) }>
                    Passive Thank You Message
                </b>
                { isGoogleIntegrated && <FormsyToggleYesNoComponent
                    className={ styles.marginBottom }
                    name="passiveGoogleReview"
                    value={ npsCampaignSettings.passiveGoogleReview }
                    label={ 'Ask for Google review?' }
                /> }
                <div className={ styles.inputsBox }>
                    <FormsyTextAreaComponent
                        className={ styles.inputBig }
                        name="passiveMessage"
                        value={ npsCampaignSettings.passiveMessage }
                        required
                    />
                </div>
                <b>
                    Detractor Thank You Message
                </b>
                <div className={ styles.inputsBox }>
                    <FormsyTextAreaComponent
                        className={ styles.inputBig }
                        name="detractorMessage"
                        value={ npsCampaignSettings.detractorMessage }
                        required
                    />
                </div>
                <hr />
                <h2>Email Invitation</h2>
                <div className={ styles.inputsBox }>
                    <FormsyInputComponent
                        className={ styles.inputBig }
                        name="emailFromName"
                        value={ npsCampaignSettings.emailFromName }
                        placeholder="Enter Email From Name"
                    />
                    <FormsyInputComponent
                        className={ styles.inputBig }
                        name="emailSubject"
                        value={ npsCampaignSettings.emailSubject }
                        placeholder="Enter Email Subject"
                        required
                    />
                </div>
                <b>
                    Email Footer (optional)
                </b>
                <div className={ styles.inputsBox }>
                    <FormsyTextAreaComponent
                        className={ styles.inputBig }
                        name="emailFooter"
                        value={ npsCampaignSettings.emailFooter }
                    />
                </div>

                <div className={ classNames(styles.itemsBox, styles.submitButtons) }>
                    <FormsySubmitComponent
                        main
                        size={ BUTTON_SIZE.BIG }
                        disabled={ isLoading }
                        formId={ formId }
                    >
                        Save configuration
                    </FormsySubmitComponent>
                </div>
            </FormsyComponent>
        </div>
    );
};

CampaignSettingsComponent.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleSaveForm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    isGoogleIntegrated: PropTypes.bool,
    errors: PropTypes.string,
    form: PropTypes.object,
    npsCampaignSettings: PropTypes.object.isRequired,
};

export default CampaignSettingsComponent;
