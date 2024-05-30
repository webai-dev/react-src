import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    generatePath,
    withRouter,
}                      from 'react-router-dom';
import LocationIcon    from '../../../assets/icons/LocationIcon';
import {
    ROUTES,
    PARAM_SLUG,
    BaseApiHost, KEYS,
}                      from '../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                      from '../../components/ButtonComponent';
import AvatarComponent from '../AvatarComponent';
import RatingComponent from '../Form/RatingComponent';
import BadgeComponent  from '../BadgeComponent';
import classNames      from 'classnames';
import styles          from './styles.scss';

export class ProfileRowComponent extends PureComponent {
    constructor(props) {
        super(props);

        const path = props.isAgency ?
            generatePath(
                ROUTES.AGENCY_PROFILE,
                { [ PARAM_SLUG ]: props.slug },
            ) :
            generatePath(
                ROUTES.RECRUITER_PROFILE,
                {
                    [ PARAM_SLUG ]: props.slug,
                },
            );
        const itemPath = props.isEmbeded ? `${ BaseApiHost }${ path }` : path;
        this.state = {
            itemPath
        };
    }

    /**
     * Change location to selected location
     *
     * @param {string} location
     */
    changeLocation = (location) => {
        if (this.props.onProfileSelect) {
            this.props.onProfileSelect();
        }
        window.open(`${ BaseApiHost }${ location }`, '_blank');
    };

    /**
     * Change location on Enter press
     *
     * @param {ReactEvent} event
     */
    handleOpenModalOnKeyPress = (event) => {
        event.preventDefault();
        if (event.key === KEYS.ENTER) {
            this.changeLocation(this.state.itemPath);
        }
    };

    render() {
        const {
            isInnerApp,
            name,
            city,
            state,
            url,
            rating,
            info,
            noUnderline,
            className,
            score,
            reviewsCount,
            specialisations,
            isEmbeded = false,
            recruiterAgency,
        } = this.props;
        const { changeLocation, handleOpenModalOnKeyPress } = this;
        const { itemPath } = this.state;

        const agencyPath = recruiterAgency ? generatePath(
            ROUTES.AGENCY_PROFILE,
            { [ PARAM_SLUG ]: recruiterAgency.slug },
        ) : null;

        return (
            <div
                className={ classNames(
                    className,
                    styles.profile,
                    {
                        [ styles.profileNoUnderline ]: noUnderline,
                        [ styles.profileCompanyEdit ]: isInnerApp,
                    },
                ) }
                tabIndex="0"
                onClick={
                    () => { changeLocation(itemPath);}
                }
                onKeyPress={ handleOpenModalOnKeyPress }
            >
                <AvatarComponent
                    isEmbeded={ isEmbeded }
                    url={ url }
                    alt={ `${ name } avatar` }
                    className={ styles.avatar }
                />
                <div className={ styles.infoBox }>
                    <div className={ styles.mainInfoBox }>
                        <div className={ styles.titleBox }>
                            { isEmbeded ?
                                <ButtonComponent
                                    stopPropagation
                                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                                    size={ BUTTON_SIZE.SMALL }
                                    to={ itemPath }
                                    className={ classNames(
                                        styles.name,
                                        styles.header,
                                    ) }
                                    target="_blank"
                                >
                                    { name }
                                </ButtonComponent> :
                                <h3 className={ styles.name }>
                                    <ButtonComponent
                                        stopPropagation
                                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                                        size={ BUTTON_SIZE.SMALL }
                                        to={ itemPath }
                                        target="_blank"
                                    >
                                        { name }
                                    </ButtonComponent>
                                </h3>
                            }
                            { score && (
                                <BadgeComponent className={ styles.score }>
                                    { score }
                                </BadgeComponent>
                            ) }
                            {
                                (rating <= 0 && <div className={ styles.rating }>No ratings yet</div>) ||
                                rating > 0 && <div className={ styles.rating }>
                                    <RatingComponent
                                        fixed
                                        small
                                        rating={ rating }
                                    />
                                    { rating.toFixed(1) }&nbsp;
                                    { reviewsCount && <span>({ reviewsCount })</span> }
                                </div>
                            }
                        </div>
                        { info && <div className={ styles.info }>
                            { info }
                        </div> }
                        { isInnerApp ?
                            specialisations && !!specialisations.length &&
                            <div className={ styles.specialisation }>
                                { specialisations.map((specialisation, index) => (
                                    <span key={ specialisation.name }>
                                    { `${ specialisation.name }${ index + 1 === specialisations.length ? '' : ', ' }` }
                                </span>
                                )) }
                            </div> :
                            (state || city || recruiterAgency) &&
                            <div className={ styles.location }>
                                {
                                    recruiterAgency &&
                                    <ButtonComponent
                                        className={ styles.agencyLink }
                                        stopPropagation
                                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                                        size={ BUTTON_SIZE.SMALL }
                                        to={ isEmbeded ? `${ BaseApiHost }${ agencyPath }` : agencyPath }
                                        target="_blank"
                                    >
                                        { recruiterAgency.name }{ ' ' }
                                    </ButtonComponent>
                                }
                                { (state || city) && <span className={ styles.locationInfo }>
                                    <LocationIcon />&nbsp;
                                    { `(${ city }, ${ state })` }
                                </span> }
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

ProfileRowComponent.propTypes = {
    name: PropTypes.string.isRequired,
    city: PropTypes.string,
    state: PropTypes.string,
    className: PropTypes.string,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string,
    rating: PropTypes.number,
    info: PropTypes.string,
    noUnderline: PropTypes.bool,
    isAgency: PropTypes.bool,
    isInnerApp: PropTypes.bool,
    score: PropTypes.number,
    reviewsCount: PropTypes.number,
    specialisations: PropTypes.array,
    isEmbeded: PropTypes.bool,
    recruiterAgency: PropTypes.object,
    onProfileSelect: PropTypes.func,
};

export default withRouter(ProfileRowComponent);
