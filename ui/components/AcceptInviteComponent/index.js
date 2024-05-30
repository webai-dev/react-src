import React, { Component }             from 'react';
import PropTypes                        from 'prop-types';
import Cross2Icon                       from '../../../assets/icons/Cross2Icon';
import ButtonComponent, { BUTTON_TYPE } from '../ButtonComponent';
import styles                           from '../EditEmailContainer/EditEmailComponent/styles.scss';
import CheckBoxComponent                from '../CheckBoxComponent';
import ModalComponent                   from '../ModalComponent';

class AcceptInviteComponent extends Component {
    state = {
        termsAgreed: false,
    };

    static defaultProps = {
        onApplyRequested: () => {},
    };

    onChangeTerms = () => {
        this.setState(state => {
            return { termsAgreed: !state.termsAgreed };
        });
    };

    render() {
        const { job, onApplyRequested, close } = this.props;

        return (
            <ModalComponent
                handleClose={ close }
            >
                <ButtonComponent
                    ariaLabel="close modal"
                    btnType={ BUTTON_TYPE.LINK }
                    className={ styles.close }
                    onClick={ close }
                >
                    <Cross2Icon />
                </ButtonComponent>
                <div className={ styles.form }>
                    <h2 className={ styles.title }>
                        Accept invite
                    </h2>
                    <CheckBoxComponent
                        name="terms"
                        onChange={ this.onChangeTerms }
                        value={ this.state.termsAgreed }
                        label="I AGREE TO THE TERMS & CONDITIONS AND PRIVACY POLICY"
                    />
                    <ButtonComponent
                        className={ styles.button }
                        disabled={ this.state.termsAgreed === false }
                        btnType={ BUTTON_TYPE.ACCENT }
                        onClick={ () => onApplyRequested(
                            job,
                            this.state,
                        ) }
                    >
                        Accept
                    </ButtonComponent>
                </div>
            </ModalComponent>
        );
    }
}

AcceptInviteComponent.propTypes = {
    job: PropTypes.object,
    onApplyRequested: PropTypes.func.isRequired,
    close: PropTypes.func,
};

export default AcceptInviteComponent;
