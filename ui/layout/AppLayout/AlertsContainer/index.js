import { inject, observer }           from 'mobx-react';
import React, { PureComponent }       from 'react';
import { LOCAL_STORAGE_KEYS, ROUTES } from '../../../../constants';
import localStorageInstance           from '../../../../util/LocalStorage';
import { generatePath, withRouter }   from 'react-router-dom';
import ErrorComponent                 from '../../../components/ErrorComponent';
import {
    graphql,
    QueryRenderer,
}                                     from 'react-relay';
import {
    environment,
}                                     from '../../../../api';
import AlertsComponent                from './AlertsComponent';

const PENDING_REVIEWS_QUERY = graphql`
    query AlertsContainerQuery {
        viewer {
            user {
                ...on Recruiter {
                    isRecruiter: slug
                }
            }
            reviewTemplates {
                id
            }
            employerTemplate: customNotificationTemplate(name: "placement-request-employer-review")
            candidateTemplate: customNotificationTemplate(name: "placement-request-candidate-review")

            pendingReviews {
                title
            }
        }
    }
`;

class AlertsContainer extends PureComponent {
    state = {
        [ LOCAL_STORAGE_KEYS.HIDE_PENDING_REVIEWS_WARNING ]: !localStorageInstance.getItem(LOCAL_STORAGE_KEYS.HIDE_PENDING_REVIEWS_WARNING),
        [ LOCAL_STORAGE_KEYS.HIDE_TOOLS_SETTING_INFO ]: !localStorageInstance.getItem(LOCAL_STORAGE_KEYS.HIDE_TOOLS_SETTING_INFO),
    };

    /**
     * Hide banner now and for next day
     *
     * @param {string} key - from LOCAL_STORAGE_KEYS.
     */
    handleHideNotificationBanner = (key) => {
        this.setState({ [ key ]: false });
        localStorageInstance.setItem(
            key,
            '1',
            24 * 60, // 1 day
        );
    };

    render() {
        const { handleHideNotificationBanner } = this;
        const showPendingReviews = this.state[ LOCAL_STORAGE_KEYS.HIDE_PENDING_REVIEWS_WARNING ];
        const showToolsSetting = this.state[ LOCAL_STORAGE_KEYS.HIDE_TOOLS_SETTING_INFO ];
        return (
            <QueryRenderer
                environment={ environment }
                query={ PENDING_REVIEWS_QUERY }
                render={
                    ({ error, props: data }) => {
                        if (error) {
                            return <ErrorComponent error={ error } />;
                        }
                        if (!data && !error) {
                            return null;
                        }

                        const isShowPendingReviews = !!data.viewer.pendingReviews?.length && showPendingReviews;
                        
                        const routeToConfigureTool = (!showToolsSetting || !data.viewer.user?.isRecruiter) ? null :
                            !data.viewer.reviewTemplates?.length ?
                                generatePath(ROUTES.SOCIAL_CUSTOM) : !(data.viewer.employerTemplate || data.viewer.candidateTemplate) ?
                                generatePath(ROUTES.INVITE_SETTINGS) : null;
                        return (
                            <AlertsComponent
                                isShowPendingReviews={ isShowPendingReviews }
                                handleHideNotificationBanner={ handleHideNotificationBanner }
                                routeToConfigureTool={ routeToConfigureTool }
                            />
                        );
                    }
                }
            />
        );
    }
}

export default inject('store')(
    observer(withRouter(AlertsContainer)),
);
