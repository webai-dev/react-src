import React, { Component } from 'react';
import './tabs.scss';
import { Nav }              from 'reactstrap';
import classNames           from 'classnames';

class Tabs extends Component {
    render() {
        const { onChangeTab, activeTab, children, className, tabId, ...other } = this.props;

        return (
            <div className={ classNames(className, 'sourcr-tabs') } { ...other }>
                <Nav>
                    { React.Children.map(children, (child, idx) => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, {
                                isActive: child.props.tabId === activeTab,
                                key: `tab-${ idx }`,
                                onClick: event => {
                                    onChangeTab(child.props.tabId);
                                    event.preventDefault();
                                }
                            });
                        }
                    }) }
                </Nav>
            </div>
        );
    }
}

Tabs.defaultProps = {
    activeTab: undefined,
    children: [],
    className: '',
    onChangeTab: () => {}
};

export default Tabs;
