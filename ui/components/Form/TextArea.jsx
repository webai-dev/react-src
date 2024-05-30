import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import RichTextEditor       from 'react-rte';
import './TextArea.scss';

export default class TextArea extends Component {
    static createValueFromString = RichTextEditor.createValueFromString;
    static propTypes = {
        onChange: PropTypes.func,
        initialValue: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            value: RichTextEditor.createValueFromString(props.initialValue || '', 'markdown')
        };
    }

    onChange = value => {
        this.setState({ value });
        if (this.props.onChange) {
            // Send the changes up to the parent component as an HTML string.
            // This is here to demonstrate using `.toString()` but in a real app it
            // would be better to avoid generating a string on each change.
            this.props.onChange(value.toString('markdown'));
        }
    };

    render() {
        // The toolbarConfig object allows you to specify custom buttons, reorder buttons and to add custom css
        // classes.
        // Supported inline styles:
        // https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Inline-Styles.md Supported block
        // types:
        // https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Custom-Block-Render.md#draft-default-block-render-map
        const toolbarConfig = {
            // Optionally specify the groups to display (displayed in the order listed).
            display: [
                'INLINE_STYLE_BUTTONS',
                'BLOCK_TYPE_BUTTONS',
                'LINK_BUTTONS',
                'BLOCK_TYPE_DROPDOWN',
                'HISTORY_BUTTONS'
            ],
            INLINE_STYLE_BUTTONS: [
                { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
                { label: 'Italic', style: 'ITALIC' },
                { label: 'Underline', style: 'UNDERLINE' }
            ],
            BLOCK_TYPE_DROPDOWN: [
                { label: 'Normal', style: 'unstyled' },
                { label: 'Heading Large', style: 'header-one' },
                { label: 'Heading Medium', style: 'header-two' },
                { label: 'Heading Small', style: 'header-three' }
            ],
            BLOCK_TYPE_BUTTONS: [
                { label: 'UL', style: 'unordered-list-item' },
                { label: 'OL', style: 'ordered-list-item' }
            ]
        };
        const { initialValue, id, ...props } = this.props;
        return (
            <div id={ id }>
                <RichTextEditor
                    editorClassName="sourcr-editor"
                    { ...props }
                    value={ this.state.value }
                    onChange={ this.onChange }
                    toolbarConfig={ toolbarConfig }
                />
            </div>
        );
    }
}
