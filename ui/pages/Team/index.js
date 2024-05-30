import React, { PureComponent }              from 'react';
import PropTypes                             from 'prop-types';
import { generatePath }                      from 'react-router-dom';
import LoaderComponent                       from '../../components/LoaderComponent';
import ErrorComponent                        from '../../components/ErrorComponent';
import {
    graphql,
    QueryRenderer,
}                                            from 'react-relay';
import {
    environment,
}                                            from '../../../api';
import TeamComponent                         from './TeamComponent';
import { ROUTES, TEAM_TAB, TEAM_TAB_INVITE } from '../../../constants';

const TEAM_MEMBERS_QUERY = graphql`
    query TeamViewQuery {
        viewer {
            subscriptionEstimate
            user {
                ... on User {
                    id
                }
                ... on Recruiter {
                    id
                }
            }
            users {
                ... on User {
                    id
                    email
                    approved
                    firstName
                    lastName
                    jobTitle
                    roles
                    verified
                    company {
                        id
                        name
                    }
                    profilePhoto {
                        url
                    }
                }
                ... on Recruiter {
                    id
                    email
                    firstName
                    lastName
                    jobTitle
                    verified
                    approved
                    roles
                    agency {
                        id
                        slug
                        name
                    }
                    specialisations {
                        name
                    }
                    profilePhoto {
                        url
                    }
                }
            }
        }
    }
`;

class TeamView extends PureComponent {
    render() {
        const { match, history } = this.props;
        const isCompany = match.path === ROUTES.COMPANY_USERS;

        const currentTab = match.params[ TEAM_TAB._NAME ];
        const isInvite = match.params.id === TEAM_TAB_INVITE;
        const memberId = (!isInvite && match.params.id) || null;

        const currentPath = generatePath(
            isCompany ? ROUTES.COMPANY_USERS : ROUTES.AGENCY_RECRUITERS,
            {
                [ TEAM_TAB._NAME ]: currentTab,
            },
        );
        const handleCloseModal = () => {history.push(currentPath);};

        return (
            <QueryRenderer
                environment={ environment }
                query={ TEAM_MEMBERS_QUERY }
                render={
                    ({ error, props: data }) => {
                        if (error) {
                            return <ErrorComponent error={ error } />;
                        }
                        if (!data && !error) {
                            return <LoaderComponent row />;
                        }
                        const members = (data?.viewer?.users) || [];
                        const myId = data?.viewer?.user?.id;
                        let pendingMembers = [];
                        let verifiedMembers = [];

                        members.forEach(member => {
                            if (member.approved) {
                                verifiedMembers.push(member);
                            } else {
                                pendingMembers.push(member);
                            }
                        });

                        return (
                            <TeamComponent
                                myId={ myId }
                                isCompany={ isCompany }
                                currentTab={ currentTab }
                                isInvite={ isInvite }
                                memberId={ memberId }
                                handleCloseModal={ handleCloseModal }
                                members={ currentTab === TEAM_TAB.ACTIVE ? verifiedMembers : pendingMembers }
                                verifiedMembersLength={ verifiedMembers.length }
                                pendingMembersLength={ pendingMembers.length }
                                subscriptionEstimate={ data?.viewer?.subscriptionEstimate }
                            />
                        );
                    }
                }
            />
        );
    }
}

TeamView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default TeamView;
