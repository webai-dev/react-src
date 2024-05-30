import React                                from 'react';
import PropTypes                            from 'prop-types';
import {
    BaseAPiPath,
    PARAM_SLUG,
    PARAM_STATEMENT_ID,
    ROUTES
}                                           from '../../../../constants';
import getDateObjectFromString              from '../../../../util/getDateObjectFromString';
import AvatarComponent                      from '../../../components/AvatarComponent';
import ButtonComponent,
{
    BUTTON_SIZE,
    BUTTON_TYPE
}                                           from '../../../components/ButtonComponent';
import FormsyComponent                      from '../../../components/formsy/FormsyComponent';
import FormsyInputComponent                 from '../../../components/formsy/FormsyInputComponent';
import FormsyReachTextAreaComponent         from '../../../components/formsy/FormsyReachTextAreaComponent';
import FormsySubmitComponent                from '../../../components/formsy/FormsySubmitComponent';
import FixedInputComponent                  from '../../../components/Form/FixedInputComponent';
import FormsyColorInputComponent            from '../../../components/formsy/FormsyColorInputComponent';
import DeleteActionComponent                from '../../../components/RowItemComponent/DeleteActionComponent';
import DownloadActionComponent              from '../../../components/RowItemComponent/DownloadActionComponent';
import SelectNodesContainer, { NODE_TYPES } from '../SelectNodesContainer';
import { FormattedDate }                    from 'react-intl';
import { generatePath }                     from 'react-router-dom';
import classNames                           from 'classnames';
import styles                               from './styles.scss';

const CapabilityStatementComponent = (props) => {
    const {
        handleSave,
        handleDelete,
        isDeleteLoading,
        isSaveLoading,
        recruiter,
        capabilityStatements,
        handleSelectReviews,
        handleSelectPlacements,
        selectedReviews,
        selectedPlacements,
        saveErrors,
        handleSaveForm,
        handleGoToPreview,
    } = props;
    const formId = 'generateCapabilityStatement';

    return (
        <div className={ styles.box }>
            <div className={ styles.column }>
                <h2>Saved Statements</h2>
                { capabilityStatements.map(statement => {
                    const toCapabilityStatement = generatePath(ROUTES.STATEMENT, {
                        [ PARAM_SLUG ]: recruiter.slug,
                        [ PARAM_STATEMENT_ID ]: statement.id,
                    });
                    return (
                        <div
                            className={ styles.statementItem }
                            key={ statement.id }
                        >
                            <div className={ styles.statementInfo }>
                                <ButtonComponent
                                    className={ styles.statementHeader }
                                    to={ toCapabilityStatement }
                                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                                >
                                    { statement.name }
                                </ButtonComponent>
                                <span className={ styles.date }>
                                    <FormattedDate
                                        value={ getDateObjectFromString(statement.createdAt) }
                                        day="2-digit"
                                    />{ ' ' }
                                    <FormattedDate
                                        value={ getDateObjectFromString(statement.createdAt) }
                                        month="long"
                                    />{ ' ' }
                                    <FormattedDate
                                        value={ getDateObjectFromString(statement.createdAt) }
                                        year="numeric"
                                    />
                            </span>
                            </div>
                            <div className={ styles.actions }>
                                <ButtonComponent
                                    className={ styles.marginRight }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    main
                                    to={ toCapabilityStatement }
                                    size={ BUTTON_SIZE.SMALL }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View
                                </ButtonComponent>
                                <DownloadActionComponent
                                    to={
                                        BaseAPiPath + generatePath(
                                            ROUTES.STATEMENT_PDF_URL,
                                            { [ PARAM_STATEMENT_ID ]: statement.id }
                                        ) + '.pdf'
                                    }
                                />
                                <DeleteActionComponent
                                    onClick={ () => {handleDelete(statement.id);} }
                                    isLoading={ isDeleteLoading }
                                />
                            </div>
                        </div>
                    );
                }) }
            </div>
            <FormsyComponent
                className={ styles.column }
                formId={ formId }
                onChange={ handleSaveForm }
                onValidSubmit={ handleSave }
                errorMessage={ saveErrors }
            >
                <h2 className={ styles.marginBottom }>Generate a Capability Statement</h2>
                <FormsyInputComponent
                    className={ styles.marginBottom }
                    name="name"
                    placeholder="Enter a Statement name"
                    required
                />
                <div className={ styles.marginBottom }>
                    <b>Your personal Details</b>
                </div>
                <AvatarComponent
                    url={ recruiter.photo && recruiter.photo.url }
                    className={ classNames(styles.avatar, styles.marginBottom) }
                />
                <FixedInputComponent
                    className={ styles.marginBottom }
                    value={ [ recruiter.firstName, recruiter.lastName ].filter(Boolean)
                        .join(' ') }
                    placeholder="name"
                />
                <FixedInputComponent
                    className={ styles.marginBottom }
                    value={ recruiter.jobTitle }
                    placeholder="jobTitle"
                />
                <FixedInputComponent
                    className={ styles.marginBottom }
                    value={ recruiter.email }
                    placeholder="email"
                />
                <FixedInputComponent
                    className={ styles.marginBottom }
                    value={ recruiter.contactNumber }
                    placeholder="Contact number"
                />
                <FixedInputComponent
                    className={ styles.marginBottom }
                    value={ recruiter.linkedinUrl }
                    placeholder="linkedin url"
                />
                <div className={ styles.marginBottom }>
                    <b>Your statement</b>
                </div>
                <FormsyReachTextAreaComponent
                    placeholder="Your statement"
                    className={ styles.marginBottom }
                    name="statement"
                    required
                />
                <div className={ styles.marginBottom }>
                    <b>Your brand details</b>
                </div>
                <div className={ classNames(styles.itemsBox, styles.marginBottom) }>
                    <FormsyColorInputComponent
                        className={ styles.noMargin }
                        name="backgroundColor"
                        value={ recruiter.backgroundColor || '#2b2b2b' }
                        label="Select a Background colour"
                        required
                    />
                    <FormsyColorInputComponent
                        className={ styles.noMargin }
                        name="textColor"
                        value="#2b2b2b"
                        label="Select a Text colour"
                        required
                    />
                </div>
                <div className={ styles.marginBottom }>
                    <b>Add Reviews & Placements</b>
                </div>
                <div className={ styles.nodeBox }>
                    <SelectNodesContainer
                        className={ styles.selectNodes }
                        type={ NODE_TYPES.REVIEWS_RECRUITER }
                        selectedNodes={ selectedReviews }
                        handleSelectNodes={ handleSelectReviews }
                        name="reviews"
                        latestCount={ 5 }
                    />
                    <SelectNodesContainer
                        className={ styles.selectNodes }
                        type={ NODE_TYPES.PLACEMENTS }
                        selectedNodes={ selectedPlacements }
                        handleSelectNodes={ handleSelectPlacements }
                        name="placements"
                        latestCount={ 5 }
                    />
                </div>
                <div className={ classNames(styles.itemsBox, styles.submitButtons) }>
                    <ButtonComponent
                        className={ styles.previewButton }
                        btnType={ BUTTON_TYPE.BORDER }
                        size={ BUTTON_SIZE.BIG }
                        onClick={ handleGoToPreview }
                    >
                        Preview
                    </ButtonComponent>
                    <FormsySubmitComponent
                        main
                        size={ BUTTON_SIZE.BIG }
                        disabled={ isSaveLoading }
                        formId={ formId }
                    >
                        Generate and save
                    </FormsySubmitComponent>
                </div>
            </FormsyComponent>
        </div>
    );
};

CapabilityStatementComponent.propTypes = {
    handleSave: PropTypes.func.isRequired,
    handleGoToPreview: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    isDeleteLoading: PropTypes.bool,
    recruiter: PropTypes.object.isRequired,
    capabilityStatements: PropTypes.arrayOf(PropTypes.object).isRequired,
    isSaveLoading: PropTypes.bool,
    handleSelectReviews: PropTypes.func.isRequired,
    handleSelectPlacements: PropTypes.func.isRequired,
    handleSaveForm: PropTypes.func.isRequired,
    selectedReviews: PropTypes.arrayOf(PropTypes.string),
    selectedPlacements: PropTypes.arrayOf(PropTypes.string),
    saveErrors: PropTypes.string,
};

export default CapabilityStatementComponent;
