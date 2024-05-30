import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import { BUTTON_SIZE, BUTTON_TYPE } from '../../../ButtonComponent';
import FormsyInputComponent         from '../../../formsy/FormsyInputComponent';
import FormsyComponent              from '../../../formsy/FormsyComponent';
import FormsySubmitComponent        from '../../../formsy/FormsySubmitComponent';
import FormsyHiddenInputComponent   from '../../../formsy/FormsyHiddenInputComponent';
import styles                       from './styles.scss';

class QuickInviteComponent extends PureComponent {
    render() {
        const { handleSubmit, errors, isLoading, id, teamMember, invited } = this.props;
        const formId = id;

        return (
            <FormsyComponent
                onValidSubmit={ handleSubmit }
                formId={ formId }
                errorMessage={ errors }
            >
                <div className={ styles.form }>
                    <FormsyHiddenInputComponent
                        value={ teamMember.id }
                        name="id"
                    />
                    <FormsyInputComponent
                        className={ styles.inviteInput }
                        name="firstName"
                        label="First Name"
                        value={ teamMember.firstName }
                        disabled={ invited }
                        required
                    />
                    <FormsyInputComponent
                        className={ styles.inviteInput }
                        name="lastName"
                        label="Last Name"
                        value={ teamMember.lastName }
                        disabled={ invited }
                        required
                    />
                    <FormsyInputComponent
                        className={ styles.inviteInput }
                        name="email"
                        label="Email"
                        value={ teamMember.email }
                        disabled={ invited }
                        required
                        validations="isEmail"
                        validationError="This is not a valid email"
                        modifyValueOnChange={ value => value ? value.trim() : value }
                    />
                    <div className={ styles.submitBox }>
                        { !invited ? <FormsySubmitComponent
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                            disabled={ isLoading }
                        >
                            Invite
                        </FormsySubmitComponent> : <span className={ styles.invited }>Invited</span> }
                    </div>
                </div>
            </FormsyComponent>
        );
    }
}

QuickInviteComponent.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    errors: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]),
    isLoading: PropTypes.bool,
    invited: PropTypes.bool,
    id: PropTypes.string.isRequired,
    teamMember: PropTypes.object.isRequired
};

export default QuickInviteComponent;
