import React                                    from 'react';
import { Redirect }                             from 'react-router-dom';
import { ROUTES, PARAM_SUBSCRIPTION_SUCCESS }   from '../../../constants';

const SubscriptionSuccessComponent = () => {
    return (
        <Redirect to={ ROUTES.DASHBOARD_REVIEWS + `?${PARAM_SUBSCRIPTION_SUCCESS._NAME}=${PARAM_SUBSCRIPTION_SUCCESS.TRUE}` } />
    );
};

export default SubscriptionSuccessComponent;
