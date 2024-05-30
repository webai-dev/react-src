import React, { PureComponent } from 'react';
import {
    graphql,
    QueryRenderer,
}                               from 'react-relay';
import {
    environment,
    commitMutation,
}                               from '../../../api';
import HeaderComponent          from './HeaderComponent';

const mutation = graphql`
    mutation HeaderUserActionsMutation($notificationId: String) {
        mutator {
            markNotificationSeen(notificationId: $notificationId) {
                id
                seen
            }
        }
    }
`;


const ABOUT_ME_QUERY = graphql`
    query HeaderUserActionsQuery {
        viewer {
            profileComplete
            user {
                ... on User {
                    id
                    profilePhoto {
                        url
                    }
                }
                ... on Recruiter {
                    id
                    profilePhoto {
                        url
                    }
                }
            }
            notifications {
                id
                seen
                date
                subject
                link
                message
            }
        }
    }
`;

class HeaderContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
    };

    /**
     * Commit markNotificationSeen mutation
     *
     * @param {string} [notificationId]
     */
    commitPlacementsDelete = notificationId => {
        const variables = {
            notificationId,
        };

        return commitMutation(
            environment,
            {
                mutation,
                variables,
                errorPath: 'mutator.notifications.errors',
            },
        );
    };

    /**
     * Handle notification seen flag and corresponding logic
     *
     * @param {string} [notificationId]
     */
    handleSeen = notificationId => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitPlacementsDelete(notificationId).then(() => {
            this.setState({ isLoading: false });
        });
    };

    render() {
        const { handleSeen } = this;

        return (
            <QueryRenderer
                environment={ environment }
                query={ ABOUT_ME_QUERY }
                render={
                    ({ error, props: data }) => {
                        const loading = !error && !data;
                        const profileInfo = {
                            profilePhotoUrl:
                            data &&
                            data.viewer &&
                            data.viewer.user &&
                            data.viewer.user.profilePhoto &&
                            data.viewer.user.profilePhoto.url,
                            notifications:
                            data &&
                            data.viewer &&
                            data.viewer.notifications,
                        };
                        let unseenNotificationsCount = 0;
                        if (profileInfo.notifications) {
                            profileInfo.notifications.forEach(notification => {
                                unseenNotificationsCount = unseenNotificationsCount + (notification.seen ? 0 : 1);
                            });
                        }
                        return (
                            <HeaderComponent
                                profileInfo={ profileInfo }
                                loading={ loading }
                                handleSeen={ handleSeen }
                                unseenNotificationsCount={ unseenNotificationsCount }
                            />
                        );
                    }
                }
            />
        );
    }
}

export default HeaderContainer;
