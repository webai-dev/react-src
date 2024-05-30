import { hot }                  from 'react-hot-loader';
import './app.scss';
import React, { Component }     from 'react';
import * as Sentry              from '@sentry/browser';
import { Provider }             from 'mobx-react';
import { store }                from './stores';
import { ClientContextWrapper } from './ClientContext';
import SentryErrorComponent     from './ui/components/SentryErrorComponent';
import localStorageInstance     from './util/LocalStorage';
import { isProduction }         from './constants';
import Routing                  from './Routing';
import { IntlProvider }         from 'react-intl';

if (isProduction) {
    Sentry.init({
        dsn: 'https://8bb8f64329ee412995c740389937602e@sentry.io/1427984',
        environment: process.env.NODE_ENV
    });
} else {
    Sentry.init({
        // it is Arseniy sourcr development account. Feel free to change it or may be even remove
        dsn: 'https://96acc1b1225f4382a4c86fec5a0965b0@sentry.io/1426663',
        environment: process.env.NODE_ENV
    });
}

localStorageInstance.init();

class BaseApp extends Component {
    state = {
        error: null,
    };

    componentDidCatch(error, errorInfo) {
        this.setState({ error });
        Sentry.configureScope(scope => {
            Object.keys(errorInfo)
                .forEach(key => {
                    scope.setExtra(key, errorInfo[ key ]);
                });
        });
        Sentry.captureException(error);
    }

    render() {
        if (this.state.error) {
            return <SentryErrorComponent />;
        }
        return (
            <IntlProvider locale="en-US">
                <ClientContextWrapper>
                    <Provider store={ store }>
                        <Routing />
                    </Provider>
                </ClientContextWrapper>
            </IntlProvider>
        );
    }
}

export default hot(module)(BaseApp);
