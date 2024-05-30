import React                        from 'react';
import PropTypes                    from 'prop-types';
import {
    graphql,
    QueryRenderer,
}                                   from 'react-relay';
import { generatePath, withRouter } from 'react-router-dom';
import localStorageInstance         from '../../../util/LocalStorage';
import StatementComponent           from './StatementComponent';
import { environment }              from '../../../api';
import {
    LOCAL_STORAGE_KEYS, PARAM_SLUG,
    PARAM_STATEMENT_ID, ROUTES,
}                                   from '../../../constants';
import ErrorComponent               from '../../components/ErrorComponent';
import LoaderComponent              from '../../components/LoaderComponent';

const STATEMENT_QUERY = graphql`
    query StatementrQuery($id: ID!) {
        node(id: $id) {
            ...on CapabilityStatement {
                name
                statement
                recruiterEmail
                textColor
                backgroundColor
                createdAt
                recruiter {
                    placementCount
                    averageSalaryRange
                    profilePhoto {
                        url
                    }
                    backgroundImage {
                        url
                    }
                    agency {
                        name
                    }
                    firstName
                    lastName
                    jobTitle
                    contactNumber

                    rating {
                        overallRating
                        reviewsCount
                        candidateQuality
                        industryKnowledge
                        communication
                        responsiveness
                        candidateRating
                        reviewsCandidateCount
                        reviewsEmployerCount
                    }
                    jobCategoryReviewsOverall: jobCategoryReviews(type: null) {
                        rows {
                            rating {
                                overallRating
                                reviewsCount
                            }
                            jobCategory {
                                name
                            }
                        }
                    }
                }
                reviews {
                    title
                    overallRating
                    review
                    firstName
                    lastName
                    isEmployer: candidateQuality
                    placement {
                        companyName
                    }
                }
                placements {
                    id
                    jobTitle
                    industry {
                        name
                    }
                    jobType
                    suburb
                    salaryRange
                }
            }
        }
    }
`;

const STATEMENT_PREVIEW_QUERY = graphql`
    query StatementrPreeviewQuery(
        $reviewIds: [ID!]!,
        $placementIds: [ID!]!
    ) {
        viewer {
            recruiter: user {
                ...on Recruiter {
                    placementCount
                    averageSalaryRange
                    profilePhoto {
                        url
                    }
                    backgroundImage {
                        url
                    }
                    agency {
                        name
                    }
                    firstName
                    lastName
                    jobTitle
                    contactNumber
                    email
                    rating {
                        overallRating
                        reviewsCount
                        candidateQuality
                        industryKnowledge
                        communication
                        responsiveness
                        candidateRating
                        reviewsCandidateCount
                        reviewsEmployerCount
                    }
                    jobCategoryReviewsOverall: jobCategoryReviews(type: null) {
                        rows {
                            rating {
                                overallRating
                                reviewsCount
                            }
                            jobCategory {
                                name
                            }
                        }
                    }
                }
            }
        }
        reviews: nodes(ids: $reviewIds) {
            ...on Rating {
                title
                overallRating
                review
                firstName
                lastName
                isEmployer: candidateQuality 
                placement {
                    companyName
                }
            }
        }
        placements: nodes(ids: $placementIds) {
            ...on Placement {
                id
                jobTitle
                industry {
                    name
                }
                jobType
                suburb
                salaryRange
            }
        }
    }
`;

const StatementView = (props) => {
    const { match: { params } } = props;
    const statementId = params[ PARAM_STATEMENT_ID ];
    const slug = params[ PARAM_SLUG ];
    const previewParams = statementId ? null :
        (JSON.parse(localStorageInstance.getItem(
            LOCAL_STORAGE_KEYS.RECRUITER_PROFILE_PREVIEW,
            true
        )) || {});
    const pathToRecruiter = previewParams ? null : generatePath(
        ROUTES.RECRUITER_PROFILE,
        { [ PARAM_SLUG ]: slug }
    );

    return (
        <QueryRenderer
            environment={ environment }
            query={ statementId ? STATEMENT_QUERY : STATEMENT_PREVIEW_QUERY }
            variables={ statementId ? { id: statementId } : {
                reviewIds: previewParams.reviews || [ 'null' ],
                placementIds: previewParams.placements || [ 'null' ],
            } }
            render={ ({ error, props: data }) => {
                const loading = !error && !data;

                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                if (loading) {
                    return <LoaderComponent row />;
                }

                let statement;
                let recruiter;

                if (previewParams) {
                    statement = {
                        name: previewParams.name,
                        statement: previewParams.statement,
                        backgroundColor: previewParams.backgroundColor,
                        textColor: previewParams.textColor,
                        reviews: (data.reviews || []).filter(Boolean),
                        placements: (data.placements || []).filter(Boolean),
                    };
                    recruiter = data.viewer.recruiter;
                } else {
                    statement = data.node;
                    recruiter = statement && { ...statement.recruiter, email: statement.recruiterEmail };
                }

                return (
                    <StatementComponent
                        pathToRecruiter={ pathToRecruiter }
                        recruiter={ recruiter }
                        statement={ statement }
                    />
                );
            } }
        />
    );
};

StatementView.propTypes = {
    match: PropTypes.object.isRequired
};

export default withRouter(StatementView);
