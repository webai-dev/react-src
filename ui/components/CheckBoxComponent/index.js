import React      from 'react';
import styles     from './styles.scss';
import PropTypes  from 'prop-types';
import classNames from 'classnames';
import CheckIcon  from '../../../assets/icons/CheckIcon';

const CheckBoxComponent = (props) => {
    const { name, value, onChange, label, isInnerApp, required, className, dataTest } = props;
    return (
        <div
            className={ classNames(styles.container, className, {
                [ styles.innerAppBox ]: isInnerApp,
            }) }
        >
            <input
                type="checkbox"
                id={ name }
                name={ name }
                value={ value }
                className={ styles.input }
                onChange={ () => {onChange(!value);} }
            />
            <label
                htmlFor={ name }
                className={ styles.labelBox }
            >
                <div
                    className={ classNames(
                        styles.checkBox,
                        {
                            [ styles.checkBoxActive ]: value,
                            [ styles.checkBoxNoText ]: !label,
                        },
                    ) }
                    data-test={ dataTest }
                >
                    <CheckIcon />
                </div>
                { label &&
                <span className={ styles.label }>
                    { label }
                    { required && <span className={ styles.required }>*</span> }
                </span>
                }
            </label>
        </div>
    );
};

CheckBoxComponent.propTypes = {
    name: PropTypes.string.isRequired,
    dataTest: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]), // IMPORTANT pass value from upper component
    onChange: PropTypes.func.isRequired, // TODO rename onChange to setValue
    label: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    isInnerApp: PropTypes.bool,
};

export default CheckBoxComponent;
