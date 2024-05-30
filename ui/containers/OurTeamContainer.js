import React                from 'react';
import PropTypes            from 'prop-types';
import LoaderComponent      from '../components/LoaderComponent';
import ErrorComponent       from '../components/ErrorComponent';
import {
    graphql,
    QueryRenderer,
} from 'react-relay';
import { environment }   from '../../api';

const ABOUT_ME_QUERY_FOR_SELF = graphql`
    query OurTeamContainerSelfQuery {
        viewer {
            profile: user {
                ... on Recruiter {
                    agency {
                        id
                        slug
                        recruiters {
                            id
                            slug
                            agency {
                                name
                                slug
                            }
                            profilePhoto {
                                url
                            }
                            firstName
                            lastName
                            city
                            state
                            specialisations {
                                name
                            }
                            rating {
                                overallRating
                                reviewsCount
                            }
                        }
                    }
                }
            }
        }
    }
`;
const ABOUT_ME_QUERY = graphql`
    query OurTeamContainerQuery($id: ID!) {
        node(id: $id) {
            ... on Agency {
                id
                recruiters {
                    id
                    slug
                    profilePhoto {
                        url
                    }
                    firstName
                    lastName
                    city
                    state
                    rating {
                        overallRating
                        reviewsCount
                    }
                    agency {
                        slug
                        name
                    }
                }
            }
        }
    }
`;

const AboutMeContainer = (props) => {
    const { id, Component } = props;
    return (
        <QueryRenderer
            environment={ environment }
            query={ id ? ABOUT_ME_QUERY : ABOUT_ME_QUERY_FOR_SELF }
            variables={ { id } }
            render={
                ({ error, props: data }) => {
                    if (error) {
                        return <ErrorComponent error={ error }/>;
                    }
                    if (!data && !error) {
                        return <LoaderComponent row/>;
                    }

                    const { node, viewer } = data;
                    const profile = node || (viewer && viewer.profile && viewer.profile.agency) || {};

                    return (
                        <Component recruiters={ profile.recruiters || [] }/>
                    );
                }
            }
        />
    );
};

AboutMeContainer.propTypes = {
    id: PropTypes.string,
    Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
};

export default AboutMeContainer;
