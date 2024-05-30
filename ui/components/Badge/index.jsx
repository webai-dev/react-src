import React                  from 'react';
import classNames             from 'classnames';
import { Badge as BaseBadge } from 'reactstrap';
import './Badge.scss';

export const Badge = (props) => {
    const { className, pink = false, pill = true, children, ...restProps } = props;
    return (
        <BaseBadge
            className={ classNames(className, { 'badge-pink': pink }) } { ...restProps }
            pill={ pill }
        >
            { children }
        </BaseBadge>
    );
};

export default Badge;
