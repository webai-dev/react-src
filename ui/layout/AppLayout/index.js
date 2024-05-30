import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import { observer, inject }           from 'mobx-react';
import { withRouter }                 from 'react-router-dom';
import * as Sentry                    from '@sentry/browser';
import { LoginManager }               from '../../../api';
import { ROUTES }                     from '../../../constants';
import TutorialRecruiterContainer     from '../../components/TutorialRecruiterContainer';
import JAInitialContainer             from '../../components/JAInitialContainer';
import ReceivedReviewContainer        from '../../components/ReceivedReviewContainer';
import { Helmet }                     from 'react-helmet';
import HeaderComponent                from './HeaderComponent';
import FooterComponent                from './FooterComponent';
import NavbarComponent                from './NavbarComponent';
import ToastComponent                 from '../../components/ToastComponent';
import ProfileCompleteContainer       from './ProfileCompleteContainer';
import styles                         from './styles.scss';

class AppLayout extends Component {
    state = {
        isLoading: false,
    };

    componentWillMount() { //Refresh token and redirect logic
        if (!this.props.store.auth.user) {
            this.redirectToLogIn();
        }
        if (this.props.store.auth.user && !this.props.store.auth.isLoggedIn) {
            this.setState({ isLoading: true });
            LoginManager.refreshUserToken()
                .then(() => {
                    this.setState({ isLoading: false });
                })
                .catch(() => {
                    this.setState({ isLoading: false });
                    this.redirectToLogIn();
                });
        }
    }


    redirectToLogIn = () => {
        this.props.history.replace(ROUTES.ROOT);
    };

    render() {
        const {
            title,
            children
        } = this.props;
        const { isLoading } = this.state;
        if (isLoading) {
            return null;
        }

        if (this.props.store.auth && this.props.store.auth.user && this.props.store.auth.user.hasRoles('super_admin')) {
            Sentry.init({
                dsn: null,
                environment: process.env.NODE_ENV
            });
        }

        return (
            <Fragment>
                <Helmet>
                    { title && <title>{ title }</title> }
                    <body className={ styles.layout } />
                </Helmet>

                <HeaderComponent />
                <JAInitialContainer />
                <ReceivedReviewContainer />
                <TutorialRecruiterContainer />
                <NavbarComponent />
                <ToastComponent className={ styles.toastifyContainer } />
                <div className={ styles.main }>
                    <ProfileCompleteContainer />
                    { children }
                </div>
                <FooterComponent />
            </Fragment>
        );
    }
}

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.object.isRequired,
    store: PropTypes.object,
    title: PropTypes.string,
    error: PropTypes.object,
};

export default inject('store')(
    observer(withRouter(AppLayout)),
);
