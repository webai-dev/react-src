import React, { Component }   from 'react';
import PropTypes              from 'prop-types';
import classNames             from 'classnames';
import { Table as BaseTable } from 'reactstrap';
import './Table.scss';

class Table extends Component {
    static propTypes = {
        tag: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]),
        type: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired
    };

    static defaultProps = {
        tag: BaseTable,
        type: 'generic'
    };

    render() {
        const { tag: Tag, children, type } = this.props;
        return (
            <Tag className={ classNames('card-table', `${ type }--table`) }>
                <tbody>
                { React.Children.map(children, (child, idx) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, {
                            key: `row-${ idx }`,
                            type: type
                        });
                    }
                }) }
                </tbody>
            </Tag>
        );
    }
}

export default Table;
