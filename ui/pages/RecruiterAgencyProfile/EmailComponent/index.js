import React, { Fragment }     from 'react';
import PropTypes               from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                              from '../../../components/ButtonComponent';
import PlaneIcon               from '../../../../assets/icons/PlaneIcon';
import CrossIcon               from '../../../../assets/icons/CrossIcon';
import ModalComponent          from '../../../components/ModalComponent';
import FormsyComponent         from '../../../components/formsy/FormsyComponent';
import FormsySubmitComponent   from '../../../components/formsy/FormsySubmitComponent';
import FormsyInputComponent    from '../../../components/formsy/FormsyInputComponent';
import FormsyTextAreaComponent from '../../../components/formsy/FormsyTextAreaComponent';
import styles                  from './styles.scss';

const EmailComponent = (props) => {
    const { handleSendEmail, showModal, name, routeToRecruiterContactModal, routeToRecruiterProfile } = props;
    const formId = 'EmailTo';

    return (
        <Fragment>
            <ButtonComponent
                className={ styles.planeButton }
                btnType={ BUTTON_TYPE.LINK_ACCENT }
                size={ BUTTON_SIZE.SMALL }
                to={ routeToRecruiterContactModal }
                alt={ `Contact with ${ name }` }
            >
                <PlaneIcon />
                &nbsp;Email&nbsp;{ name }
            </ButtonComponent>
            { showModal &&
            <ModalComponent linkToClose={ routeToRecruiterProfile }>
                <ButtonComponent
                    ariaLabel="Go to recruiter profile"
                    btnType={ BUTTON_TYPE.LINK }
                    className={ styles.close }
                    to={ routeToRecruiterProfile }
                >
                    <CrossIcon />
                </ButtonComponent>
                <FormsyComponent
                    onValidSubmit={ handleSendEmail }
                    className={ styles.form }
                    formId={ formId }
                >
                    <span className={ styles.title }>
                        Email { name }
                    </span>
                    <FormsyInputComponent
                        small
                        required
                        placeholder="Your name"
                        name="name"
                    />
                    <FormsyInputComponent
                        small
                        required
                        placeholder="Your email address"
                        name="email"
                        modifyValueOnChange={ value => value ? value.trim() : value }
                    />
                    <FormsyInputComponent
                        small
                        required
                        placeholder="Your phone number"
                        name="phone"
                    />
                    <FormsyInputComponent
                        small
                        required
                        placeholder="Subject"
                        name="subject"
                    />
                    <FormsyTextAreaComponent
                        transparent
                        required
                        placeholder="Your message"
                        name="message"
                    />
                    <FormsySubmitComponent
                        formId={ formId }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                    >
                        Send Message
                    </FormsySubmitComponent>
                </FormsyComponent>
            </ModalComponent> }
        </Fragment>
    );
};

EmailComponent.propTypes = {
    routeToRecruiterContactModal: PropTypes.string.isRequired,
    routeToRecruiterProfile: PropTypes.string.isRequired,
    handleSendEmail: PropTypes.func.isRequired,
    showModal: PropTypes.bool,
    name: PropTypes.string.isRequired,
};

export default EmailComponent;
