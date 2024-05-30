import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import classNames           from 'classnames';

import './TableCell.scss';

class TableCell extends Component {
    static propTypes = {
        tag: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]),
        className: PropTypes.string,
        align: PropTypes.oneOf([ 'left', 'center', 'right' ]),
        valign: PropTypes.oneOf([ 'top', 'center', 'bottom' ]),
        name: PropTypes.string.isRequired
    };

    static defaultProps = {
        tag: 'td',
        className: '',
        align: 'left',
        valign: 'top',
        name: 'generic'
    };

    render() {
        const {
            tag: CellTag,
            className,
            align,
            name,
            type,
            valign,
            children,
            ...otherProps
        } = this.props;
        let alignment = align;
        let verticalAlignment = valign;

        if (name === 'actions') {
            // Action columns always appear center right
            verticalAlignment = 'center';
            alignment = 'right';
        }

        const cellClasses = classNames(
            className,
            'table--cell',
            {
                'table--cell__align_center': alignment === 'center',
                'table--cell__align_right': alignment === 'right',
                'table--cell__valign_center': verticalAlignment === 'center',
                'table--cell__valign_bottom': verticalAlignment === 'bottom'
            },
            `${ type }-table--cell--${ name }`
        );

        return (
            <CellTag
                className={ cellClasses } { ...otherProps }
                data-name={ name }
            >
                { children }
            </CellTag>
        );
    }
}

export default TableCell;
