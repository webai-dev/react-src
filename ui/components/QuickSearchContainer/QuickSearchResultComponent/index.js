import React, { Fragment }     from 'react';
import PropTypes               from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                              from '../../ButtonComponent';
import { ProfileRowComponent } from '../../ProfileRowComponent';
import LoaderComponent         from '../../LoaderComponent';
import ErrorComponent          from '../../ErrorComponent';
import {
    ROUTES,
    BaseAPiPath,
}                              from '../../../../constants';
import styles                  from './styles.scss';

const QuickSearchResultComponent = (props) => {
    const { error, loading, agencies, agenciesCount, recruiters, recruitersCount, search } = props;
    if (error) {
        return <ErrorComponent error={ error } />;
    }
    if (loading) {
        return <LoaderComponent row />;
    }
    return (
        <Fragment>
            <div className={ styles.resultHeader }>
                <span className={ styles.accent }>
                    Recruiters
                </span>
                { recruitersCount ?
                    <div className={ styles.resultInfo }>
                    <span className={ styles.resultTotal }>
                        { recruitersCount } results
                    </span>
                        <ButtonComponent
                            className={ styles.resultSeeAll }
                            size={ BUTTON_SIZE.SMALL }
                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                            to={ `${ BaseAPiPath }${ ROUTES.SEARCH }?search=${ search }&type=recruiter&page=1` }
                        >
                            See all
                        </ButtonComponent>
                    </div> :
                    <div className={ styles.resultInfo }>
                    <span className={ styles.resultTotal }>
                        No results
                    </span>
                    </div> }
            </div>
            {
                !!recruitersCount && recruiters.map(recruiter => {
                    const params = {
                        name: `${ recruiter.firstName } ${ recruiter.lastName }`,
                        city: recruiter.city,
                        state: recruiter.state,
                        url: recruiter.profilePhoto && recruiter.profilePhoto.url,
                        recruiterAgency: recruiter.agency,
                        slug: recruiter.slug,
                        isEmbeded: true,
                    };
                    return <ProfileRowComponent key={ recruiter.id } { ...params } />;
                })
            }
            <div className={ styles.resultHeader }>
                <span className={ styles.accent }>
                    Agencies
                </span>
                { agenciesCount ?
                    <div className={ styles.resultInfo }>
                    <span className={ styles.resultTotal }>
                        { agenciesCount } results
                    </span>
                        <ButtonComponent
                            className={ styles.resultSeeAll }
                            size={ BUTTON_SIZE.SMALL }
                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                            to={ `${ BaseAPiPath }${ ROUTES.SEARCH }?search=${ search }&type=agency&page=1` }
                        >
                            See all
                        </ButtonComponent>
                    </div> :
                    <div className={ styles.resultInfo }>
                    <span className={ styles.resultTotal }>
                        No results
                    </span>
                    </div> }
            </div>
            {
                !!agenciesCount && agencies.map(agency => (
                    <ProfileRowComponent
                        isAgency
                        isEmbeded
                        name={ agency.name }
                        url={ agency.photo && agency.photo.url }
                        slug={ agency.slug }
                        key={ agency.id }
                        city={ agency.city }
                        state={ agency.state }
                        rating={ agency.rating && agency.rating.overallRating }
                        reviewsCount={ agency.rating && agency.rating.reviewsCount }
                    />
                ))
            }
        </Fragment>
    );
};

QuickSearchResultComponent.propTypes = {
    loading: PropTypes.bool,
    search: PropTypes.string,
    error: PropTypes.object,
    agencies: PropTypes.arrayOf(PropTypes.object),
    recruiters: PropTypes.arrayOf(PropTypes.object),
    recruitersCount: PropTypes.number,
    agenciesCount: PropTypes.number,
};

export default QuickSearchResultComponent;
