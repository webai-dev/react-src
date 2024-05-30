import React                                         from 'react';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../ButtonComponent';
import styles                                        from './styles.scss';
import PropTypes                                     from 'prop-types';
import classNames                                    from 'classnames';

const ToggleYesNoComponent = (props) => {
    const { name, value, setValue, className, disabled, label } = props;
    return (
        <div className={ classNames(className, styles.box) }>
            <div
                className={ classNames(styles.switchBox, { [ styles.disabled ]: disabled }) }
                id={ name }
            >
                <ButtonComponent
                    btnType={ value ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.ACCENT_BORDER }
                    size={ BUTTON_SIZE.BIG }
                    onClick={ () => {setValue(true);} }
                    className={ styles.switchButton }
                >
                    Yes
                </ButtonComponent>
                <ButtonComponent
                    btnType={ !value ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.ACCENT_BORDER }
                    size={ BUTTON_SIZE.BIG }
                    onClick={ () => {setValue(false);} }
                    className={ styles.switchButton }
                >
                    No
                </ButtonComponent>
            </div>
            { label && <span className={ styles.label }>{ label }</span> }
        </div>
    );
};

ToggleYesNoComponent.propTypes = {
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.bool,
    setValue: PropTypes.func.isRequired,
    className: PropTypes.string,
    label: PropTypes.node,
};

export default ToggleYesNoComponent;
