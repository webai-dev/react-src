import { inject, observer } from 'mobx-react';
import React                from 'react';
import PropTypes            from 'prop-types';
import {
    withRouter,
}                           from 'react-router-dom';
import ProgressComponent    from './ProgressComponent';
import ErrorComponent       from '../ErrorComponent';
import {
    graphql,
    QueryRenderer,
}                           from 'react-relay';
import {
    environment,
}                           from '../../../api';
import getPermissions       from '../../../util/getPermissions';

const PROFILE_PROGRESS_QUERY = graphql`
    query ProgressContainerQuery {
        viewer {
            profileComplete
            user {
                ... on Recruiter {
                    placements {
                        id
                        employerRating {
                            title
                        }
                        candidateRating {
                            title
                        }
                    }
                    profilePhoto {
                        id
                    }
                    backgroundImage {
                        id
                    }
                    rating {
                        ratings {
                            id
                        }
                    }
                    agency {
                        integrations
                        slug
                        claimed
                    }
                    integrations
                }
            }
        }
    }
`;

const ProgressContainer = (props) => {
    const { store, history } = props;
    const isAgencyAdmin = getPermissions(store, [ 'recruiter_admin' ]);
    return <QueryRenderer
        environment={ environment }
        query={ PROFILE_PROGRESS_QUERY }
        render={
            ({ error, props: data }) => {
                const isLoading = !error && !data;
                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                let reviewsCount = 0;
                const viewer = data && data.viewer;

                if (!isLoading) {
                    reviewsCount = viewer.user.rating.ratings.length;
                }
                return (
                    <ProgressComponent
                        viewer={ viewer }
                        reviewsCount={ reviewsCount }
                        history={ history }
                        isLoading={ isLoading }
                        isAgencyAdmin={ isAgencyAdmin }
                    />
                );
            }
        }
    />;
};

ProgressContainer.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};

export default inject('store')(
    observer(withRouter(ProgressContainer)),
);
