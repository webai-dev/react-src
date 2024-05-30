import React, { Fragment } from 'react';
import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import RatingComponent     from '../../../components/Form/RatingComponent';
import ButtonComponent, {
    BUTTON_TYPE,
}                          from '../../../components/ButtonComponent';
import ReviewsComponent                                      from '../ReviewsComponent';
import PlacementsContainer                                   from '../../../containers/PlacementsContainer';
import PlacementsComponent                                   from '../PlacementsComponent';
import OurTeamContainer                                      from '../../../containers/OurTeamContainer';
import OurTeamComponent                                      from '../OurTeamComponent';
import { ReviewsAgencyContainer, ReviewsRecruiterContainer } from '../../../containers/ReviewsContainer';
import { AboutRecruiterContainer, AboutAgencyContainer }     from '../../../containers/AboutContainer';
import AboutComponent                                        from '../AboutComponent';
import ClaimContainer                                        from '../ClaimContainer';
import { STAGE_URL }                                         from '../../../../constants';
import styles                                                from './styles.scss';

const AdditionalInfoComponent = (props) => {
    const { handleGoToQuery, tabs, tab, profileInfo, unclaimed, isAgency, previewParams, profile } = props;
    const { rating, id, slug, reviewsCount } = profileInfo;

    const backgroundUrl = profileInfo.backgroundUrl || profileInfo.agencyBackgroundUrl;

    const fullUrl = backgroundUrl && (
    (process.env.NODE_ENV !== 'development') ?
        backgroundUrl :
        backgroundUrl.includes('data:') ?
            backgroundUrl :
            `${ STAGE_URL }${ backgroundUrl }`);

    return (
        <Fragment>
            { (unclaimed && id) ?
                <div className={ styles.claimBlock }>
                    <ClaimContainer
                        id={ id }
                        slug={ slug }
                        isAgency={ isAgency }
                    />
                </div> :
                <div
                    className={ styles.ratingBlock }
                    itemProp="aggregateRating"
                    itemScope
                    itemType="https://schema.org/AggregateRating"
                >
                    { fullUrl && <img
                        src={ fullUrl }
                        alt={ `${ name } avatar` }
                        className={ styles.background }
                    /> }
                    <h2 className={ styles.header }>
                        Overall rating
                    </h2>
                    { rating > 0 ?
                        (
                            <Fragment>
                                <RatingComponent
                                    rating={ rating }
                                    fixed
                                />
                                <div className={ styles.rating }>
                                    <span itemProp="ratingValue">{ rating.toFixed(1) }</span>
                                    { ' ' }rating based on{ ' ' }
                                    {
                                        reviewsCount &&
                                        <span>
                                            <span itemProp="ratingCount">{ reviewsCount }</span>
                                            { ' ' }
                                            { reviewsCount === 1 ? 'review' : 'reviews' }
                                        </span>
                                    }
                                </div>
                            </Fragment>
                        ) : 'No ratings yet' }
                </div>
            }
            <div className={ styles.buttonGroup }>
                { isAgency &&
                <ButtonComponent
                    className={ styles.button }
                    onClick={ () => {handleGoToQuery(tabs.OUR_TEAM);} }
                    btnType={ tabs.OUR_TEAM === tab ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.WHITE }
                >
                    Our team
                </ButtonComponent>
                }
                <ButtonComponent
                    className={ styles.button }
                    onClick={ () => {handleGoToQuery(tabs.REVIEW);} }
                    btnType={ tabs.REVIEW === tab ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.WHITE }
                >
                    Reviews
                </ButtonComponent>
                <ButtonComponent
                    className={ classNames(
                        styles.button,
                        styles.desktopHidden,
                    ) }
                    onClick={ () => {handleGoToQuery(tabs.ABOUT);} }
                    btnType={ tabs.ABOUT === tab ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.WHITE }
                >
                    { isAgency ? 'About Us' : 'About Me' }
                </ButtonComponent>
                <ButtonComponent
                    className={ styles.button }
                    onClick={ () => {handleGoToQuery(tabs.PLACEMENTS);} }
                    btnType={ tabs.PLACEMENTS === tab ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.WHITE }
                >
                    Placements
                </ButtonComponent>
            </div>

            { tabs.REVIEW === tab && isAgency &&
            <ReviewsAgencyContainer
                profileInfo={ profile }
                slug={ slug }
                isAgency={ isAgency }
                Component={ ReviewsComponent }
            /> }
            { tabs.REVIEW === tab && !isAgency &&
            <ReviewsRecruiterContainer
                slug={ slug }
                profileInfo={ profile }
                isAgency={ isAgency }
                Component={ ReviewsComponent }
            /> }
            { tabs.PLACEMENTS === tab &&
            <PlacementsContainer
                id={ id }
                isAgency={ isAgency }
                Component={ PlacementsComponent }
            /> }
            { tabs.ABOUT === tab && isAgency &&
            <AboutAgencyContainer
                profileInfo={ profile }
                isAgency={ isAgency }
                Component={ AboutComponent }
                previewParams={ previewParams }
            /> }
            { tabs.ABOUT === tab && !isAgency &&
            <AboutRecruiterContainer
                profileInfo={ profile }
                isAgency={ isAgency }
                Component={ AboutComponent }
                previewParams={ previewParams }
            /> }
            { isAgency && tabs.OUR_TEAM === tab &&
            <OurTeamContainer
                id={ id }
                Component={ OurTeamComponent }
            /> }
        </Fragment>
    );
};

AdditionalInfoComponent.propTypes = {
    handleGoToQuery: PropTypes.func, // passed when React.cloneElement
    tabs: PropTypes.objectOf(PropTypes.string),
    tab: PropTypes.string,
    profileInfo: PropTypes.object, // passed when React.cloneElement
    profile: PropTypes.object, // passed when React.cloneElement
    previewParams: PropTypes.object,
    unclaimed: PropTypes.bool,
    isAgency: PropTypes.bool,
};

export default AdditionalInfoComponent;
