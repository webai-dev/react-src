import React            from 'react';
import WidgetsComponent from './WidgetsComponent';
import {
    graphql,
    QueryRenderer,
}                       from 'react-relay';
import {
    environment,
}                       from '../../../../api';
import ErrorComponent   from '../../../components/ErrorComponent';
import LoaderComponent  from '../../../components/LoaderComponent';

const WIDGET_QUERY = graphql`
    query WidgetsContainerQuery {
        viewer {
            user {
                ...on Recruiter {
                    slug
                    rating {
                        ratings {
                            title
                        }
                    }
                    agency {
                        slug
                        rating {
                            ratings {
                                title
                            }
                        }
                    }
                }
            }
        }
    }
`;

const WidgetsContainer = () => {
    return (
        <QueryRenderer
            environment={ environment }
            query={ WIDGET_QUERY }
            render={ ({ error, props: data }) => {
                const loading = !error && !data;

                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                if (loading) {
                    return <LoaderComponent row />;
                }
                const slug = data.viewer.user.agency?.slug || data.viewer.user.slug;
                const isFreelancer = !data.viewer.user.agency;
                const hasReviews = !isFreelancer ? !!data.viewer.user.agency.rating?.ratings?.length :
                    !!data.viewer.user.rating?.ratings?.length;
                return (
                    <WidgetsComponent
                        isFreelancer={ isFreelancer }
                        slug={ slug }
                        hasReviews={ hasReviews }
                    />
                );
            } }
        />
    );
};

export default WidgetsContainer;
