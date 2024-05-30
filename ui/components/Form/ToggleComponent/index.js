import React      from 'react';
import styles     from './styles.scss';
import PropTypes  from 'prop-types';
import classNames from 'classnames';

const ToggleComponent = (props) => {
    const { name, value, onChange, label, big, column, className, disabled } = props;
    return (
        <div
            className={ classNames(className, styles.box, {
                    [ styles.boxBig ]: big,
                    [ styles.boxColumn ]: column,
                    [ styles.boxDisabled ]: disabled
                }
            ) }
        >
            <input
                type="checkbox"
                id={ name }
                name={ name }
                value={ value }
                className={ styles.input }
                onChange={ onChange }
            />
            <label
                htmlFor={ name }
                className={ classNames(
                    styles.labelBox,
                    {
                        [ styles.labelBoxActive ]: !!value,
                    },
                ) }
            >
                <div className={ styles.radio } />
                { label && <span className={ styles.label }>{ label }</span> }
            </label>
        </div>
    );
};

ToggleComponent.propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.bool,
    big: PropTypes.bool, // will make input looks bigger
    column: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    className: PropTypes.string,
};

export default ToggleComponent;
