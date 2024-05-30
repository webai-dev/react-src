import React, { Fragment }     from 'react';
import { Helmet }              from 'react-helmet';
import { generatePath }        from 'react-router-dom';
import PropTypes               from 'prop-types';
import { BaseApiHost, ROUTES } from '../../../../constants';
import SearchContainer         from '../../../components/Form/SearchContainer';
import SelectCategoryContainer from '../SelectCategoryContainer';
import PaginationContainer     from '../../../components/PaginationContainer';
import ProfileRowComponent     from '../../../components/ProfileRowComponent';
import ButtonComponent, {
    BUTTON_SIZE,
    BUTTON_TYPE,
}                              from '../../../components/ButtonComponent';
import LoaderComponent         from '../../../components/LoaderComponent';
import AlertComponent          from '../../../components/AlertComponent';
import PromotedComponent       from './PromotedComponent';
import gtmPush, {
    GTM_EVENTS,
    GTM_ACTIONS,
}                              from '../../../../util/gtmPush';
import styles                  from './styles.scss';

const SearchResultComponent = props => {
    const { totalHits, loading, searchResults, totalPages, promotedReviews } = props;

    const searchStatus = loading ? 'Searching for Results' : totalHits ? `${ totalHits } Search Results` : 'No Results';

    const content = loading ?
        <LoaderComponent row /> : searchResults.length === 0 ?
            <AlertComponent>No results</AlertComponent> :
            searchResults.map(({ result, score }) => {
                const isAgency = result.__typename === 'Agency';
                const profileProps = isAgency ?
                    {
                        name: result.name,
                        city: result.city,
                        state: result.state,
                        url: result.photo && result.photo.url,
                        rating: result.rating && result.rating.overallRating,
                        reviewsCount: result.rating && result.rating.reviewsCount,
                    } : {
                        name: `${ result.firstName } ${ result.lastName }`,
                        city: result.city,
                        state: result.state,
                        url: result.profilePhoto && result.profilePhoto.url,
                        rating: result.rating && result.rating.overallRating,
                        reviewsCount: result.rating && result.rating.reviewsCount,
                        recruiterAgency: result.agency,
                    };

                return (
                    <ProfileRowComponent
                        key={ result.id }
                        slug={ result.slug }
                        score={ score }
                        { ...profileProps }
                        isAgency={ isAgency }
                        onProfileSelect={ () => {
                            gtmPush({
                                event: GTM_EVENTS.VIEW_SEARCH_RESULT,
                                action: GTM_ACTIONS.SEARCH,
                                label: result.id,
                            });
                        }
                        }
                    />
                );
            });

    return (
        <Fragment>
            <Helmet>
                <link
                    rel="canonical"
                    href={ BaseApiHost + generatePath(ROUTES.SEARCH) }
                />
            </Helmet>
            <div className={ styles.box }>
                <h2 className={ styles.resultTitle }>{ searchStatus }</h2>
                <SearchContainer
                    label="Search again"
                    name="search"
                    className={ styles.searchBox }
                    onSearch={ (search) => {
                        gtmPush({
                            event: GTM_EVENTS.SEARCH,
                            action: GTM_ACTIONS.SEARCH,
                            label: search,
                        });
                    } }
                />
                <SelectCategoryContainer />
                <AlertComponent>
                    Cannot find your profile? Click{ ' ' }
                    <ButtonComponent
                        to="mailto:support@sourcr.com?subject=RE: Cannot find profile"
                        size={ BUTTON_SIZE.SMALL }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                    >
                        here{ ' ' }
                    </ButtonComponent>
                    to get in touch with support
                </AlertComponent>
                { content }
                { totalPages > 1 && !loading && <PaginationContainer
                    totalPages={ totalPages }
                    isScrollToTop
                /> }
            </div>
            { !!promotedReviews?.length && <PromotedComponent
                promotedReviews={ promotedReviews }
                draggable
                id="reviewPromotions"
            /> }
        </Fragment>
    );
};

SearchResultComponent.propTypes = {
    searchResults: PropTypes.array,
    loading: PropTypes.bool,
    totalHits: PropTypes.number,
    totalPages: PropTypes.number,
    promotedReviews: PropTypes.arrayOf(PropTypes.object),
};

export default SearchResultComponent;
