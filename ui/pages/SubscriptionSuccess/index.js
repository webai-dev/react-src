import React, { PureComponent }     from 'react';
import { LoginManager }             from '../../../api';
import SubscriptionSuccessComponent from './SubscriptionSuccessComponent';

class SubscriptionSuccessView extends PureComponent {
    componentDidMount() {
        LoginManager.refreshUserToken();
    }

    render() {
        return <SubscriptionSuccessComponent />;
    }
}

export default SubscriptionSuccessView;
