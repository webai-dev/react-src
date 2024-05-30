import React, { PureComponent }         from 'react';
import PropTypes                        from 'prop-types';
import TEST_IDS                         from '../../../tests/testIds';
import FormsyComponent                  from '../../components/formsy/FormsyComponent';
import FormsyInputComponent             from '../../components/formsy/FormsyInputComponent';
import FormsySubmitComponent            from '../../components/formsy/FormsySubmitComponent';
import ButtonComponent, { BUTTON_TYPE } from '../../components/ButtonComponent';
import getErrorMessage                  from '../../../util/getErrorMessage';
import { LoginManager }                 from '../../../api';
import { toast }                        from 'react-toastify';
import { ROUTES }                       from '../../../constants';
import gtmPush, { GTM_EVENTS }          from '../../../util/gtmPush';
import classNames                       from 'classnames';
import styles                           from './styles.scss';

class SignUpView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoading: false,
        };
    }

    handleSubmit = (input) => {
        this.setState({
            error: null,
            isLoading: true,
        });

        LoginManager
            .register({
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                contactNumber: input.contactNumber,
                whoAmI: 'employer',
                company: {
                    name: input.companyName,
                    contactNumber: input.contactNumber,
                },
            })
            .then(user => {
                gtmPush({
                    event: GTM_EVENTS.SIGN_UP_EMPLOYER,
                    label: input.email,
                });
                this.props.history.replace(ROUTES.DASHBOARD);
                return user;
            })
            .catch(error => {
                const errorParsed = getErrorMessage(
                    error && error.json ?
                        (error.json.errors && [ error.json.errors[ 0 ] ]) : // quick hack fix of server error
                        error,
                );
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
        const formId = 'SignUpFromId';
        return (
            <div className={ styles.box }>
                <h2 className={ styles.title }>
                    Get started with a free account!
                </h2>

                <FormsyComponent
                    formId={ formId }
                    onValidSubmit={ handleSubmit }
                    errorMessage={ error }
                >
                    <span className={ styles.label }>
                        Name <span className={ styles.danger }>*</span>
                    </span>
                    <div className={ styles.nameBox }>
                        <FormsyInputComponent
                            className={ styles.nameInput }
                            name="firstName"
                            placeholder="First"
                            required
                        />
                        <FormsyInputComponent
                            className={ styles.nameInput }
                            name="lastName"
                            placeholder="Last"
                            required
                        />
                    </div>
                    <span className={ styles.label }>
                        Email <span className={ styles.danger }>*</span>
                    </span>
                    <FormsyInputComponent
                        name="email"
                        validations="isEmail"
                        validationError="This is not a valid email"
                        modifyValueOnChange={ value => value ? value.trim() : value }
                        type="text"
                        required
                    />
                    <span className={ styles.label }>
                        Company name <span className={ styles.danger }>*</span>
                    </span>
                    <FormsyInputComponent
                        name="companyName"
                        type="text"
                        required
                    />
                    <span className={ styles.label }>
                        Contact number <span className={ styles.danger }>*</span>
                    </span>
                    <FormsyInputComponent
                        name="contactNumber"
                        type="text"
                        required
                    />
                </FormsyComponent>
                <div className={ styles.buttonBox }>
                    <FormsySubmitComponent
                        dataTest={ TEST_IDS.SIGN_UP }
                        className={ classNames(
                            styles.submit,
                            styles.button,
                        ) }
                        formId={ formId }
                        disabled={ isLoading }
                    >
                        Sign up
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
            </div>

        );
    }
}

SignUpView.propTypes = {
    history: PropTypes.object.isRequired,
};

export default SignUpView;
