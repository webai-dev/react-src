import React, { Fragment, useState }                     from 'react';
import PropTypes                                         from 'prop-types';
import { generatePath }                                  from 'react-router-dom';
import { Helmet }                                        from 'react-helmet';
import { ROUTES, PARAM_SLUG, BaseApiHost, STAGE_URL }    from '../../../../constants';
import gtmPush, { GTM_EVENTS }                           from '../../../../util/gtmPush';
import { AboutRecruiterContainer, AboutAgencyContainer } from '../../../containers/AboutContainer';
import AvatarComponent                                   from '../../../components/AvatarComponent';
import AddToFavoriteContainer                            from '../../../components/AddToFavoriteContainer';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE }     from '../../../components/ButtonComponent';
import LinkedInIcon                                      from '../../../../assets/icons/LinkedInIcon';
import FacebookIcon                                      from '../../../../assets/icons/FacebookIcon';
import TwitterIcon                                       from '../../../../assets/icons/TwitterIcon';
import PhoneIcon                                         from '../../../../assets/icons/PhoneIcon';
import EmailContainer                                    from '../EmailContainer';
import AboutComponent                                    from '../AboutComponent';
import classNames                                        from 'classnames';
import styles                                            from './styles.scss';

const MainInfoComponent = props => {
        const { profileInfo, unclaimed, isAgency, previewParams, profile } = props;
        const {
            id,
            avatarUrl,
            name,
            jobTitle,
            contactNumber,
            email,
            linkedinUrl,
            facebookUrl,
            twitterUrl,
            specialisations,
            agency,
            reviewsCount,
            city,
            state,
            country,
            postcode
        } = profileInfo;
        const [ isPhoneVisible, setPhoneVisibility ] = useState(false);
        const routeToRecruiterProfile = generatePath(
            isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
            { [ PARAM_SLUG ]: profile.slug }
        );

        const backgroundUrl = profileInfo.backgroundUrl || profileInfo.agencyBackgroundUrl;
        const fullUrl = backgroundUrl && (
            (process.env.NODE_ENV !== 'development') ?
                backgroundUrl :
                backgroundUrl.includes('data:') ?
                    backgroundUrl :
                    `${ STAGE_URL }${ backgroundUrl }`);

        let contactNumberHidden = contactNumber;
        if (contactNumber) {
            const visibleCount = contactNumber.length >= 10 ? 4 : Math.floor(contactNumber.length / 2);
            const lastChars = contactNumber.slice(-visibleCount);
            const hiddenCount = contactNumber.length - visibleCount;
            contactNumberHidden = '*'.repeat(hiddenCount) + lastChars;
        }

        return (
            <Fragment>
                <Helmet>
                    <title>{ isAgency ? `Read ${ name }‘s Reviews | Recruitment Agency - ${ city }` :
                        `${ name }’s Reviews | Recruiter - ${ city }` }</title>
                    <meta
                        name="Description"
                        content={
                            isAgency ? `${ name } is a Recruitment Agency in ${ city } and has ${ reviewsCount
                                    } client & candidate reviews. View placement history and reviews on Sourcr.` :
                                `${ name } is a Recruiter in ${ city } and has ${ reviewsCount
                                    } client & candidate reviews. View recruiter placement history and reviews on Sourcr.`
                        }
                    />
                    <link
                        rel="canonical"
                        href={ BaseApiHost + routeToRecruiterProfile }
                    />
                </Helmet>
                <AvatarComponent
                    className={ styles.avatar }
                    url={ avatarUrl }
                    alt="Background Image"
                    itemProp="image"
                />
                { fullUrl && <img
                    src={ fullUrl }
                    alt={ `${ name } banner` }
                    className={ styles.background }
                /> }
                <div className={ styles.block }>
                    <h2
                        className={ styles.header }
                        itemProp="name"
                    >
                        <ButtonComponent
                            itemProp="url"
                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                            size={ BUTTON_SIZE.SMALL }
                            to={ routeToRecruiterProfile }
                        >
                            { name }
                        </ButtonComponent>
                    </h2>
                    { !isAgency &&
                    <AddToFavoriteContainer
                        text="(add to shortlist)"
                        id={ id }
                    />
                    }
                </div>
                <div className={ styles.block }>
                    { (jobTitle || agency) && (
                        <span>
                        { jobTitle && <span className={ styles.accent }>
                            { jobTitle }
                        </span> }
                            { (jobTitle && agency) && <span>{ ' ' }at{ ' ' }</span> }
                            { agency && <span itemProp="brand"><ButtonComponent
                                btnType={ BUTTON_TYPE.LINK_ACCENT }
                                size={ BUTTON_SIZE.SMALL }
                                to={ generatePath(ROUTES.AGENCY_PROFILE, { [ PARAM_SLUG ]: agency.slug }) }
                            >
                            { agency.name }
                        </ButtonComponent></span> }
                    </span>

                    ) }
                    { (city || state || country || postcode) && <span
                        itemProp="address"
                        itemScope
                        itemType="https://schema.org/PostalAddress"
                    >
                    { city && <span itemProp="addressLocality">{ city }</span> }
                        { state && ', ' }
                        { state && <span itemProp="addressRegion">{ state }</span> }
                        { country && <span
                            itemProp="areaServed"
                            hidden
                        >{ country }</span> }
                        { country && ' ' }
                        { postcode && <span itemProp="postalCode">{ postcode }</span> }
                        { postcode && ' ' }
                </span> }
                    <span
                        itemProp="priceRange"
                        hidden
                    >
                    Contact Agency
                </span>
                    { !unclaimed && (
                        <Fragment>
                            { contactNumber &&
                            <span
                                className={ styles.phoneBox }
                            >
                            <PhoneIcon />
                            <span>{ isPhoneVisible ? contactNumber : contactNumberHidden }</span>
                            <span
                                itemProp="telephone"
                                hidden
                            >{ contactNumber }</span>
                        </span> }
                            { !isPhoneVisible && contactNumber &&
                            <ButtonComponent
                                btnType={ BUTTON_TYPE.LINK_ACCENT }
                                size={ BUTTON_SIZE.SMALL }
                                onClick={ () => {
                                    setPhoneVisibility(true);
                                    gtmPush({
                                        event: GTM_EVENTS.REVEAL_PHONE,
                                        label: id
                                    });
                                } }
                            >
                                Show number
                            </ButtonComponent> }
                            { !unclaimed && <EmailContainer
                                slug={ profile.slug }
                                isAgency={ isAgency }
                                email={ email }
                                name={ name }
                                id={ id }
                            /> }
                            { (linkedinUrl || facebookUrl || twitterUrl) && (
                                <div className={ styles.socialIcons }>
                                    { linkedinUrl && linkedinUrl && <ButtonComponent
                                        ariaLabel="LinkedIn account"
                                        btnType={ BUTTON_TYPE.ICON }
                                        to={ linkedinUrl }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <LinkedInIcon />
                                    </ButtonComponent>
                                    }
                                    { isAgency && facebookUrl && <ButtonComponent
                                        ariaLabel="Facebook account"
                                        btnType={ BUTTON_TYPE.ICON }
                                        to={ facebookUrl }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FacebookIcon />
                                    </ButtonComponent> }
                                    { isAgency && twitterUrl && <ButtonComponent
                                        ariaLabel="Twitter account"
                                        btnType={ BUTTON_TYPE.ICON }
                                        to={ twitterUrl }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <TwitterIcon />
                                    </ButtonComponent> }
                                </div>
                            ) }
                        </Fragment>
                    ) }
                </div>
                { !unclaimed && (
                    <Fragment>
                        { specialisations && specialisations.length > 0 && <div className={ styles.block }>
                            <h3>Markets</h3>
                            <span>{ specialisations.map(it => it.name || it)
                                .join(', ') }</span>
                        </div> }
                        <div
                            className={ classNames(
                                styles.block,
                                styles.hiddenMobile,
                            ) }
                        >
                            { isAgency ?
                                <AboutAgencyContainer
                                    profileInfo={ profile }
                                    isAgency={ isAgency }
                                    Component={ AboutComponent }
                                    previewParams={ previewParams }
                                /> :
                                <AboutRecruiterContainer
                                    profileInfo={ profile }
                                    isAgency={ isAgency }
                                    Component={ AboutComponent }
                                    previewParams={ previewParams }
                                />
                            }
                        </div>
                    </Fragment>
                ) }
            </Fragment>
        );
    }
;

MainInfoComponent.propTypes = {
    profile: PropTypes.object, // passed when React.cloneElement
    profileInfo: PropTypes.object, //  passed when React.cloneElement profileInfo about recruiter OR Agency
    previewParams: PropTypes.object,
    unclaimed: PropTypes.bool,
    isAgency: PropTypes.bool,
};

export default MainInfoComponent;
