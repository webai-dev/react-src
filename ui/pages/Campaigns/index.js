import PropTypes              from 'prop-types';
import React                  from 'react';
import { ROUTES }             from '../../../constants';
import CampaignsViewComponent from './CampaignsViewComponent';
import { withRouter }         from 'react-router-dom';
import {
    graphql,
    QueryRenderer,
}                             from 'react-relay';
import {
    environment,
}                             from '../../../api';
import ErrorComponent         from '../../components/ErrorComponent';
import LoaderComponent        from '../../components/LoaderComponent';

const CAMPAIGNS_QUERY = graphql`
    query CampaignsQuery {
        viewer {
            npsCampaigns {
                id
                title
                active
                slug
                createdAt
            }
            user {
                ...on Recruiter {
                    agency {
                        npsResponses {
                            id
                        }
                    }
                    npsResponses {
                        id
                    }
                }
            }
        }
    }
`;

const CAMPAIGNS_RESPONSES_QUERY = graphql`
    query CampaignsResponsesQuery {
        viewer {
            npsCampaigns {
                id
                title
            }
            user {
                ...on Recruiter {
                    agency {
                        npsResponses {
                            id
                            score
                            userType
                            npsCampaignRecipient {
                                firstName
                                lastName
                                npsCampaign {
                                    id
                                    title
                                    recipientType
                                }
                            }
                            review {
                                firstName
                                lastName
                            }
                        }
                    }
                    npsResponses {
                        id
                        score
                        userType
                        npsCampaignRecipient {
                            firstName
                            lastName
                            npsCampaign {
                                id
                                title
                                recipientType
                            }
                        }
                        review {
                            firstName
                            lastName
                        }
                    }
                }
            }
        }
    }
`;

const CampaignsView = (props) => {
    const { location: { pathname } } = props;

    return (
        <QueryRenderer
            environment={ environment }
            query={ pathname === ROUTES.CAMPAIGNS ? CAMPAIGNS_QUERY : CAMPAIGNS_RESPONSES_QUERY }
            render={ ({ error, props: data }) => {
                const loading = !error && !data;

                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                if (loading) {
                    return <LoaderComponent row />;
                }

                const campaigns = data.viewer.npsCampaigns;
                let responses = (data.viewer.user.agency ? data.viewer.user.agency : data.viewer.user).npsResponses;

                if (pathname !== ROUTES.CAMPAIGNS) {
                    responses = responses.map(res => ({
                        firstName: res.review ? res.review.firstName : res.npsCampaignRecipient.firstName,
                        lastName: res.review ? res.review.lastName : res.npsCampaignRecipient.lastName,
                        userType: res.userType,
                        score: res.score,
                        campaignName: res.review ?
                            'From Placement Review' :
                            `Campaign: ${ res.npsCampaignRecipient?.npsCampaign.title }`,
                        id: res.id,
                        campaignId: res.npsCampaignRecipient?.npsCampaign.id
                    }));
                }

                return (
                    <CampaignsViewComponent
                        pathname={ pathname }
                        campaigns={ campaigns }
                        responses={ responses }
                    />
                );
            } }
        />
    );
};

CampaignsView.propTypes = {
    location: PropTypes.object.isRequired,
};

export default withRouter(CampaignsView);
