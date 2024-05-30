import React                        from 'react';
import PropTypes                    from 'prop-types';
import {
    graphql,
    QueryRenderer,
}                                   from 'react-relay';
import { generatePath, withRouter } from 'react-router-dom';
import WidgetComponent              from './WidgetComponent';
import { environment }              from '../../../api';
import {
    ROUTES,
    PARAM_SLUG,
    WIDGET_THEME,
    BaseApiHost,
}                                   from '../../../constants';
import ErrorComponent               from '../../components/ErrorComponent';
import LoaderComponent              from '../../components/LoaderComponent';

const WIDGET_QUERY = graphql`
    query WidgetContainerQuery(
        $slug: String!,
        $ids: [ID!]!,
        $isSelection: Boolean!,
        $isLast: Boolean!,
        $type: String!,
    ) {
        sluggable(slug: $slug, type: $type) {
            ...on Agency {
                rating {
                    overallRating
                    reviewsCount
                    lastRatings: ratings @include(if: $isLast) {
                        title
                        overallRating
                        review
                        firstName
                        lastName
                        isEmployer: responsiveness
                        placement {
                            companyName
                        }
                    }
                }
            }
            ...on Recruiter {
                rating {
                    overallRating
                    reviewsCount
                    lastRatings: ratings @include(if: $isLast) {
                        title
                        overallRating
                        review
                        firstName
                        lastName
                        isEmployer: responsiveness
                        placement {
                            companyName
                        }
                    }
                }
            }
        }
        nodes(ids: $ids) @include(if: $isSelection) {
            ...on Rating {
                title
                overallRating
                review
                firstName
                lastName
                isEmployer: responsiveness
                placement {
                    companyName
                }
            }
        }
    }
`;

const WidgetContainer = (props) => {
    const { theme, slug, className, type, isApp, ids, isFreelancer } = props;

    const isDarkTheme = WIDGET_THEME.DARK === theme;
    const isSelection = !!(ids && ids.length > 0);

    return (
        <QueryRenderer
            key={ isSelection }
            environment={ environment }
            query={ WIDGET_QUERY }
            variables={ {
                slug,
                ids: isSelection ? ids : [ 'null' ], // ['null'] fix relay error
                isSelection,
                isLast: !isSelection,
                type: isFreelancer ? 'recruiter' : 'agency'
            } }
            render={ ({ error, props: data }) => {
                const loading = !error && !data;

                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                if (loading) {
                    return <LoaderComponent row />;
                }
                const reviewsCount = data.sluggable.rating?.reviewsCount;
                const overallRating = data.sluggable.rating?.overallRating;
                let reviews = isSelection ? data.nodes : data.sluggable.rating?.lastRatings?.slice(0, 3);

                const pathToAllReviews = `${ BaseApiHost }${ generatePath(
                    ROUTES.AGENCY_PROFILE,
                    { [ PARAM_SLUG ]: slug },
                ) }`;
                return (
                    <WidgetComponent
                        slug={ slug }
                        isApp={ isApp }
                        type={ type }
                        isDarkTheme={ isDarkTheme }
                        className={ className }
                        pathToAllReviews={ pathToAllReviews }
                        reviewsCount={ reviewsCount }
                        overallRating={ overallRating }
                        reviews={ reviews }
                    />
                );
            } }
        />
    );
};

WidgetContainer.propTypes = {
    className: PropTypes.string,
    theme: PropTypes.string,
    slug: PropTypes.string.isRequired,
    type: PropTypes.string,
    ids: PropTypes.array, // review ids
    isApp: PropTypes.bool,
    isFreelancer: PropTypes.bool,
};

export default withRouter(WidgetContainer);
