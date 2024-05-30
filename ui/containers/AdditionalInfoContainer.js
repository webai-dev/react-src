import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { withRouter }           from 'react-router-dom';
import getQueryParams           from '../../util/getQueryParams';
import getQueryString           from '../../util/getQueryString';
import {
    graphql,
    createFragmentContainer,
} from 'react-relay';

class AdditionalInfoContainer extends PureComponent {
    static TAB_KEY = 'tab';
    static TABS = {
        REVIEW: 'review',
        ABOUT: 'about',
        PLACEMENTS: 'placements',
        BLOG: 'blog',
    };
    static AGENCY_TABS = {
        REVIEW: 'review',
        ABOUT: 'about',
        PLACEMENTS: 'placements',
        BLOG: 'blog',
        OUR_TEAM: 'our_team'
    };

    /**
     * Handle location change based on query
     *
     * @param {string} query
     */
    handleGoToQuery = (query) => {
        const queryParams = getQueryParams(this.props.location.search);
        queryParams[ AdditionalInfoContainer.TAB_KEY ] = query;
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: getQueryString(queryParams),
        });
    };

    render() {
        const { slug, isAgency, children, previewParams, profileData } = this.props;
        const { handleGoToQuery } = this;
        const { TAB_KEY, TABS, AGENCY_TABS } = AdditionalInfoContainer;
        const currentTab = getQueryParams(this.props.location.search)[ TAB_KEY ] || TABS.REVIEW;

        const { sluggable, viewer } = profileData;
        const profile = (
            slug ? sluggable :
                isAgency ?
                    (viewer && viewer.profile && viewer.profile.agency) :
                    (viewer && viewer.profile)
        );

        if (!profile) {
            return null;
        }
        const profileInfo = {
            id: profile.id,
            slug: profile.slug,
            rating: profile.rating && profile.rating.overallRating,
            reviewsCount: profile.rating && profile.rating.reviewsCount,
            backgroundUrl: profile.backgroundImage && profile.backgroundImage.url,
            agencyBackgroundUrl: profile.agency?.backgroundImage?.url
        };

        const profileInfoToShow = previewParams ? {
            ...profileInfo,
            ...previewParams,
        } : profileInfo;

        const unclaimed = profile && !profile.claimed && !previewParams;

        const childrenWithProps = React.Children.map(children, child =>
            React.cloneElement(child, {
                handleGoToQuery:handleGoToQuery,
                isAgency:isAgency,
                tabs:isAgency ? AGENCY_TABS : TABS,
                tab:currentTab,
                profileInfo:profileInfoToShow,
                unclaimed:unclaimed,
                previewParams:previewParams,
                slug:slug,
                profile:profile,
            })
        );

        return <div>{ childrenWithProps }</div>;
    }
}

AdditionalInfoContainer.propTypes = {
    slug: PropTypes.string, // if not provided will fetch info for current user
    isAgency: PropTypes.bool,
    location: PropTypes.object,
    profileData: PropTypes.object,
    history: PropTypes.object,
    previewParams: PropTypes.object, // Preview info from edit page
    children: PropTypes.node.isRequired,
};

export const AdditionalInfoRecruiterContainer = withRouter(createFragmentContainer(
    AdditionalInfoContainer,
    graphql`
        fragment AdditionalInfoContainerRecruiter_profileData on Query @argumentDefinitions(
            slug: {type: "String!"}, type: {type: "String!"} self: {type: "Boolean!"}, other: {type: "Boolean!"}
        ) {
            viewer @include(if: $self) {
                profile: user {
                    ... on Recruiter {
                        slug
                        agency {
                            slug
                            name
                            backgroundImage {
                                url
                            }
                        }
                        rating {
                            overallRating
                            reviewsCount
                        }
                        backgroundImage {
                            url
                        }
                        ...AboutContainerRecruiter_profileInfo
                        ...ReviewsContainerRecruiter_profileInfo
                    }
                }
            }
            sluggable(slug: $slug, type: $type) @include(if: $other) {
                ... on Recruiter {
                    id
                    claimed
                    slug
                    agency {
                        name
                        backgroundImage {
                            url
                        }
                    }
                    rating {
                        overallRating
                        reviewsCount
                    }
                    backgroundImage {
                        url
                    }
                    ...AboutContainerRecruiter_profileInfo
                    ...ReviewsContainerRecruiter_profileInfo
                }
            }
        }
    `,
));

export const AdditionalInfoAgencyContainer = withRouter(createFragmentContainer(
    AdditionalInfoContainer,
    graphql`
        fragment AdditionalInfoContainerAgency_profileData on Query @argumentDefinitions(
            slug: {type: "String!"}, type: {type: "String!"} self: {type: "Boolean!"}, other: {type: "Boolean!"}
        ) {
            viewer @include(if: $self) {
                profile: user {
                    ... on Recruiter {
                        slug
                        agency {
                            slug
                            name
                            rating {
                                overallRating
                                reviewsCount
                            }
                            backgroundImage {
                                url
                            }
                            ...AboutContainerAgency_profileInfo
                            ...ReviewsContainerAgency_profileInfo
                        }
                    }
                }
            }
            sluggable(slug: $slug, type: $type) @include(if: $other) {
                ... on Agency {
                    id
                    claimed
                    slug
                    rating {
                        overallRating
                        reviewsCount
                    }
                    backgroundImage {
                        url
                    }
                    ...AboutContainerAgency_profileInfo
                    ...ReviewsContainerAgency_profileInfo
                }
            }
        }
    `,
));
