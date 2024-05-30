import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { withFormsy }       from 'formsy-react';
import styles               from './styles.scss';

class FormsyHiddenInputComponent extends Component {
    componentDidMount() {
        this.props.setValue(this.props.getValue());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.getValue() !== this.props.getValue()) {
            this.props.setValue(this.props.getValue());
        }
    }

    render() {
        const { getErrorMessage, showErrorMessage } = this.props;
        const errorMessage = getErrorMessage();
        if (showErrorMessage && errorMessage) {
            return <span className={ styles.error } id={ name }>
                { errorMessage }
            </span>;
        }
        return <span id={ name } />;
    }
}

FormsyHiddenInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired,
    getErrorMessage: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    showErrorMessage: PropTypes.bool,
};

export default withFormsy(FormsyHiddenInputComponent);
