import React                from 'react';
import PropTypes            from 'prop-types';
import LoaderComponent      from '../components/LoaderComponent';
import ErrorComponent       from '../components/ErrorComponent';
import {
    graphql,
    QueryRenderer,
} from 'react-relay';
import { environment }   from '../../api';

const PLACEMENTS_QUERY_FOR_SELF_RECRUITER = graphql`
    query PlacementsContainerSelfRecruiterQuery {
        viewer {
            profile: user {
                ... on Recruiter {
                    placements {
                        id
                        jobTitle
                        industry {
                            id, name
                        }
                        jobType
                        city
                        state
                        salaryRange
                        placementDate
                        category {
                            name
                        }
                    }
                }
            }
        }
    }
`;
const PLACEMENTS_QUERY_FOR_SELF_AGENCY = graphql`
    query PlacementsContainerSelfAgencyQuery {
        viewer {
            profile: user {
                ... on Recruiter {
                    agency {
                        placements {
                            id
                            jobTitle
                            industry {
                                id, name
                            }
                            jobType
                            city
                            state
                            salaryRange
                            placementDate
                            category {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;
const PLACEMENTS_QUERY = graphql`
    query PlacementsContainerQuery($id: ID!) {
        node(id: $id) {
            ... on Recruiter {
                placements {
                    id
                    jobTitle
                    industry {
                        id, name
                    }
                    jobType
                    city
                    state
                    salaryRange
                    placementDate
                    category {
                        name
                    }
                }
            }
            ... on Agency {
                placements {
                    id
                    jobTitle
                    industry {
                        id, name
                    }
                    jobType
                    city
                    state
                    salaryRange
                    placementDate
                    category {
                        name
                    }
                }
            }
        }
    }
`;

const PlacementsContainer = (props) => {
    const { id, Component, isAgency } = props;
    return (
        <QueryRenderer
            environment={ environment }
            query={ id ? PLACEMENTS_QUERY : isAgency ? PLACEMENTS_QUERY_FOR_SELF_AGENCY : PLACEMENTS_QUERY_FOR_SELF_RECRUITER }
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
                    const profile = node || (
                        viewer && !isAgency ? viewer.profile :
                            viewer.profile && viewer.profile.agency
                    ) || {};

                    return <Component placements={ profile.placements || [] }/>;
                }
            }
        />
    );
};

PlacementsContainer.propTypes = {
    id: PropTypes.string,
    isAgency: PropTypes.bool,
    Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
};

export default PlacementsContainer;
