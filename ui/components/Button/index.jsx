import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import classNames           from 'classnames';
import {
    Button as BaseButton, ButtonGroup as BaseButtonGroup,
    UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
}                           from 'reactstrap';
import RequiresPermission   from '../User/RequiresPermission';
import FontAwesomeIcon      from '@fortawesome/react-fontawesome';
import SpinnerIcon          from '@fortawesome/fontawesome-free-solid/faSpinner';
import styles               from './styles.scss';

export const BUTTON_SIZE = {
    BIG: 'big',
    SMALL: 'small',
};

export class Button extends Component {
    static propTypes = {
        action: PropTypes.oneOf([
            'generic',
            'remove',
            'add',
            'view',
            'create',
            'filter',
        ]),
        buttonSize: PropTypes.oneOf([
            BUTTON_SIZE.BIG,
            BUTTON_SIZE.SMALL,
        ])
    };

    static defaultProps = {
        action: 'generic',
    };

    render() {
        const {
            buttonSize, children, action, disabled, roles = [], loading = false, className, color = 'pink', ...props
        } = this.props;
        return (
            <RequiresPermission roles={ roles }>
                <BaseButton
                    className={ classNames(
                        className,
                        `btn__action-${ action }`,
                        {
                            btn__loading: loading,
                            [ styles.btnSmall ]: buttonSize === BUTTON_SIZE.SMALL,
                            [ styles.btnBig ]: buttonSize === BUTTON_SIZE.BIG,
                        },
                    ) }
                    color={ color }
                    { ...props }
                    disabled={ disabled || loading }
                >
                    { loading && <FontAwesomeIcon
                        spin
                        icon={ SpinnerIcon }
                    /> }
                    { children }
                </BaseButton>
            </RequiresPermission>
        );
    }
}

export const ButtonGroup = ({ children, ...props }) =>
    <div { ...props }>{ children }</div>;
export const DropdownButton = ({ title = 'Actions', children, ...props }) => {
    return (
        <UncontrolledButtonDropdown>
            <DropdownToggle
                color={ 'info' }
                caret
            >
                { title }
            </DropdownToggle>
            <DropdownMenu>
                { React.Children.map(
                    children,
                    it => {
                        if (it) {
                            return (
                                <RequiresPermission roles={ it.props.roles || [] }>
                                    <DropdownItem { ...it.props } />
                                </RequiresPermission>
                            );
                        } else {
                            return null;
                        }
                    },
                ) }
            </DropdownMenu>
        </UncontrolledButtonDropdown>
    );
};
