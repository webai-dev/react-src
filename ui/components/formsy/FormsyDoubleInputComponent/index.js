import React, { Fragment }  from 'react';
import FormsyInputComponent from '../FormsyInputComponent';
import PropTypes            from 'prop-types';
import classNames           from 'classnames';
import styles               from './styles.scss';

const FormsyDoubleInputComponent = (props) => {
    const { firstInput, secondInput, label, required } = props;
    return (
        <div className={ styles.doubleInputBox }>
            <div className={ styles.doubleInput }>
                <FormsyInputComponent
                    { ...firstInput }
                    required={ required }
                    label=""
                    className={ classNames(
                        styles.inputDoubleInput,
                        firstInput.className,
                    ) }
                />
                { secondInput &&
                <Fragment>
                    <span className={ styles.doubleInputDivide }>
                        &nbsp;-&nbsp;
                    </span>
                    <FormsyInputComponent
                        { ...secondInput }
                        required={ required }
                        label=""
                        className={ classNames(
                            styles.inputDoubleInput,
                            secondInput.className,
                        ) }
                    />
                </Fragment> }
            </div>
            { label &&
            <span className={ styles.label }>
                { label }
                { required && <span className={ styles.required }>*</span> }
            </span> }
        </div>);
};

FormsyDoubleInputComponent.propTypes = {
    firstInput: PropTypes.object.isRequired,
    secondInput: PropTypes.object,
    label: PropTypes.string,
    required: PropTypes.bool,
};

export default FormsyDoubleInputComponent;
