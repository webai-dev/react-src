import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import classNames           from 'classnames';
import './Card.scss';

export class Card extends Component {
    static propTypes = {
        tag: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ])
    };

    static defaultProps = {
        tag: 'div'
    };

    render() {
        const { tag: Tag, children, className } = this.props;
        return (
            <Tag className={ classNames('card', className) }>
                { children }
            </Tag>
        );
    }
}
