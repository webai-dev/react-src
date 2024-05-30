import React, { PureComponent }        from 'react';
import PropTypes                       from 'prop-types';
import FixedInputComponent             from '../../Form/FixedInputComponent';
import { withFormsy }                  from 'formsy-react';

class FormsyFixedInputComponent extends PureComponent {
    componentDidMount() {
        this.props.setValue(this.props.getValue());
    }
    render() {
        const { value, label, className, pre, post } = this.props;
        return <FixedInputComponent
            value={ value }
            className={ className }
            label={ label }
            pre={ pre }
            post={ post }
        />;
    }
}

FormsyFixedInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    pre: PropTypes.node, // additional label before input ($    100)
    post: PropTypes.node, // additional label after input (100   $)
};

export default withFormsy(FormsyFixedInputComponent);
