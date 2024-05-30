import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import classNames           from 'classnames';
import { Card }             from '../Card';

class TableRow extends Component {
    static propTypes = {
        tag: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
        className: PropTypes.string,
        onClick: PropTypes.func,
        type: PropTypes.string
    };

    static defaultProps = {
        tag: Card
    };

    render() {
        const { tag: RowTag, children, type, className } = this.props;
        return (
            <RowTag
                className={ classNames(className, `${ type }-table--row`) }
                tag="tr"
            >
                { React.Children.map(children, (child, idx) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, {
                            key: `cell-${ idx }`,
                            type: type
                        });
                    }
                }) }
            </RowTag>
        );
    }
}

export default TableRow;
