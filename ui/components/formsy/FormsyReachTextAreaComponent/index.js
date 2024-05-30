import React, { Component }   from 'react';
import PropTypes              from 'prop-types';
import { withFormsy }         from 'formsy-react';
import ReachTextAreaComponent from '../../Form/ReachTextAreaComponent';

class FormsyReachTextAreaComponent extends Component {
    state = {
        forceValue: null
    };

    setValueWithUnderLine = (value) => {
        this.props.setValue(value ? value.replace(/\+\+(.*?)\+\+/g, '<u>$1</u>') : value);
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.forceValue && (nextProps.forceValue !== this.props.forceValue)) {
            this.setValueWithUnderLine(nextProps.forceValue);
            this.setState({ forceValue: nextProps.forceValue });
        } else {
            this.setState({ forceValue: null });
        }
    }

    render() {
        const { setValueWithUnderLine } = this;
        const {
            getValue,
            getErrorMessage,
            name,
            required,
            className,
            placeholder,
            isFormSubmitted,
        } = this.props;
        const { forceValue } = this.state;
        const value = getValue();
        const errorMessage = getErrorMessage();

        return (
            <ReachTextAreaComponent
                name={ name }
                value={ value }
                forceValue={ forceValue }
                setValue={ setValueWithUnderLine }
                placeholder={ placeholder }
                required={ required }
                touched={ isFormSubmitted() }
                className={ className }
                errorMessage={ errorMessage }
            />
        );
    }
}

FormsyReachTextAreaComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    validations: PropTypes.oneOfType([ // used in withFormsy
        PropTypes.string,
        PropTypes.object,
    ]),
    validationError: PropTypes.oneOfType([ // used in withFormsy
        PropTypes.string,
        PropTypes.object,
    ]),
    required: PropTypes.bool,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    forceValue: PropTypes.string,
};

export default withFormsy(FormsyReachTextAreaComponent);
