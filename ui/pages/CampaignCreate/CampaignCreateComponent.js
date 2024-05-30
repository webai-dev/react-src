import React, { Fragment }                           from 'react';
import PropTypes                                     from 'prop-types';
import { generatePath }                              from 'react-router-dom';
import uuid                                          from 'uuid/v1';
import Cross2Icon                                    from '../../../assets/icons/Cross2Icon';
import LinkIcon                                      from '../../../assets/icons/LinkIcon';
import { CAMPAIGN_ID, ROUTES, BaseAPiPath }          from '../../../constants';
import TEST_IDS                                      from '../../../tests/testIds';
import ActionsRowComponent                           from '../../components/ActionsRowComponent';
import AlertComponent                                from '../../components/AlertComponent';
import ButtonBackComponent                           from '../../components/ButtonBackComponent';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../components/ButtonComponent';
import CopyInputComponent                            from '../../components/CopyInputComponent';
import CountersComponent                             from '../../components/CountersComponent';
import FormsyComponent                               from '../../components/formsy/FormsyComponent';
import FormsyHiddenInputComponent                    from '../../components/formsy/FormsyHiddenInputComponent';
import FormsyInputComponent                          from '../../components/formsy/FormsyInputComponent';
import FormsySelectComponent                         from '../../components/formsy/FormsySelectComponent';
import FormsySubmitComponent                         from '../../components/formsy/FormsySubmitComponent';
import FormsyDateFromToComponent                     from '../../components/formsy/FormsyDateFromToComponent';
import FileManagementComponent                       from '../../components/FileManagementComponent';
import HeaderRowButtonComponent                      from '../../components/HeaderRowButtonComponent';
import HeaderRowComponent                            from '../../components/HeaderRowComponent';
import LoaderComponent                               from '../../components/LoaderComponent';
import ModalComponent                                from '../../components/ModalComponent';
import classNames                                    from 'classnames';
import styles                                        from './styles.scss';

const CampaignCreateComponent = (props) => {
    const {
        isLoading,
        handleSubmitCampaign,
        handleSubmitLink,
        errors,
        handleChangeCampaignType,
        campaignType,
        handleReadCsvFile,
        csvColumns,
        file,
        readingCsvFieldsError,
        campaign,
        recipientType,
        handleChangeRecipientType,
        csvWarnings,
    } = props;

    const newCampaignSlug = campaign?.slug || uuid();
    const linkCampaignPath = BaseAPiPath + generatePath(ROUTES.CAMPAIGNS_RESPONSE, { [ CAMPAIGN_ID ]: newCampaignSlug });

    const formId = 'campaignFormId';
    const campaignsRoute = generatePath(ROUTES.CAMPAIGNS);
    const actionsRow = ( // will be used twice
        <ActionsRowComponent
            itemActions={
                <ButtonBackComponent
                    url={ campaignsRoute }
                />
            }
            pageActions={
                <FormsySubmitComponent
                    dataTest={ TEST_IDS.PLACEMENT }
                    formId={ formId }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.BIG }
                    main
                    disabled={ isLoading }
                >
                    { campaign ? 'Save' : 'Finish' }
                    { isLoading && <LoaderComponent
                        small
                        row
                        invertColor
                    /> }
                </FormsySubmitComponent>
            }
        />
    );

    const candidateStatusTypes = [
        {
            key: 'candidateWithdrew',
            label: 'Candidate Withdrew',
        },
        {
            key: 'candidateNotInterviewed',
            label: 'Candidate Not Interviewed',
        },
        {
            key: 'candidateNotOffered',
            label: 'Candidate Not Offered',
        },
        {
            key: 'candidateGeneral',
            label: 'General',
        } ];

    const employerStatusTypes = [
        {
            key: 'employerNotHired',
            label: 'Employer Not Hired',
        },
        {
            key: 'employerGeneral',
            label: 'General',
        }
    ];

    const statusComponents = (
        <div className={ styles.inputBox }>
            <FormsySelectComponent
                className={ styles.input }
                name="recipientType"
                value={ campaign?.recipientType }
                onChange={ handleChangeRecipientType }
                values={ [
                    {
                        key: 'candidate',
                        label: 'Candidate',
                    },
                    {
                        key: 'employer',
                        label: 'Employer',
                    },
                ] }
                label="Recipient type"
                required
            />
            { recipientType === 'candidate' ? <FormsySelectComponent
                className={ classNames(styles.input, styles.input2) }
                name="recipientStatus"
                value={ candidateStatusTypes.some(({ key }) => key === campaign?.recipientStatus) && campaign?.recipientStatus }
                values={ candidateStatusTypes }
                label="Recipient status"
                required
            /> : <FormsySelectComponent
                className={ classNames(styles.input, styles.input2) }
                name="recipientStatus"
                value={ employerStatusTypes.some(({ key }) => key === campaign?.recipientStatus) && campaign?.recipientStatus }
                values={ employerStatusTypes }
                label="Recipient status"
                required
            />
            }
        </div>
    );

    return (
        <Fragment>
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <HeaderRowButtonComponent
                            url={ campaign ?
                                generatePath(ROUTES.CAMPAIGNS_EDIT, { [ CAMPAIGN_ID ]: campaign.id }) :
                                ROUTES.CAMPAIGNS_NEW
                            }
                            label={ campaign ? 'Edit campaign' : 'Create campaign' }
                            isActive
                        />
                    </Fragment>
                }
            />
            { actionsRow }
            <FormsyComponent
                onValidSubmit={
                    (campaignType === CampaignCreateComponent.TYPES.EMAIL_LIST_CAMPAIGN && !campaign) ?
                        handleSubmitCampaign :
                        handleSubmitLink
                }
                formId={ formId }
                className={ styles.form }
                errorMessage={ errors }
            >
                <div className={ classNames(styles.row, styles.flex, styles.marginBottom) }>
                    { campaign && <FormsyHiddenInputComponent
                        name="id"
                        value={ campaign?.id }
                        required
                    /> }
                    <FormsyInputComponent
                        className={ styles.titleInput }
                        name="title"
                        value={ campaign?.title }
                        placeholder="Enter Campaign title"
                        required
                    />
                    <FormsySelectComponent
                        className={ styles.campaignTypeInput }
                        name="type"
                        onChange={ handleChangeCampaignType }
                        value={ campaign?.type }
                        values={ [
                            {
                                key: CampaignCreateComponent.TYPES.EMAIL_LIST_CAMPAIGN,
                                label: 'Email List campaign',
                            },
                            {
                                key: CampaignCreateComponent.TYPES.LINK_CAMPAIGN,
                                label: 'Link campaign',
                            },
                        ] }
                        label="Campaign type"
                        required
                        disabled={ !!campaign }
                    />
                </div>
                { campaignType === CampaignCreateComponent.TYPES.EMAIL_LIST_CAMPAIGN && <Fragment>
                    { !campaign && <FileManagementComponent
                        file={ file }
                        handleReadCsvFile={ handleReadCsvFile }
                        csvColumns={ csvColumns }
                        readingCsvFieldsError={ readingCsvFieldsError }
                        formsyName="matchValues"
                    /> }
                    <div className={ classNames(styles.row) }>
                        <div className={ styles.marginBottom }>
                            Now let&apos;s setup the campaign...
                        </div>
                        { statusComponents }
                        { !campaign && <div className={ styles.inputBox }>
                            <FormsySelectComponent
                                className={ styles.input }
                                name="sendReminder"
                                values={ [
                                    {
                                        key: 1,
                                        label: 'After 1 day',
                                    },
                                    {
                                        key: 2,
                                        label: 'After 2 day',
                                    },
                                    {
                                        key: 3,
                                        label: 'After 3 day',
                                    },
                                    {
                                        key: 7,
                                        label: 'After 1 Week',
                                    },
                                ] }
                                label="Send reminder"
                                notSelectedLabel="No reminder"
                            />
                            <FormsyDateFromToComponent
                                startClassName={ styles.input }
                                startName="startDate"
                                startLabel="Start date"
                                startRequired
                                endClassName={ styles.input }
                                endName="endDate"
                                endLabel="End date"
                                helpText="Stagger surveys requests over time to create a steady
                                stream of surveys and prevent survey fatigue."
                                endRequired
                            />
                        </div> }
                    </div>
                </Fragment> }
                { campaignType === CampaignCreateComponent.TYPES.LINK_CAMPAIGN && <Fragment>
                    <div className={ classNames(styles.row, styles.marginBottom) }>
                        <div className={ styles.marginBottom }>
                            Please complete the campaign settings
                        </div>
                        { statusComponents }
                    </div>
                    <div className={ classNames(styles.row) }>

                        <div className={ styles.marginBottom }>
                            Link to your campaign
                        </div>
                        <div>
                            <AlertComponent className={ styles.box }>
                                <span className={ styles.icon }>
                                    <LinkIcon />
                                </span>
                                Here is your campaign link:{ ' ' }
                                <b>
                                    <ButtonComponent
                                        className={ styles.link }
                                        size={ BUTTON_SIZE.SMALL }
                                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                                        to={ linkCampaignPath }
                                        forceHref
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        { linkCampaignPath }
                                    </ButtonComponent>
                                </b>
                                &nbsp;
                                <CopyInputComponent
                                    copyElement={ linkCampaignPath }
                                    hidden
                                />
                            </AlertComponent>
                            <FormsyHiddenInputComponent
                                name="slug"
                                value={ campaign ? campaign.slug : newCampaignSlug }
                                required
                            />
                        </div>
                    </div>
                </Fragment> }
            </FormsyComponent>
            { actionsRow }
            { csvWarnings && <ModalComponent
                linkToClose={ campaignsRoute }
            >
                <ButtonComponent
                    ariaLabel="close modal"
                    btnType={ BUTTON_TYPE.LINK }
                    className={ styles.close }
                    to={ campaignsRoute }
                >
                    <Cross2Icon />
                </ButtonComponent>
                <div className={ styles.modalInner }>
                    <h2 className={ styles.title }>
                        Campaign Uploaded
                    </h2>
                    <CountersComponent
                        counters={ [
                            { value: csvWarnings.newRecipients, label: 'Successful' },
                            { value: csvWarnings.recipientsDuplicated, label: 'Duplicates' },
                            { value: csvWarnings.recipientsInvalidRecruiter, label: 'Failed' },
                        ] }
                    />
                </div>
            </ModalComponent> }
        </Fragment>
    );
};

CampaignCreateComponent.TYPES = {
    EMAIL_LIST_CAMPAIGN: 'email-list',
    LINK_CAMPAIGN: 'link',
};

CampaignCreateComponent.propTypes = {
    campaign: PropTypes.object,
    isLoading: PropTypes.bool,
    handleSubmitCampaign: PropTypes.func.isRequired,
    handleSubmitLink: PropTypes.func.isRequired,
    errors: PropTypes.string,
    handleChangeCampaignType: PropTypes.func.isRequired,
    handleChangeRecipientType: PropTypes.func.isRequired,
    campaignType: PropTypes.string,
    recipientType: PropTypes.string,
    handleReadCsvFile: PropTypes.func.isRequired,
    csvColumns: PropTypes.arrayOf(PropTypes.object),
    file: PropTypes.object,
    readingCsvFieldsError: PropTypes.string,
    csvWarnings: PropTypes.object,
};

export default CampaignCreateComponent;
