import React, { Fragment }          from 'react';
import PropTypes                    from 'prop-types';
import TEST_IDS                     from '../../../../tests/testIds';
import HeaderRowComponent           from '../../../components/HeaderRowComponent';
import HeaderRowButtonComponent     from '../../../components/HeaderRowButtonComponent';
import AlertComponent               from '../../../components/AlertComponent';
import RequiresPermission           from '../../../components/User/RequiresPermission';
import FormsyComponent              from '../../../components/formsy/FormsyComponent';
import FormsyInputComponent         from '../../../components/formsy/FormsyInputComponent';
import FormsyImageDropZoneComponent from '../../../components/formsy/FormsyImageDropZoneComponent';
import FormsyTextAreaComponent      from '../../../components/formsy/FormsyTextAreaComponent';
import FormsySubmitComponent        from '../../../components/formsy/FormsySubmitComponent';
import FormsySelectComponent        from '../../../components/formsy/FormsySelectComponent';
import EditEmailContainer           from '../../../components/EditEmailContainer';
import {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                   from '../../../components/ButtonComponent';
import { ROUTES }                   from '../../../../constants';
import styles                       from './styles.scss';

const UserCompanyProfileEditComponent = (props) => {
    const { isLoading, profile, errors, handleSubmit, isCompany, complete, industries } = props;
    const formId = 'userCompanyFormId';

    return (
        <Fragment>
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <HeaderRowButtonComponent
                            url={ ROUTES.USER_PROFILE_EDIT }
                            label="Edit profile"
                            isActive={ !isCompany }
                        />
                        <RequiresPermission roles={ [ 'company_edit' ] }>
                            <HeaderRowButtonComponent
                                url={ ROUTES.COMPANY_PROFILE_EDIT }
                                label="Edit Company"
                                isActive={ isCompany }
                            />
                        </RequiresPermission>
                    </Fragment>
                }
            />

            { !complete && isCompany && <AlertComponent type={ AlertComponent.TYPE.WARNING }>
                <div>Your company profile is incomplete.{ ' ' }</div>
                <div>
                    To make sure we match you with the best recruiters, please tell us about
                    your company.
                </div>
            </AlertComponent> }
            { !complete && !isCompany && <AlertComponent type={ AlertComponent.TYPE.WARNING }>
                <div>Your user profile is incomplete.{ ' ' }</div>
                <div>
                    To make sure we match you with the best recruiters, please tell us a little more about yourself.
                </div>
            </AlertComponent> }
            <FormsyComponent
                onValidSubmit={ handleSubmit }
                formId={ formId }
                className={ styles.form }
                errorMessage={ errors }
                disableAutoComplete
            >
                { !isCompany ? <Fragment>
                        <FormsyImageDropZoneComponent
                            className={ styles.dropZone }
                            value={ profile.profilePhoto && profile.profilePhoto.url }
                            name="profilePhoto"
                            dropZoneClassName={ styles.avatar }
                            cropperProps={ {
                                width: +styles.avatarWidth,
                                border: +styles.cropperBorder,
                            } }
                            borderRadius={ +styles.avatarWidth / 2 }
                        >
                            Upload avatar image
                        </FormsyImageDropZoneComponent>
                        <div className={ styles.row }>
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.firstName }
                                name="firstName"
                                required
                                placeholder="Enter first name"
                                label="First name"
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.lastName }
                                name="lastName"
                                required
                                placeholder="Enter last name"
                                label="Last name"
                            />
                        </div>
                        <div className={ styles.row }>
                            <EditEmailContainer
                                email={ profile.email }
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.jobTitle }
                                name="jobTitle"
                                required
                                placeholder="Enter job title"
                                label="Job title"
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.contactNumber }
                                name="contactNumber"
                                required
                                placeholder="Enter contact number"
                                label="Contact number"
                            />
                        </div>
                        <div className={ styles.row }>
                            <FormsyInputComponent
                                className={ styles.input }
                                name="password"
                                placeholder="Leave it empty if you don't want to change it"
                                label="password"
                                type="password"
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                name="passwordConfirm"
                                placeholder="Enter password again"
                                label="Confirm password"
                                type="password"
                                validations="equalsField:password"
                                validationError="Passwords don't match"
                            />
                        </div>
                    </Fragment> :
                    <Fragment>
                        <FormsyImageDropZoneComponent
                            value={ profile.photo && profile.photo.url }
                            name="photo"
                            className={ styles.dropZone }
                            dropZoneClassName={ styles.avatar }
                            cropperProps={ {
                                width: +styles.avatarWidth,
                                border: +styles.cropperBorder,
                            } }
                        >
                            Upload avatar image
                        </FormsyImageDropZoneComponent>
                        <div className={ styles.row }>
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.name }
                                name="name"
                                required
                                placeholder="Enter company name"
                                label="Company name"
                            />
                            <FormsySelectComponent
                                className={ styles.input }
                                value={ profile.industry && profile.industry.id }
                                name="industry"
                                values={ industries }
                                label="Industry"
                                required
                            />
                        </div>
                        <div className={ styles.row }>
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.website }
                                name="website"
                                required
                                placeholder="Enter website link"
                                label="Website link"
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.employees }
                                name="employees"
                                required
                                placeholder="Enter employer size"
                                label="Employer size"
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.contactNumber }
                                name="contactNumber"
                                required
                                placeholder="Enter contact number"
                                label="Contact number"
                            />
                        </div>
                        <div className={ styles.row }>
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.address }
                                name="address"
                                required
                                placeholder="Enter address"
                                label="Address"
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.city }
                                name="city"
                                required
                                placeholder="Enter city"
                                label="City"
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                value={ profile.state }
                                name="state"
                                required
                                placeholder="Enter state"
                                label="State"
                            />
                        </div>
                        <div className={ styles.row }>
                            <FormsyTextAreaComponent
                                value={ profile.overview }
                                name="overview"
                                placeholder="Company overview"
                            />
                        </div>
                    </Fragment> }
                <FormsySubmitComponent
                    dataTest={ TEST_IDS.EDIT_EMPLOYER }
                    formId={ formId }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.BIG }
                    disabled={ isLoading }
                    className={ styles.submit }
                >
                    Save
                </FormsySubmitComponent>
            </FormsyComponent>
        </Fragment>
    );
};

UserCompanyProfileEditComponent.propTypes = {
    profile: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    isCompany: PropTypes.bool,
    errors: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    complete: PropTypes.bool,
    industries: PropTypes.array,
};

export default UserCompanyProfileEditComponent;
