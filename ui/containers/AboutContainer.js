import React           from 'react';
import PropTypes       from 'prop-types';
import {
    graphql,
    createFragmentContainer
} from 'react-relay';

const AboutContainer = (props) => {
    const { isAgency, Component, previewParams, profileInfo } = props;

    const profileToShow = { ...profileInfo, ...previewParams };
    return (
        <Component profileInfo={ profileToShow } isAgency={ isAgency } />
    );
};

AboutContainer.propTypes = {
    profileInfo: PropTypes.object.isRequired,
    isAgency: PropTypes.bool,
    Component: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]).isRequired,
    previewParams: PropTypes.object, // Preview info from edit page
};

export const AboutRecruiterContainer = createFragmentContainer(
    AboutContainer,
    graphql`
        fragment AboutContainerRecruiter_profileInfo on Recruiter {
            about: aboutMe
            videoUrl
        }
    `
);

export const AboutAgencyContainer = createFragmentContainer(
    AboutContainer,
    graphql`
        fragment AboutContainerAgency_profileInfo on Agency {
            about: aboutUs
            videoUrl
        }
    `
);

