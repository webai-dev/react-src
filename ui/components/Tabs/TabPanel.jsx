import React, { Component } from 'react';
import classNames           from 'classnames';

class TabPanel extends Component {
    render() {
        const { children, isActive, withBg = true, tabId, className, ...other } = this.props;
        return (
            <div
                id={ `page-tab-panel-${ tabId }` }
                className={ classNames(className, {
                    'sourcr-tabs--panel': true,
                    'sourcr-tabs--panel__active': isActive,
                    'sourcr-tabs--panel__with_bg': withBg
                }) }
                { ...other }>
                { children }
            </div>
        );
    }
}

export default TabPanel;
