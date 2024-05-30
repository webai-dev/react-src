import React      from 'react';
import PropTypes  from 'prop-types';
import { Link }   from 'react-router-dom';
import classNames from 'classnames/bind';
import styles     from './styles.scss';

const cx = classNames.bind(styles);

export const BUTTON_SIZE = {
    SMALL: 'small',
    DEFAULT: 'medium',
    BIG: 'big',
};

export const BUTTON_TYPE = {
    ACCENT: 'accent',
    DEFAULT: 'default',
    LINK: 'link',
    LINK_ACCENT: 'linkAccent',
    ACCENT_BORDER: 'accentBorder',
    BORDER: 'border',
    UNDERLINE: 'underline',
    ICON: 'icon',
    WHITE: 'white',
};

const ButtonComponent = (props) => {
    const {
        htmlFor, // don't pass htmlFor and to at once
        to, // don't pass htmlFor and to at once
        className = '',
        children,
        id,
        onClick,
        disabled,
        type = 'button',
        ariaLabel, // Use this to describe button when button have no text (for screen readers)
        size = BUTTON_SIZE.DEFAULT,
        btnType = BUTTON_TYPE.DEFAULT,
        main,
        target,
        rel,
        forceHref = false,
        stopPropagation,
        onAction,
        onFocus,
        onBlur,
        dataTest,
        download,
        itemProp,
        style,
    } = props;

    const isHref = forceHref || /^mailto/.test(to) || /^https?:\/\//.test(to);

    const Component = htmlFor ? 'label' : to ? isHref ? 'a' : Link : 'button';
    const restProps = htmlFor ? {
        htmlFor,
        tabIndex: '0',
    } : to ? isHref ? {
        role: 'button',
        href: to,
        target,
        rel,
        download
    } : {
        role: 'button',
        to,
        target,
        rel,
        download
    } : { type };
    const onClickFinal = stopPropagation ? onClick ?
        (e) => {
            e.stopPropagation();
            if (onAction) {
                onAction(e);
            }
            onClick(e);
        } :
        (e) => {
            e.stopPropagation();
            if (onAction) {
                onAction(e);
            }
        } :
        (e) => {
            if (onAction) {
                onAction(e);
            }
            if (onClick) {
                onClick(e);
            }
        };

    return (
        <Component
            id={ id }
            className={ cx(
                className,
                styles.button,
                styles[ btnType ],
                styles[ size ],
                {
                    [ styles.buttonDisabled ]: disabled,
                    [ styles.main ]: main,
                },
            ) }
            aria-label={ ariaLabel }
            onClick={ onClickFinal }
            onFocus={ onFocus }
            onBlur={ onBlur }
            itemProp={ itemProp }
            data-test={ dataTest }
            style={ style }
            { ...disabled && { tabIndex: -1 } } // prevent handle button action from keyboard (make it not focusable)
            { ...restProps }
        >
            { children }
        </Component>
    );
};

ButtonComponent.propTypes = {
    htmlFor: PropTypes.string, // don't pass htmlFor and to at once
    to: PropTypes.string, // don't pass htmlFor and to at once
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    id: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    main: PropTypes.bool,
    stopPropagation: PropTypes.bool,
    type: PropTypes.string,
    target: PropTypes.string,
    rel: PropTypes.string,
    dataTest: PropTypes.string, // data-test attribute for button. Will be used only on for testing
    forceHref: PropTypes.bool,
    ariaLabel: PropTypes.string, // Use this to describe button when button have no text (for screen readers)
    size: PropTypes.oneOf([
        BUTTON_SIZE.SMALL,
        BUTTON_SIZE.DEFAULT,
        BUTTON_SIZE.BIG,
    ]),
    btnType: PropTypes.oneOf([
        BUTTON_TYPE.ACCENT,
        BUTTON_TYPE.DEFAULT,
        BUTTON_TYPE.LINK,
        BUTTON_TYPE.LINK_ACCENT,
        BUTTON_TYPE.ACCENT_BORDER,
        BUTTON_TYPE.ICON,
        BUTTON_TYPE.LINK,
        BUTTON_TYPE.UNDERLINE,
        BUTTON_TYPE.WHITE,
        BUTTON_TYPE.BORDER,
    ]),
    onAction: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    download: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    itemProp: PropTypes.string,
    style: PropTypes.object,
};

export default ButtonComponent;
