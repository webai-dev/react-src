import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                         from '../../../components/ButtonComponent';
import CrossIcon                          from '../../../../assets/icons/CrossIcon';
import LinkedIn2Icon                      from '../../../../assets/icons/LinkedIn2Icon';
import ModalComponent                     from '../../../components/ModalComponent';
import CheckBoxComponent                  from '../../../components/CheckBoxComponent';
import FormsyComponent                    from '../../../components/formsy/FormsyComponent';
import FormsySubmitComponent              from '../../../components/formsy/FormsySubmitComponent';
import FormsyInputComponent               from '../../../components/formsy/FormsyInputComponent';
import FormsyHiddenInputComponent         from '../../../components/formsy/FormsyHiddenInputComponent';
import styles                             from './styles.scss';

class EmailComponent extends PureComponent {
    state = {
        isDirector: false,
    };

    /**
     * Will toggle two additional fields if isDirector === false
     *
     * @param {boolean} isDirector
     */
    handleIsDirector = (isDirector) => {
        this.setState({ isDirector });
    };

    render() {
        const {
            showModal,
            handleSubmitAgency,
            handleSubmitRecruiter,
            isAgency,
            id,
            isLoading,
            errors,
            routeToRecruiterProfile,
            routeToRecruiterClaimModal,
        } = this.props;
        const { handleIsDirector } = this;
        const { isDirector } = this.state;

        const formId = 'claimProfileId';

        return (
            <Fragment>
                <ButtonComponent
                    size={ BUTTON_SIZE.BIG }
                    main
                    btnType={ BUTTON_TYPE.ACCENT }
                    to={ routeToRecruiterClaimModal }
                    alt="Claim profile"
                >
                    Claim this profile
                </ButtonComponent>

                { // MODAL
                    showModal &&
                    <ModalComponent linkToClose={ routeToRecruiterProfile }>
                        <ButtonComponent
                            ariaLabel="Go to recruiter profile"
                            btnType={ BUTTON_TYPE.LINK }
                            className={ styles.close }
                            to={ routeToRecruiterProfile }
                        >
                            <CrossIcon />
                        </ButtonComponent>
                        { isAgency ?
                            <FormsyComponent
                                onValidSubmit={ handleSubmitAgency }
                                className={ styles.form }
                                formId={ formId }
                                errorMessage={ errors }
                            >
                            <span className={ styles.title }>
                                Claim Agency Profile
                            </span>
                                <FormsyHiddenInputComponent
                                    name="id"
                                    value={ id }
                                />
                                <CheckBoxComponent
                                    onChange={ handleIsDirector }
                                    name="isDirector"
                                    value={ isDirector }
                                    label="I am the director"
                                />
                                <FormsyInputComponent
                                    small
                                    required
                                    placeholder={ !isDirector ? 'Director first name' : 'First name' }
                                    name="directorFirstName"
                                />
                                <FormsyInputComponent
                                    small
                                    required
                                    placeholder={ !isDirector ? 'Director last name' : 'Last name' }
                                    name="directorLastName"
                                />
                                <FormsyInputComponent
                                    small
                                    required
                                    placeholder="Email address"
                                    name="directorEmail"
                                    validations="isEmail"
                                    modifyValueOnChange={ value => value ? value.trim() : value }
                                    validationError="This is not a valid email"
                                />
                                <FormsyInputComponent
                                    small
                                    required
                                    placeholder="Phone number"
                                    name="phone"
                                />
                                <FormsyInputComponent
                                    small
                                    required
                                    placeholder="LinkedIn URL"
                                    name="linkedinUrl"
                                />
                                {
                                    !isDirector &&
                                    <Fragment>
                                        <FormsyInputComponent
                                            small
                                            required
                                            placeholder="Your name"
                                            name="name"
                                        />
                                        <FormsyInputComponent
                                            small
                                            required
                                            placeholder="Your email"
                                            name="email"
                                            modifyValueOnChange={ value => value ? value.trim() : value }
                                        />
                                    </Fragment>
                                }
                                <FormsySubmitComponent
                                    formId={ formId }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    size={ BUTTON_SIZE.BIG }
                                    disabled={ isLoading }
                                >
                                    Submit for approval
                                </FormsySubmitComponent>
                            </FormsyComponent> :

                            <FormsyComponent
                                onValidSubmit={ handleSubmitRecruiter }
                                className={ styles.form }
                                formId={ formId }
                                errorMessage={ errors }
                            >
                                <span className={ styles.title }>
                                    Claim free profile
                                </span>
                                <div className={ styles.info }>
                                    Claim this profile using your LinkedIn profile...
                                </div>
                                <FormsyInputComponent
                                    small
                                    required
                                    placeholder="LinkedIn URL"
                                    name="linkedinUrl"
                                    validations={ {
                                        isLinkedinUrl: function (values, value) {
                                            return value && (
                                                value.toLowerCase()
                                                    .match(/^((https|http):\/\/)?(www.)?linkedin.com\/(.+)/)
                                            );
                                        }
                                    } }
                                    validationErrors={ {
                                        isLinkedinUrl: 'It is not valid linkedin url'
                                    } }
                                />
                                <FormsySubmitComponent
                                    className={ styles.linkedIn }
                                    formId={ formId }
                                    size={ BUTTON_SIZE.BIG }
                                    disabled={ isLoading }
                                >
                                    <div className={ styles.linkedInIcon }><LinkedIn2Icon /></div>
                                    <span>Sign up with Linkedin</span>
                                </FormsySubmitComponent>
                            </FormsyComponent> }
                    </ModalComponent>
                }
            </Fragment>
        );
    }
}

EmailComponent.propTypes = {
    showModal: PropTypes.bool,
    handleSubmitAgency: PropTypes.func,
    handleSubmitRecruiter: PropTypes.func,
    isAgency: PropTypes.bool,
    isLoading: PropTypes.bool,
    errors: PropTypes.string,
    id: PropTypes.string.isRequired,
    routeToRecruiterProfile: PropTypes.string.isRequired,
    routeToRecruiterClaimModal: PropTypes.string.isRequired,
};

export default EmailComponent;
