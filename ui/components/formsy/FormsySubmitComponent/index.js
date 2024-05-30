import React, { PureComponent } from 'react';
import { KEYS }                 from '../../../../constants';
import ButtonComponent, {
    BUTTON_SIZE,
    BUTTON_TYPE,
}                               from '../../ButtonComponent';
import PropTypes                from 'prop-types';
import classNames               from 'classnames';
import styles                   from './styles.scss';

// NOTE CAN ACCEPT SAME PROPS AS ButtonComponent !
class FormsySubmitComponent extends PureComponent {
    state = {
        isFocused: false,
    };

    handleFocus = () => {
        this.setState({ isFocused: true });
    };
    handleBlur = () => {
        this.setState({ isFocused: false });
    };

    /**
     * Handle form submit on enter
     *
     * @param event
     */
    handleSubmitOnEnter = (event) => {
        if (this.state.isFocused && !this.props.disabled && (event.key === KEYS.ENTER || event.key === KEYS.SPACE)) {
            document.getElementById(this.props.formId)
                .click();
        }
    };

    componentDidMount() {
        document.addEventListener(
            'keydown',
            this.handleSubmitOnEnter,
            false,
        );
    }

    componentWillUnmount() {
        document.removeEventListener(
            'keydown',
            this.handleSubmitOnEnter,
            false,
        );
    }

    render() {
        const { handleFocus, handleBlur } = this;
        const {
            formId,
            children,
            className,
            btnType = BUTTON_TYPE.ACCENT,
            size = BUTTON_SIZE.BIG,
            disabled,
            ...restProp //That should contain only ButtonComponent available props
        } = this.props;

        return (
            <ButtonComponent
                { ...restProp }
                htmlFor={ formId }
                className={ classNames(
                    styles.fixDisplay,
                    className,
                    'formsySubmit'
                ) }
                disabled={ disabled }
                btnType={ btnType }
                size={ size }
                onFocus={ handleFocus }
                onBlur={ handleBlur }
            >
                { children }
            </ButtonComponent>

        );
    }
}

FormsySubmitComponent.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    size: PropTypes.string,
    btnType: PropTypes.string,
    disabled: PropTypes.bool,
    formId: PropTypes.string.isRequired, // pass same id you have passed to FormsyComponent
};

export default FormsySubmitComponent;
