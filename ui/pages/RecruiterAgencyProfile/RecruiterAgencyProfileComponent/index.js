import React, {
    PureComponent,
    Fragment,
}                                   from 'react';
import { generatePath, withRouter } from 'react-router-dom';
import PropTypes                    from 'prop-types';
import {
    MainInfoAgencyContainer,
    MainInfoRecruiterContainer,
}                                   from '../../../containers/MainInfoContainer';
import MainInfoComponent            from '../MainInfoComponent';
import {
    AdditionalInfoAgencyContainer,
    AdditionalInfoRecruiterContainer
}                                   from '../../../containers/AdditionalInfoContainer';
import ReviewDetailsContainer       from '../../../components/ReviewDetailsContainer';
import AdditionalInfoComponent      from '../AdditionalInfoComponent';
import ClaimSuccessComponent        from '../ClaimSuccessComponent';
import ClaimFailContainer           from '../ClaimFailContainer';
import {
    ROUTES,
    LOCAL_STORAGE_KEYS,
    PROFILE_MODAL,
    PARAM_SLUG,
    PARAM_REVIEW_ID,
}                                   from '../../../../constants';
import localStorageInstance         from '../../../../util/LocalStorage';
import styles                       from './styles.scss';

class RecruiterAgencyProfile extends PureComponent {
    constructor(props) {
        super(props);
        const previewParams = props.id ? null :
            JSON.parse(localStorageInstance.getItem(
                LOCAL_STORAGE_KEYS.RECRUITER_PROFILE_PREVIEW,
                true,
            ));

        this.state = {
            previewParams,
        };
    }

    /**
     *  Change route back to recruiter - will hide review modal
     */
    handleCloseModal = () => {
        const { match: { params, path }, history, location: { search } } = this.props;
        const slug = params[ PARAM_SLUG ];

        const isAgency = ROUTES.AGENCY_PROFILE === path || ROUTES.AGENCY_PROFILE_PREVIEW === path;
        history.push(generatePath(
            isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
            {
                [ PARAM_SLUG ]: slug,
            },
        ) + search);
    };

    render() {
        const { handleCloseModal } = this;
        const { previewParams } = this.state;
        const { match: { params, path }, profileData, location: { search } } = this.props;
        const slug = params[ PARAM_SLUG ];
        const modalParam = params[ PROFILE_MODAL._NAME ]; // one of PROFILE_MODAL or placementId
        const reviewId = params[ PARAM_REVIEW_ID ] && params[ PARAM_REVIEW_ID ].replace(
            /%3D/g,
            '=',
        );
        const isAgency = ROUTES.AGENCY_PROFILE === path || ROUTES.AGENCY_PROFILE_PREVIEW === path;
        return (
            <Fragment>
                { modalParam === PROFILE_MODAL.SUCCESS &&
                <ClaimSuccessComponent handleCloseModal={ handleCloseModal } /> }
                { modalParam === PROFILE_MODAL.FAILURE &&
                <ClaimFailContainer
                    handleCloseModal={ handleCloseModal }
                    slug={ slug }
                /> }
                { modalParam === PROFILE_MODAL.REVIEW && reviewId &&
                <ReviewDetailsContainer
                    recruiterRoute={ generatePath(
                        isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
                        {
                            [ PARAM_SLUG ]: slug,
                        },
                    ) + search }
                    reviewId={ reviewId }
                /> }

                <div
                    className={ styles.box }
                    itemScope
                    itemType="https://schema.org/EmploymentAgency"
                    itemID={ slug && generatePath(
                        isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
                        {
                            [ PARAM_SLUG ]: slug,
                        },
                    ) }
                >
                    <div className={ styles.mainInfoBox }>
                        { isAgency ?
                            <MainInfoAgencyContainer
                                slug={ slug }
                                isAgency={ isAgency }
                                previewParams={ previewParams }
                                profileData={ profileData }
                            ><MainInfoComponent /></MainInfoAgencyContainer> :
                            <MainInfoRecruiterContainer
                                slug={ slug }
                                isAgency={ isAgency }
                                previewParams={ previewParams }
                                profileData={ profileData }
                            ><MainInfoComponent /></MainInfoRecruiterContainer>
                        }
                    </div>
                    <div className={ styles.additionalInfoBox }>
                        { isAgency ?
                            <AdditionalInfoAgencyContainer
                                profileData={ profileData }
                                slug={ slug }
                                isAgency={ isAgency }
                                previewParams={ previewParams }
                            ><AdditionalInfoComponent /></AdditionalInfoAgencyContainer> :
                            <AdditionalInfoRecruiterContainer
                                profileData={ profileData }
                                slug={ slug }
                                isAgency={ isAgency }
                                previewParams={ previewParams }
                            ><AdditionalInfoComponent /></AdditionalInfoRecruiterContainer>
                        }
                    </div>
                </div>
            </Fragment>
        );
    }
}

RecruiterAgencyProfile.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    profileData: PropTypes.object.isRequired,
    id: PropTypes.string,
};

export default withRouter(RecruiterAgencyProfile);
