import React          from 'react';
import { render }     from 'react-dom';
import generatePath   from 'react-router-dom/generatePath';
import {
    BaseApiHost,
    PARAM_SLUG,
    ROUTES,
    WIDGET_THEME,
    WIDGET_TYPE,
    widgetAppId,
    isLocalBuild,
}                     from '../constants';
import WidgetComponent
                      from '../ui/components/WidgetContainer/WidgetComponent';
import fetchCode      from './fetchCode';
import createJsonData from './createJsonData';

const props = (window.sourcrC || {});

let slug = props.slug;
let type = props.type;
let theme = props.theme;
let ids = props.ids;
let isFreelancer = props.isFreelancer;
let isGoogleSnippets = props.isGoogleSnippets;
// Some dummy values to work on localhost
if (isLocalBuild) {
    slug = 'halcyon-knights';
    type = WIDGET_TYPE.FOOTER;
    theme = WIDGET_THEME.LIGHT;
    ids = [];
    isFreelancer = false;
    isGoogleSnippets = true;
}

// TODO create new ModalComponent without helmet, constants, ClientContext, react-router-dom (WITH SHARED? CSS)
// TODO create new ButtonComponent (WITH SHARED? CSS)

const el = document.getElementById(widgetAppId);
if (el) {
    const serverUrl = BaseApiHost;
    const isDarkTheme = WIDGET_THEME.DARK === theme;
    fetchCode(`${ serverUrl }/graphql/`, slug, isFreelancer ? 'recruiter' : 'agency', ids)
        .then(data => {

            const pathToAgencyPage = `${ BaseApiHost }${ generatePath(
                ROUTES.AGENCY_PROFILE,
                { [ PARAM_SLUG ]: slug },
            ) }`;

            if (isGoogleSnippets && data?.profile?.hasActiveSubscription) {
                createJsonData(data.profile, isFreelancer, pathToAgencyPage);
            }
            const reviewsCount = data.profile.rating?.reviewsCount;
            const overallRating = data.profile.rating?.overallRating;
            const reviews = data.nodes || data.profile.rating?.lastRatings?.slice(0, 3);

            const pathToSite = `${ BaseApiHost }${ ROUTES.ROOT }`;
            render(
                <WidgetComponent
                    slug={ slug }
                    type={ type }
                    isDarkTheme={ isDarkTheme }
                    pathToAllReviews={ pathToAgencyPage }
                    pathToSite={ pathToSite }
                    reviewsCount={ reviewsCount }
                    overallRating={ overallRating }
                    reviews={ reviews }
                />,
                el
            );
        })
        .catch(error => {
            /* eslint-disable no-console */
            console.log(error);
            /* eslint-enable no-console */
            render(
                <div>Error</div>,
                el
            );
        });
}
