import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import { Helmet }                         from 'react-helmet';
import TEST_IDS                           from '../../../tests/testIds';
import FormsyComponent                    from '../../components/formsy/FormsyComponent';
import FormsyInputComponent               from '../../components/formsy/FormsyInputComponent';
import FormsySubmitComponent              from '../../components/formsy/FormsySubmitComponent';
import LinkedIn2Icon                      from '../../../assets/icons/LinkedIn2Icon';
import { toJS }                           from 'mobx';
import { LoginManager }                   from '../../../api';
import ButtonComponent, {
    BUTTON_SIZE,
    BUTTON_TYPE,
}                                         from '../../components/ButtonComponent';
import {
    ROUTES,
    QUERY_LINKEDIN_ERROR,
    QUERY_REDIRECT_SUBSCRIPTION,
}                                         from '../../../constants';
import getQueryParams                     from '../../../util/getQueryParams';
import getErrorMessage                    from '../../../util/getErrorMessage';
import { toast }                          from 'react-toastify';
import styles                             from './styles.scss';

class SignInView extends PureComponent {
    state = {
        error: null,
        isLoading: false,
    };

    handleSubmit = (input) => {
        this.setState({
            error: null,
            isLoading: true,
        });
        LoginManager
            .login(
                input.email,
                input.password,
            )
            .then(user => {
                this.setState({ isLoading: false });
                if (toJS(user)
                    .hasRoles([ 'super_admin' ])) {
                    this.props.history.push(ROUTES.ADMIN_PANEL);

                } else if (toJS(user)
                    .hasRoles([ 'recruiter' ])) {
                    this.props.history.push(
                        getQueryParams(this.props.location.search)[ QUERY_REDIRECT_SUBSCRIPTION._NAME ]
                        === QUERY_REDIRECT_SUBSCRIPTION.SUBSCRIPTION ?
                            ROUTES.SUBSCRIPTION :
                            ROUTES.RECRUITER_PROFILE_EDIT
                    );
                } else {
                    this.props.history.replace(ROUTES.DASHBOARD);
                }
            })
            .catch(error => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    // TODO remove that when BE is fixed
                    error: errorParsed.message === 'Bad credentials' ? 'Incorrect username or password' : errorParsed.message,
                    // error: errorParsed.message, // TODO add that when BE is fixed
                });
            });
    };

    render() {
        const { location } = this.props;
        const { handleSubmit } = this;
        const { isLoading, error } = this.state;
        const formId = 'SignInFromId';

        const linkedInError = getQueryParams(location.search)[ QUERY_LINKEDIN_ERROR ];
        return (
            <Fragment>
                <Helmet />
                <div className={ styles.box }>
                    <h2>
                        Login
                    </h2>
                    <div>
                        New user?&nbsp;
                        <ButtonComponent
                            dataTest={ TEST_IDS.SIGN_UP_INFO_ROUTE }
                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                            size={ BUTTON_SIZE.SMALL }
                            to={ ROUTES.SIGNUP_INFO }
                        >
                            Sign up here
                        </ButtonComponent>
                    </div>
                    <ButtonComponent
                        forceHref
                        to="/login/connect/linkedin"
                        size={ BUTTON_SIZE.BIG }
                        className={ styles.linkedIn }
                    >
                        <div className={ styles.linkedInIcon }><LinkedIn2Icon /></div>
                        <span>Sign in with LinkedIn</span>
                    </ButtonComponent>
                    { linkedInError &&
                    <div className={ styles.error }>
                        We were unable to find a matching account. Click&nbsp;
                        <ButtonComponent
                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                            size={ BUTTON_SIZE.SMALL }
                            to={ ROUTES.SIGNUP_INFO }
                        >
                            here
                        </ButtonComponent> to sign up
                    </div>
                    }
                    <div
                        className={ styles.orBox }
                    >
                        - OR -
                    </div>
                    <FormsyComponent
                        formId={ formId }
                        onValidSubmit={ handleSubmit }
                        errorMessage={ error }
                        className={ styles.form }
                    >
                        <FormsyInputComponent
                            name="email"
                            validations="isEmail"
                            validationError="This is not a valid email"
                            placeholder="Email"
                            modifyValueOnChange={ value => value ? value.trim() : value }
                            required
                        />
                        <FormsyInputComponent
                            name="password"
                            placeholder="Password"
                            type="password"
                            required
                        />
                    </FormsyComponent>
                    <FormsySubmitComponent
                        dataTest={ TEST_IDS.SIGN_IN }
                        className={ styles.submit }
                        formId={ formId }
                        disabled={ isLoading }
                    >
                        Login
                    </FormsySubmitComponent>
                    <ButtonComponent
                        className={ styles.forgot }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                        to={ ROUTES.RESTORE_PASSWORD }
                    >
                        Forgot password?
                    </ButtonComponent>
                </div>
            </Fragment>
        );
    }
}

SignInView.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default SignInView;
