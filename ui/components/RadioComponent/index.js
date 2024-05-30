import React      from 'react';
import styles     from './styles.scss';
import PropTypes  from 'prop-types';
import classNames from 'classnames';

const RadioComponent = (props) => {
    const { name, value, onChange, label, big, className } = props;
    return (
        <div className={ classNames(className, styles.box, { [styles.boxBig]: big } ) }>
            <input
                type="checkbox"
                id={ label }
                name={ name }
                value={ value }
                className={ styles.input }
                onChange={ onChange }
            />
            <label
                htmlFor={ label }
                className={ classNames(
                    styles.labelBox,
                    {
                        [styles.labelBoxActive]: !!value,
                    },
                ) }
            >
                <div className={ styles.radio } />
                <span className={ styles.label }>{ label }</span>
            </label>
        </div>
    );
};

RadioComponent.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.bool,
    big: PropTypes.bool, // will make input looks bigger
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default RadioComponent;
