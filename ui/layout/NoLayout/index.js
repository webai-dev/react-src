import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';


class NoLayout extends PureComponent {
    render() {
        const { children } = this.props;

        return (
            <div>
                { children }
            </div>
        );
    }
}

NoLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default NoLayout;
