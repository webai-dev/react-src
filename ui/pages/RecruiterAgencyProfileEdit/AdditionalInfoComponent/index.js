import React, { Fragment } from 'react';
import PropTypes           from 'prop-types';
import RatingComponent     from '../../../components/Form/RatingComponent';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                          from '../../../components/ButtonComponent';
import ReviewsComponent                                      from '../ReviewsComponent';
import PlacementsContainer                                   from '../../../containers/PlacementsContainer';
import PlacementsComponent                                   from '../PlacementsComponent';
import OurTeamContainer                                      from '../../../containers/OurTeamContainer';
import OurTeamComponent                                      from '../OurTeamComponent';
import { ReviewsAgencyContainer, ReviewsRecruiterContainer } from '../../../containers/ReviewsContainer';
import { AboutRecruiterContainer, AboutAgencyContainer }     from '../../../containers/AboutContainer';
import AboutComponent                                        from '../AboutComponent';
import classNames                                            from 'classnames';
import styles                                                from './styles.scss';

const AdditionalInfoComponent = (props) => {
    const { handleGoToQuery, tabs, tab, profileInfo, isAgency, profile } = props;
    const { rating, reviewsCount, slug } = profileInfo;

    return (
        <Fragment>
            { rating > 0 &&
            <div className={ styles.ratingBlock }>
                <h2>
                    Overall rating
                </h2>
                <RatingComponent
                    rating={ rating }
                    fixed
                />
                <span>
                    { rating.toFixed(1) }{ ' ' }rating {
                    reviewsCount && `based on ${ reviewsCount } ${ reviewsCount === 1 ? 'review' : 'reviews' }` }
                </span>
            </div> }

            <div className={ styles.buttonGroup }>
                { isAgency &&
                <ButtonComponent
                    onClick={ () => {handleGoToQuery(tabs.OUR_TEAM);} }
                    size={ BUTTON_SIZE.BIG }
                    btnType={ tabs.OUR_TEAM === tab ? BUTTON_TYPE.UNDERLINE : BUTTON_TYPE.LINK_ACCENT }
                >
                    Our team
                </ButtonComponent>
                }
                <ButtonComponent
                    onClick={ () => {handleGoToQuery(tabs.REVIEW);} }
                    size={ BUTTON_SIZE.BIG }
                    btnType={ tabs.REVIEW === tab ? BUTTON_TYPE.UNDERLINE : BUTTON_TYPE.LINK_ACCENT }
                >
                    Reviews
                </ButtonComponent>
                <ButtonComponent
                    className={ classNames(
                        styles.desktopHidden,
                    ) }
                    onClick={ () => {handleGoToQuery(tabs.ABOUT);} }
                    size={ BUTTON_SIZE.BIG }
                    btnType={ tabs.ABOUT === tab ? BUTTON_TYPE.UNDERLINE : BUTTON_TYPE.LINK_ACCENT }
                >
                    { isAgency ? 'About Us' : 'About Me' }
                </ButtonComponent>
                <ButtonComponent
                    onClick={ () => {handleGoToQuery(tabs.PLACEMENTS);} }
                    size={ BUTTON_SIZE.BIG }
                    btnType={ tabs.PLACEMENTS === tab ? BUTTON_TYPE.UNDERLINE : BUTTON_TYPE.LINK_ACCENT }
                >
                    Placements
                </ButtonComponent>
                { /*<ButtonComponent
                 className={ styles.button }
                 onClick={ () => {handleGoToQuery(tabs.BLOG);} }
                 size={ BUTTON_SIZE.BIG }
                 btnType={ tabs.BLOG === tab ? BUTTON_TYPE.UNDERLINE : BUTTON_TYPE.LINK_ACCENT }
                 >
                 Blog
                 </ButtonComponent>*/ }
            </div>
            <Fragment>
                { tabs.REVIEW === tab && isAgency && <ReviewsAgencyContainer
                    profileInfo={ profile }
                    slug={ slug }
                    isAgency={ isAgency }
                    Component={ ReviewsComponent }
                /> }
                { tabs.REVIEW === tab && !isAgency && <ReviewsRecruiterContainer
                    profileInfo={ profile }
                    slug={ slug }
                    isAgency={ isAgency }
                    Component={ ReviewsComponent }
                /> }
                { tabs.PLACEMENTS === tab &&
                <PlacementsContainer
                    isAgency={ isAgency }
                    Component={ PlacementsComponent }
                /> }
                { tabs.ABOUT === tab && isAgency && <AboutAgencyContainer
                    profileInfo={ profile }
                    isAgency={ isAgency }
                    Component={ AboutComponent }
                /> }
                { tabs.ABOUT === tab && !isAgency && <AboutRecruiterContainer
                    profileInfo={ profile }
                    isAgency={ isAgency }
                    Component={ AboutComponent }
                /> }
                { isAgency && tabs.OUR_TEAM === tab &&
                <OurTeamContainer
                    Component={ OurTeamComponent }
                /> }
            </Fragment>
        </Fragment>
    );
};

AdditionalInfoComponent.propTypes = {
    profileInfo: PropTypes.object,
    profile: PropTypes.object,
    handleGoToQuery: PropTypes.func,
    tabs: PropTypes.object,
    tab: PropTypes.string,
    isAgency: PropTypes.bool,
};

export default AdditionalInfoComponent;
