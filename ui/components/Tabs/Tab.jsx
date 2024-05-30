import React, { Component } from 'react';
import classNames           from 'classnames';
import { NavItem, NavLink } from 'reactstrap';
import RequiresPermission   from '../User/RequiresPermission';

class Tab extends Component {
    render() {
        const { children, roles = [], isActive, onClick, tabId, ...other } = this.props;
        return (
            <RequiresPermission roles={ roles }>
                <NavItem
                    id={ `page-tab-tab-${ tabId }` }
                    className={ classNames({
                        'sourcr-tabs--tab': true,
                        'sourcr-tabs--tab__active': isActive
                    }) }
                    { ...other }>
                    <NavLink
                        onClick={ onClick }
                        href="#"
                    >
                        { children }
                    </NavLink>
                </NavItem>
            </RequiresPermission>
        );
    }
}

export default Tab;
