import React, { Fragment } from 'react';
import PropTypes           from 'prop-types';
import ErrorComponent      from '../components/ErrorComponent';
import { IDS }             from '../../constants';
import {
    graphql,
    createFragmentContainer,
}                          from 'react-relay';

const MainInfoContainer = (props) => {
    const { slug, isAgency, children, previewParams, profileData, hash } = props;
    const { sluggable, viewer } = profileData;
    const profile = (
        slug ? sluggable :
            isAgency ?
                (viewer && viewer.profile && viewer.profile.agency) :
                (viewer && viewer.profile)
    );

    if (!profile) {
        return <ErrorComponent
            error={ `such ${ isAgency ? 'agency' : 'recruiter' } doesn't exist` }
            onlyMessage
        />;
    }

    const profileInfo = {
        id: profile.id,
        email: profile.email,
        slug: profile.slug,
        backgroundColor: profile.backgroundColor,
        backgroundUrl: profile.backgroundImage?.url,
        contactNumber: profile.contactNumber,
        roleTypes: profile.roleTypes,
        linkedinUrl: profile.linkedinUrl,
        facebookUrl: profile.facebookUrl,
        twitterUrl: profile.twitterUrl,
        specialisations: profile.specialisations,
        avatarUrl: profile.photo?.url,
        city: profile.city,
        state: profile.state,
        country: profile.country || 'AU',
        postcode: profile.postcode,
        suburb: profile.suburb,
        reviewsCount: profile.rating?.reviewsCount,
    };
    if (isAgency) {
        profileInfo.name = profile.name;
    } else {
        profileInfo.jobTitle = profile.jobTitle;
        profileInfo.name = `${ profile.firstName } ${ profile.lastName }`;
        profileInfo.isFavourite = profile.recruiterRelationship?.isFavourite;
        profileInfo.agency = profile.agency;
        profileInfo.agencyBackgroundUrl = profile.agency?.backgroundImage?.url;
    }
    const unclaimed = profile && !profile.claimed && !previewParams;

    const backgroundElement = window.document.getElementById(IDS.BACKGROUND_IMAGE);

    const profileInfoToShow = previewParams ? {
        ...profileInfo,
        ...previewParams,
    } : profileInfo;

    if (backgroundElement && profileInfoToShow.backgroundColor) {

        backgroundElement.style.cssText = `background-color: ${ profileInfoToShow.backgroundColor }`;
    }

    const childrenWithProps = React.Children.map(children, child =>
        React.cloneElement(child, {
            hash: hash,
            profileInfo: profileInfoToShow,
            profile: profile,
            unclaimed: unclaimed,
            isAgency: isAgency,
            slug: slug,
            previewParams: previewParams,
            jobCategories: viewer && viewer.jobCategories,
        })
    );

    return <Fragment>{ childrenWithProps }</Fragment>;
};

MainInfoContainer.propTypes = {
    slug: PropTypes.string, // if not provided will fetch info for current user
    isAgency: PropTypes.bool,
    profileData: PropTypes.object.isRequired,
    previewParams: PropTypes.object, // Preview info from edit page
    children: PropTypes.node.isRequired,
    hash: PropTypes.string,
};

export const MainInfoRecruiterContainer = createFragmentContainer(
    MainInfoContainer,
    graphql`
        fragment MainInfoContainerRecruiter_profileData on Query @argumentDefinitions(
            slug: {type: "String!"}, type: {type: "String!"} self: {type: "Boolean!"}, other: {type: "Boolean!"}
        ) {
            viewer {
                jobCategories{
                    id
                    name
                }
                profile: user @include(if: $self) {
                    ... on Recruiter {
                        id
                        email
                        slug
                        claimed
                        jobTitle
                        firstName
                        lastName
                        city
                        state
                        country
                        contactNumber
                        linkedinUrl
                        roleTypes
                        postcode
                        suburb
                        backgroundColor
                        recruiterRelationship {
                            isFavourite
                        }
                        specialisations {
                            id
                            name
                        }
                        backgroundImage {
                            url
                        }
                        photo: profilePhoto {
                            url
                        }
                        rating {
                            reviewsCount
                        }
                        agency {
                            id
                            slug
                            name
                            backgroundImage {
                                url
                            }
                        }
                        ...AboutContainerRecruiter_profileInfo
                    }
                }
            }
            sluggable(slug: $slug, type: $type) @include(if: $other) {
                ... on Recruiter {
                    id
                    slug
                    claimed
                    firstName
                    lastName
                    jobTitle
                    city
                    state
                    country
                    contactNumber
                    linkedinUrl
                    roleTypes
                    postcode
                    suburb
                    backgroundColor
                    specialisations {
                        id
                        name
                    }
                    backgroundImage {
                        url
                    }
                    photo: profilePhoto {
                        url
                    }
                    rating {
                        reviewsCount
                    }
                    agency {
                        id
                        slug
                        name
                        backgroundImage {
                            url
                        }
                    }
                    ...AboutContainerRecruiter_profileInfo
                }
            }
        }
    `,
);

export const MainInfoAgencyContainer = createFragmentContainer(
    MainInfoContainer,
    graphql`
        fragment MainInfoContainerAgency_profileData on Query @argumentDefinitions(
            slug: {type: "String!"}, type: {type: "String!"} self: {type: "Boolean!"}, other: {type: "Boolean!"}
        ) {
            viewer{
                jobCategories{
                    id
                    name
                }
                profile: user @include(if: $self) {
                    ... on Recruiter {
                        jobTitle
                        firstName
                        lastName
                        roleTypes
                        agency {
                            id
                            slug
                            name
                            claimed
                            city
                            state
                            email
                            country
                            contactNumber
                            linkedinUrl: linkedInUrl
                            twitterUrl
                            facebookUrl
                            roleTypes
                            postcode
                            suburb
                            backgroundColor
                            specialisations {
                                id
                                name
                            }
                            backgroundImage {
                                url
                            }
                            photo {
                                url
                            }
                            rating {
                                reviewsCount
                            }
                            ...AboutContainerAgency_profileInfo
                        }
                    }
                }
            }
            sluggable(slug: $slug, type: $type) @include(if: $other) {
                ... on Agency {
                    id
                    slug
                    claimed
                    name
                    city
                    state
                    country
                    contactNumber
                    linkedinUrl: linkedInUrl
                    twitterUrl
                    facebookUrl
                    roleTypes
                    postcode
                    suburb
                    backgroundColor
                    specialisations {
                        id
                        name
                    }
                    backgroundImage {
                        url
                    }
                    photo {
                        url
                    }
                    rating {
                        reviewsCount
                    }
                    ...AboutContainerAgency_profileInfo
                }
            }
        }
    `,
);
