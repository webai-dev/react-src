import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import FormsyComponent          from '../../components/formsy/FormsyComponent';
import FormsyInputComponent     from '../../components/formsy/FormsyInputComponent';
import FormsySubmitComponent    from '../../components/formsy/FormsySubmitComponent';
import { toast }                from 'react-toastify';
import { LoginManager }         from '../../../api';
import ButtonComponent, {
    BUTTON_TYPE,
} from '../../components/ButtonComponent';
import {
    ROUTES,
    QUERY_LINKEDIN_ERROR,
} from '../../../constants';
import getQueryParams  from '../../../util/getQueryParams';
import getErrorMessage from '../../../util/getErrorMessage';
import classNames      from 'classnames';
import styles          from './styles.scss';

class SignInView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: getQueryParams(props.location.search)[ QUERY_LINKEDIN_ERROR ] || null,
            isLoading: false,
        };
    }

    handleSubmit = (input) => {
        this.setState({
            error: null,
            isLoading: true,
        });
        LoginManager
            .resetPassword(input.email)
            .then((promise) => {
                return promise.json();
            })
            .then(({ success }) => {
                if (!success) {
                    throw new Error('Such email doesn\'t exist');
                }
                this.setState({ isLoading: false });
                toast.success('We just emailed you a link to reset your password');
            })
            .catch(error => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    error: errorParsed.message,
                });
            });
    };

    render() {
        const { handleSubmit } = this;
        const { isLoading, error } = this.state;
        const formId = 'ResetPasswordFromId';
        return (
            <div className={ styles.box }>
                <h2>
                    Reset password
                </h2>
                <FormsyComponent formId={ formId } onValidSubmit={ handleSubmit } errorMessage={ error }>
                    <FormsyInputComponent
                        name="email"
                        validations="isEmail"
                        validationError="This is not a valid email"
                        placeholder="Email"
                        modifyValueOnChange={ value => value ? value.trim() : value }
                        required
                    />
                </FormsyComponent>
                <FormsySubmitComponent
                    className={ styles.button }
                    formId={ formId }
                    disabled={ isLoading }
                >
                    Reset
                </FormsySubmitComponent>
                <ButtonComponent
                    to={ ROUTES.ROOT }
                    className={ classNames(
                        styles.borderButton,
                        styles.button,
                    ) }
                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                >
                    Back to Login
                </ButtonComponent>
            </div>

        );
    }
}

SignInView.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default SignInView;
