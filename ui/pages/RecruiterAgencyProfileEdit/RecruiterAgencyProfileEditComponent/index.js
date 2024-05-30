import React, { Fragment }      from 'react';
import PropTypes                from 'prop-types';
import TEST_IDS                 from '../../../../tests/testIds';
import HeaderRowComponent       from '../../../components/HeaderRowComponent';
import HeaderRowButtonComponent from '../../../components/HeaderRowButtonComponent';
import ActionsRowComponent      from '../../../components/ActionsRowComponent';
import ButtonComponent          from '../../../components/ButtonComponent';
import ButtonBackComponent      from '../../../components/ButtonBackComponent';
import FormsyComponent          from '../../../components/formsy/FormsyComponent';
import FormsySubmitComponent    from '../../../components/formsy/FormsySubmitComponent';
import {
    MainInfoAgencyContainer,
    MainInfoRecruiterContainer,
}                               from '../../../containers/MainInfoContainer';
import MainInfoComponent        from './../MainInfoComponent';
import {
    AdditionalInfoAgencyContainer,
    AdditionalInfoRecruiterContainer
}                               from '../../../containers/AdditionalInfoContainer';
import AdditionalInfoComponent  from '../AdditionalInfoComponent';
import ProgressContainer        from '../../../components/ProgressContainer';
import RequiresPermission       from '../../../components/User/RequiresPermission';
import { ROUTES }               from '../../../../constants';
import {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                               from '../../../components/ButtonComponent';
import styles                   from './styles.scss';

const RecruiterAgencyProfileEditComponent = (props) => {
    const { isAgency, isLoading, handleSubmit, handleSaveForm, handleGoToPreview, profileData, errors, hash } = props;
    const formId = 'saveProfileId';
    return (
        <Fragment>
            <ProgressContainer />
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <HeaderRowButtonComponent
                            url={ ROUTES.RECRUITER_PROFILE_EDIT }
                            label="Edit profile"
                            isActive={ !isAgency }
                        />
                        <RequiresPermission roles={ [ 'agency_edit' ] }>
                            <HeaderRowButtonComponent
                                url={ ROUTES.AGENCY_PROFILE_EDIT }
                                label="Edit Agency"
                                isActive={ isAgency }
                            />
                        </RequiresPermission>
                    </Fragment>
                }
            />
            <ActionsRowComponent
                itemActions={
                    <ButtonBackComponent url={ ROUTES.DASHBOARD_REVIEWS } />
                }
                pageActions={
                    <Fragment>
                        <ButtonComponent
                            btnType={ BUTTON_TYPE.WHITE }
                            main
                            size={ BUTTON_SIZE.BIG }
                            className={ styles.previewButton }
                            onClick={ handleGoToPreview }
                        >
                            Preview
                        </ButtonComponent>
                        <FormsySubmitComponent
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            main
                            size={ BUTTON_SIZE.BIG }
                            disabled={ isLoading }
                            dataTest={ TEST_IDS.RECRUITER_PROFILE }
                        >
                            Save changes
                        </FormsySubmitComponent>
                    </Fragment>
                }
            />
            <FormsyComponent
                errorMessage={ errors }
                onValidSubmit={ handleSubmit }
                formId={ formId }
                onChange={ handleSaveForm }
            >
                <div className={ styles.form }>
                    <div className={ styles.mainInfoBox }>

                        { isAgency ?
                            <MainInfoAgencyContainer
                                hash={ hash }
                                isAgency={ isAgency }
                                profileData={ profileData }
                            ><MainInfoComponent /></MainInfoAgencyContainer> :
                            <MainInfoRecruiterContainer
                                hash={ hash }
                                isAgency={ isAgency }
                                profileData={ profileData }
                            ><MainInfoComponent /></MainInfoRecruiterContainer>
                        }
                    </div>
                    <div className={ styles.additionalInfoBox }>
                        { isAgency ?
                            <AdditionalInfoAgencyContainer
                                profileData={ profileData }
                                isAgency={ isAgency }
                            ><AdditionalInfoComponent /></AdditionalInfoAgencyContainer> :
                            <AdditionalInfoRecruiterContainer
                                profileData={ profileData }
                                isAgency={ isAgency }
                            ><AdditionalInfoComponent /></AdditionalInfoRecruiterContainer>
                        }
                    </div>
                </div>

            </FormsyComponent>
        </Fragment>
    );
};
RecruiterAgencyProfileEditComponent.propTypes = {
    isAgency: PropTypes.bool,
    isLoading: PropTypes.bool,
    errors: PropTypes.string,
    profileData: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleSaveForm: PropTypes.func.isRequired,
    handleGoToPreview: PropTypes.func.isRequired,
    hash: PropTypes.string,
};

export default RecruiterAgencyProfileEditComponent;
