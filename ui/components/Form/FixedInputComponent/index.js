import React      from 'react';
import PropTypes  from 'prop-types';
import styles     from './styles.scss';
import classNames from 'classnames';


const FixedInputComponent = (props) => {
    const {
        value = '',
        label,
        className,
        pre,
        post,
        name,
        multipleLine,
        placeholder,
    } = props;

    return (
        <div
            id={ name }
            className={ classNames(
                styles.container,
                className,
            ) }
        >
            <div
                className={ styles.inputBox }
            >
                { pre && <div className={ styles.pre }>{ pre }</div> }
                <span
                    className={ classNames(styles.input, {
                        [ styles.multipleLine ]: multipleLine,
                        [ styles.placeholder ]: !value
                    }) }
                >
                    { value ? value : placeholder }
                </span>
                { post && <div className={ styles.post }>{ post }</div> }
            </div>
            { label && <div
                className={ styles.label }
            >
                { label }
            </div> }
        </div>
    );
};

FixedInputComponent.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    pre: PropTypes.node, // additional label before input ($    100)
    post: PropTypes.node, // additional label after input (100   $)
    multipleLine: PropTypes.bool,
    placeholder: PropTypes.string,
};

export default FixedInputComponent;
