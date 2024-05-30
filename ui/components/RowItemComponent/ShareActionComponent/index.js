import React                                from 'react';
import PropTypes                            from 'prop-types';
import { generatePath }                     from 'react-router-dom';
import {
    BaseAPiPath,
    PARAM_REVIEW_ID,
    PARAM_REVIEW_TEMPLATE_ID,
    PARAM_TEMPLATE,
    PARAM_SLUG,
    PROFILE_MODAL,
    ROUTES,
}                                           from '../../../../constants';
import gtmPush, { GTM_ACTIONS, GTM_EVENTS } from '../../../../util/gtmPush';
import ButtonActionComponent                from '../ButtonActionComponent';

const ShareActionComponent = (props) => {
    const { reviewId, slug, templateId, isAgency } = props;
    return (
        <ButtonActionComponent
            onClick={
                () => {
                    gtmPush({
                        event: GTM_EVENTS.SHARE_REVIEW,
                        action: GTM_ACTIONS.REVIEW,
                        label: reviewId,
                    });
                    window.open(
                        'https://www.linkedin.com/sharing/share-offsite/' +
                        `?url=${ BaseAPiPath + generatePath(
                            isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
                            {
                                [ PARAM_SLUG ]: slug,
                                [ PROFILE_MODAL._NAME ]: PROFILE_MODAL.REVIEW,
                                [ PARAM_REVIEW_ID ]: reviewId.replace(/[=]/g, '%3D'),
                                ...(templateId ? {
                                    [ PARAM_TEMPLATE._NAME ]: PARAM_TEMPLATE.TRUE,
                                    [ PARAM_REVIEW_TEMPLATE_ID ]: templateId
                                } : {})
                            },
                        ) }` +
                        '&source=Sourcr',
                        'myWindow',
                        'width=520,height=570',
                    );
                }
            }
            text="share"
        />
    );
};

ShareActionComponent.propTypes = {
    templateId: PropTypes.string,
    isAgency: PropTypes.bool,
    reviewId: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
};

export default ShareActionComponent;
