import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import { LoginManager }               from '../../../api';
import ToastComponent                 from '../../components/ToastComponent';
import { Helmet }                     from 'react-helmet';
import {
    observer,
    inject,
}                                     from 'mobx-react';
import {
    withRouter,
}                                     from 'react-router-dom';
import { ROUTES }                     from '../../../constants';
import LogoImage                      from '../../../images/logo-negative.svg';
import HeaderComponent                from '../HeaderComponent';
import styles                         from './styles.scss';

class LoginLayout extends Component {
    state = {
        isLoading: false,
    };

    UNSAFE_componentWillMount() { //Refresh token and redirect logic
        if (this.props.store.auth.user && this.props.store.auth.isLoggedIn) {
            this.redirectToApp();
        }
        if (this.props.store.auth.user && !this.props.store.auth.isLoggedIn) {
            this.setState({ isLoading: true });
            LoginManager.refreshUserToken()
                .then(() => {
                    this.setState({ isLoading: false });
                    this.redirectToApp();
                })
                .catch(() => {
                    this.setState({ isLoading: false });
                });
        }
    }

    redirectToApp = () => {
        this.props.history.replace(
            this.props.store.auth.user.hasRoles('recruiter') ? ROUTES.DASHBOARD_REVIEWS : ROUTES.DASHBOARD
        );
    };

    render() {
        const { title, description, children } = this.props;
        const { isLoading } = this.state;
        if (isLoading) {
            return null;
        }
        return (
            <Fragment>
                <Helmet>
                    <body className={ styles.layout } />
                    { title && <title>{ title }</title> }
                    { description && <meta
                        name="Description"
                        content={ description }
                    /> }
                </Helmet>
                <HeaderComponent />
                <ToastComponent className={ styles.toastifyContainer } />

                <div className={ styles.main }>
                    <div className={ styles.logo }>
                        <img
                            src={ LogoImage }
                            alt="Sourcr logo"
                        />
                    </div>
                    <div>
                        { children }
                    </div>
                </div>
            </Fragment>
        );
    }
}

LoginLayout.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(inject('store')(observer(LoginLayout)));
