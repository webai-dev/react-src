import React, { Fragment, PureComponent } from 'react';
import PropTypes                          from 'prop-types';
import TEST_IDS                           from '../../../../tests/testIds';
import FormsyColorInputComponent          from '../../../components/formsy/FormsyColorInputComponent';
import FormsyHiddenInputComponent         from '../../../components/formsy/FormsyHiddenInputComponent';
import FormsyInputComponent               from '../../../components/formsy/FormsyInputComponent';
import FormsyImageDropZoneComponent       from '../../../components/formsy/FormsyImageDropZoneComponent';
import FormsyArrayInputComponent          from '../../../components/formsy/FormsyArrayInputComponent';
import LocationFormsyInputComponent       from '../../../components/LocationFormsyInputComponent';
import RequiresBillingContainer           from '../../../components/RequiresBillingContainer';
import LockMarkerComponent                from '../../../components/RequiresBillingContainer/LockMarkerComponent';
import {
    AboutRecruiterContainer,
    AboutAgencyContainer
}                                         from '../../../containers/AboutContainer';
import EditAgencyContainer                from '../EditAgencyContainer';
import EditEmailContainer                 from '../../../components/EditEmailContainer';
import AboutComponent                     from '../AboutComponent';
import {
    SEARCH_ROLE_TYPES,
}                                         from '../../../../constants';
import scrollToElemById                   from '../../../../util/scrollToElemById';
import classNames                         from 'classnames';
import styles                             from './styles.scss';

class MainInfoComponent extends PureComponent {
    componentDidMount() {
        scrollToElemById(this.props.hash);
    }

    render() {
        const { profile, profileInfo, isAgency, jobCategories } = this.props;
        const {
            roleTypes,
            specialisations,
            name,
            backgroundUrl,
            avatarUrl,
            jobTitle,
            email,
            contactNumber,
            linkedinUrl,
            agency,
            postcode,
            suburb,
            facebookUrl,
            twitterUrl,
        } = profileInfo;

        return (// hidden inputs are required by mutation so We pass params here but not allow user to change them
            <Fragment>
                { isAgency && <FormsyHiddenInputComponent
                    value={ name }
                    name="name"
                /> }
                { !isAgency && <FormsyHiddenInputComponent
                    value={ profile.firstName }
                    name="firstName"
                /> }
                { !isAgency && <FormsyHiddenInputComponent
                    value={ profile.lastName }
                    name="lastName"
                /> }

                <div className={ styles.avatarBox }>
                    <FormsyImageDropZoneComponent
                        value={ avatarUrl }
                        dropZoneClassName={ styles.avatar }
                        name={ isAgency ? 'photo' : 'profilePhoto' }
                        cropperProps={ {
                            width: +styles.avatarWidth,
                            border: +styles.cropperBorder,
                        } }
                        borderRadius={ +styles.avatarWidth / 2 }
                    >
                        { 'Upload\nprofile\nimage' }
                    </FormsyImageDropZoneComponent>
                </div>
                <RequiresBillingContainer capture>
                    <div className={ styles.backgroundBox }>
                        <FormsyImageDropZoneComponent
                            value={ backgroundUrl }
                            dropZoneClassName={ styles.backgroundImage }
                            name="backgroundImage"
                            cropperProps={ {
                                width: +styles.backgroundImageWidth,
                                widthToHeightRatio: +styles.backgroundImageWidthToHeightRatio,
                                border: +styles.cropperBorder,
                            } }
                            tip="1520 x 400px recommended"
                        >
                            <span><LockMarkerComponent /> Upload cover image</span>
                        </FormsyImageDropZoneComponent>
                    </div>
                </RequiresBillingContainer>
                <RequiresBillingContainer>
                    <FormsyColorInputComponent
                        value={ profile.backgroundColor }
                        name="backgroundColor"
                        label={ <span><LockMarkerComponent /> Select a Background colour</span> }
                    />
                </RequiresBillingContainer>

                <h2 className={ styles.header }>
                    { name }
                </h2>

                { !isAgency && <FormsyInputComponent
                    value={ jobTitle }
                    placeholder="Enter job title"
                    name="jobTitle"
                /> }
                { !isAgency &&
                <EditEmailContainer
                    email={ email }
                /> }
                { !isAgency &&
                <EditAgencyContainer
                    agencyId={ agency && agency.id }
                    agencyName={ agency && agency.name }
                />
                }
                <FormsyInputComponent
                    value={ contactNumber }
                    placeholder="Enter phone"
                    name="contactNumber"
                />
                <FormsyInputComponent
                    value={ linkedinUrl }
                    placeholder="Enter LinkedIn URL"
                    name={ isAgency ? 'linkedInUrl' : 'linkedinUrl' }
                />
                { isAgency && <FormsyInputComponent
                    value={ twitterUrl }
                    placeholder="Enter Twitter URL"
                    name="twitterUrl"
                /> }
                { isAgency && <FormsyInputComponent
                    value={ facebookUrl }
                    placeholder="Enter Facebook URL"
                    name="facebookUrl"
                /> }
                <LocationFormsyInputComponent
                    required
                    value={
                        postcode &&
                        {
                            key: postcode,
                            label: `${ suburb }, ${ postcode }`,
                        }
                    }
                    name="postcode"
                />
                <h4 className={ styles.title }>
                    Role Types
                </h4>
                <FormsyArrayInputComponent
                    value={ roleTypes && roleTypes.map(roleType => ({
                        id: roleType,
                        name: roleType,
                    })) }
                    name={ SEARCH_ROLE_TYPES.name }
                    values={ SEARCH_ROLE_TYPES.values.map(roleType => ({
                        id: roleType,
                        name: roleType,
                    })) }
                    isInnerApp
                />
                <h4 className={ styles.title }>
                    Specialisations
                </h4>
                <FormsyArrayInputComponent
                    dataTest={ TEST_IDS.SPECIALISATIONS_SELECT }
                    value={ specialisations }
                    name={ 'specialisations' }
                    values={ [ ...jobCategories ] }
                    maxValues={ 3 }
                    maxValuesText="You can only select up to 3 specialisations"
                    isInnerApp
                />
                <div
                    className={ classNames(
                        styles.hiddenMobile,
                        styles.aboutBox,
                    ) }
                >
                    { isAgency ?
                        <AboutAgencyContainer
                            profileInfo={ profile }
                            isAgency={ isAgency }
                            Component={ AboutComponent }
                        /> :
                        <AboutRecruiterContainer
                            profileInfo={ profile }
                            isAgency={ isAgency }
                            Component={ AboutComponent }
                        />
                    }
                </div>
            </Fragment>
        );
    }
}

MainInfoComponent.propTypes = {
    profileInfo: PropTypes.object,
    profile: PropTypes.object,
    isAgency: PropTypes.bool,
    hash: PropTypes.string,
    jobCategories: PropTypes.arrayOf(PropTypes.object),
};

export default MainInfoComponent;
