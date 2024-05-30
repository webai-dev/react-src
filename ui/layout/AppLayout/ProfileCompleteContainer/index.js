import React, { Component, Fragment }                          from 'react';
import PropTypes                                               from 'prop-types';
import { observer, inject }                                    from 'mobx-react';
import { withRouter, Link, Redirect }                          from 'react-router-dom';
import { Alert, Collapse, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { environment }                                         from '../../../../api';
import { ROUTES }                                              from '../../../../constants';
import ResendVerificationMutation                              from '../../../../mutations/ResendVerificationMutation';
import { Button }                                              from '../../../components/Button';
import AlertsContainer                                         from '../AlertsContainer';
import RequiresPermission                                      from '../../../components/User/RequiresPermission';
import emailImage                                              from '../../../../images/email.png';
import UserImage                                               from '../../../../images/user_avatar.png';
import { graphql, QueryRenderer }                              from 'react-relay';
import styles                                                  from './styles.scss';

const getIn = (obj, path) => {
    return path.split('.')
        .reduce((stack, key) => {
            if (stack && stack[ key ]) {
                return stack[ key ];
            }
            return undefined;
        }, obj);
};
getIn.propTypes = {
    obj: PropTypes.object,
    path: PropTypes.string,
};

@withRouter
@inject('store')
@observer
class ProfileCompleteComponent extends Component {
    state = {
        error: null,
        loadingUser: true,
        errors: {},
        hasClicked: false,
        email: undefined,
        didResend: false
    };

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        this.setState({
            error: null
        });
    }

    onSubmitResendVerification = e => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ errors: {} });
        ResendVerificationMutation.commit(environment, this.state.email)
            .then(() => {
                this.setState({ didResend: true });
            })
            .catch(({ errors }) => {
                this.setState({
                    errors: errors.reduce((list, { key, value }) => {
                        list[ key ] = value;
                        return list;
                    }, {})
                });
            });
    };

    render() {
        const { errors } = this.state;
        const {
            store: { auth },
            viewer
        } = this.props;

        return (
            <Fragment>
                { !auth.user?.attributes.verified && (
                    <RequiresPermission roles={ [ 'recruiter' ] }>
                        <Alert
                            className="verify-email-alert"
                            color="info"
                        >
                            <Collapse
                                isOpen={
                                    this.state.didResend === false &&
                                    !auth.user?.attributes.verified
                                }
                            >
                                <form onSubmit={ this.onSubmitResendVerification }>
                                    <img
                                        className="email-icon"
                                        alt="Email icon"
                                        src={ emailImage }
                                    />
                                    <h4>Confirm your email address</h4>
                                    <p>
                                        The email below is what we currently have for employers and candidates to
                                        contact you.
                                    </p>
                                    <p>
                                        Please confirm or change this to make sure you don&apos;t miss out on any
                                        leads!
                                    </p>
                                    <InputGroup>
                                        <Input
                                            type="email"
                                            value={
                                                this.state.email ||
                                                getIn(auth, 'user.attributes.email')
                                            }
                                            onChange={ e =>
                                                this.setState({ email: e.target.value })
                                            }
                                        />

                                        <InputGroupAddon addonType="append">
                                            <Button type="submit">Resend Verification</Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    { errors.email && <p>{ errors.email }</p> }
                                </form>
                            </Collapse>
                            <Collapse isOpen={ this.state.didResend }>
                                <img
                                    className="email-icon"
                                    src={ emailImage }
                                />
                                <h4>Check your inbox for a verification email</h4>
                                <p>
                                    We have emailed you a new verification code, please follow
                                    the instructions in the email to verify your account
                                </p>
                            </Collapse>
                        </Alert>
                    </RequiresPermission>
                ) }
                { !auth.user?.attributes.verified && (
                    <RequiresPermission roles={ [ 'user' ] }>
                        <Alert
                            className="verify-email-alert"
                            color="info"
                        >
                            <Collapse
                                isOpen={
                                    this.state.didResend === false &&
                                    !auth.user?.attributes.verified
                                }
                            >
                                <form onSubmit={ this.onSubmitResendVerification }>
                                    <img
                                        className="email-icon"
                                        src={ emailImage }
                                    />
                                    <h4>Check your inbox for a verification email</h4>
                                    <p>
                                        Before posting a job to our recruiter marketplace, we
                                        have to make sure you are who you say you are!
                                    </p>
                                    <p>
                                        If you didn’t receive an email, don’t worry we can send
                                        you another one
                                    </p>
                                    <InputGroup>
                                        <Input
                                            type="email"
                                            value={
                                                this.state.email ||
                                                getIn(auth, 'user.attributes.email')
                                            }
                                            onChange={ e =>
                                                this.setState({ email: e.target.value })
                                            }
                                        />

                                        <InputGroupAddon addonType="append">
                                            <Button type="submit">Resend Verification</Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    { errors.email && <p>{ errors.email }</p> }
                                </form>
                            </Collapse>
                            <Collapse isOpen={ this.state.didResend }>
                                <img
                                    className="email-icon"
                                    src={ emailImage }
                                />
                                <h4>Check your inbox for a verification email</h4>
                                <p>
                                    We have emailed you a new verification code, please follow
                                    the instructions in the email to verify your account
                                </p>
                            </Collapse>
                        </Alert>
                    </RequiresPermission>
                ) }
                { viewer && !viewer.profileComplete &&
                <div className={ styles.alert }>
                    <div
                        className={ styles.alertAvatar }
                        style={ {
                            backgroundImage: `url(${ UserImage })`,
                        } }
                    />
                    <div className={ styles.alertMessage }>
                        <RequiresPermission roles={ [ 'recruiter' ] }>
                            Your profile is not complete,{ ' ' }
                            <Link to={ ROUTES.RECRUITER_PROFILE_EDIT }>
                                click here
                            </Link>{ ' ' }to update your profile
                        </RequiresPermission>
                        <RequiresPermission roles={ [ 'user' ] }>
                            Your profile is not complete,{ ' ' }
                            <Link to={ ROUTES.USER_PROFILE_EDIT }>
                                click here
                            </Link>{ ' ' }to update your profile
                        </RequiresPermission>
                    </div>
                </div>
                }

                <AlertsContainer />
            </Fragment>
        );
    }
}

ProfileCompleteComponent.propTypes = {
    store: PropTypes.object,
    title: PropTypes.string,
    viewer: PropTypes.object.isRequired,
    location: PropTypes.object,
    error: PropTypes.object,
};

const VERIFY_AUTH = graphql`
    query ProfileCompleteContainerQuery {
        viewer {
            profileComplete
            user {
                ... on User {
                    id
                }
                ... on Recruiter {
                    id
                }
            }
        }
    }
`;
const ProfileCompleteContainer = () => {
    return (
        <QueryRenderer
            environment={ environment }
            query={ VERIFY_AUTH }
            render={ ({ error, props: data }) => {
                const loading = !error && !data;
                if (loading) {
                    return null;
                }
                if (error) {
                    return <Redirect to={ ROUTES.LOGOUT } />;
                }

                return <ProfileCompleteComponent viewer={ data && data.viewer } />;
            } }
        />
    );
};

export default ProfileCompleteContainer;
