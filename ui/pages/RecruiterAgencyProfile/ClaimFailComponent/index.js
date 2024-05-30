import React, { Fragment }        from 'react';
import PropTypes                  from 'prop-types';
import ErrorComponent             from '../../../components/ErrorComponent';
import FormsyComponent            from '../../../components/formsy/FormsyComponent';
import FormsyInputComponent       from '../../../components/formsy/FormsyInputComponent';
import FormsySubmitComponent      from '../../../components/formsy/FormsySubmitComponent';
import FormsyHiddenInputComponent from '../../../components/formsy/FormsyHiddenInputComponent';
import LoaderComponent            from '../../../components/LoaderComponent';
import ModalComponent             from '../../../components/ModalComponent';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                 from '../../../components/ButtonComponent';
import CrossIcon                  from '../../../../assets/icons/CrossIcon';
import styles                     from './styles.scss';

const ClaimFailComponent = (props) => {
    const {
        handleCloseModal,
        handleContactSupport,
        isLoading,
        errors,
        id,
        error,
        isDataLoading,
    } = props;
    const formId = 'contactSupport';

    return (
        <ModalComponent
            classNameInner={ styles.modal }
            handleClose={ handleCloseModal }
        >
            <ButtonComponent
                ariaLabel="close modal"
                btnType={ BUTTON_TYPE.LINK }
                className={ styles.close }
                onClick={ handleCloseModal }
            >
                <CrossIcon />
            </ButtonComponent>
            { isDataLoading && <LoaderComponent row /> }
            { error && <ErrorComponent error={ error } /> }
            { !error && !isDataLoading && <Fragment>
                <FormsyComponent
                    onValidSubmit={ handleContactSupport }
                    className={ styles.form }
                    formId={ formId }
                    errorMessage={ errors }
                >
                <span className={ styles.title }>
                    We were unable to link your account
                </span>
                    <FormsyHiddenInputComponent
                        required
                        value={ id }
                        name="id"
                    />
                    <FormsyInputComponent
                        small
                        required
                        placeholder="Your first name"
                        name="firstName"
                    />
                    <FormsyInputComponent
                        small
                        required
                        placeholder="Your last name"
                        name="lastName"
                    />
                    <FormsyInputComponent
                        small
                        required
                        placeholder="Your email address"
                        validations="isEmail"
                        validationError="This is not a valid email"
                        name="email"
                        modifyValueOnChange={ value => value ? value.trim() : value }
                    />
                    <FormsyInputComponent
                        small
                        required
                        placeholder="Your company"
                        name="company"
                    />
                    <FormsyInputComponent
                        small
                        required
                        placeholder="LinkedIn URL"
                        name="linkedinUrl"
                        validations="isUrl"
                        validationError="This is not an linkedin url"
                    />
                    <FormsyInputComponent
                        small
                        required
                        placeholder="Your phone number"
                        name="contactNumber"
                    />
                    <FormsySubmitComponent
                        formId={ formId }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                        disabled={ isLoading }
                    >
                        Contact support
                    </FormsySubmitComponent>
                </FormsyComponent>
            </Fragment> }
        </ModalComponent>
    );
};

ClaimFailComponent.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    handleContactSupport: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    errors: PropTypes.string,
    id: PropTypes.string,
    error: PropTypes.object,
    isDataLoading: PropTypes.bool,
};

export default ClaimFailComponent;
