import React                   from 'react';
import PropTypes               from 'prop-types';
import {
    graphql,
    QueryRenderer,
}                              from 'react-relay';
import { withRouter }          from 'react-router-dom';
import ReviewTemplateComponent from './ReviewTemplateComponent';
import { environment }         from '../../../api';
import {
    PARAM_REVIEW_ID,
    PARAM_REVIEW_TEMPLATE_ID
}                              from '../../../constants';
import ErrorComponent          from '../../components/ErrorComponent';
import LoaderComponent         from '../../components/LoaderComponent';

const REVIEW_TEMPLATE_QUERY = graphql`
    query ReviewTemplateQuery($reviewId: ID!, $templateId: ID!) {
        rating: node(id: $reviewId) {
            ...on Rating {
                overallRating
                review
                firstName
                lastName
                isEmployer: responsiveness
                recruiter {
                    rating {
                        overallRating
                        reviewsCount
                    }
                    backgroundColor
                    backgroundImage {
                        url
                    }
                }
                placement {
                    companyName(public: true)
                }
            }
        }
        template: node(id: $templateId) {
            ...on ReviewTemplate {
                backgroundColor
                textAlign
                textColor
                backgroundImage {
                    url
                }
            }
        }
    }
`;

const ReviewTemplateView = (props) => {
    const { match: { params } } = props;
    const templateId = params[ PARAM_REVIEW_TEMPLATE_ID ] || 'null';
    const reviewId = params[ PARAM_REVIEW_ID ];

    return (
        <QueryRenderer
            environment={ environment }
            query={ REVIEW_TEMPLATE_QUERY }
            variables={ { reviewId, templateId } }
            render={ ({ error, props: data }) => {
                const loading = !error && !data;

                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                if (loading) {
                    return <LoaderComponent row />;
                }

                return (
                    <ReviewTemplateComponent
                        review={ data.rating }
                        recruiter={ data.rating.recruiter }
                        template={ data.template || {} }
                    />
                );
            } }
        />
    );
};

ReviewTemplateView.propTypes = {
    match: PropTypes.object.isRequired
};

export default withRouter(ReviewTemplateView);
