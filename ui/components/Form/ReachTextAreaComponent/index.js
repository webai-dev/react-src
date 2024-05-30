import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import RichTextEditor           from 'react-rte';
import styles                   from './styles.scss';
import classNames               from 'classnames/bind';

const cx = classNames.bind(styles);

class ReachTextAreaComponent extends PureComponent {
    state = {
        isLabelActive: this.props.value,
        isInputError: false,
        isInputFocus: false,
        touched: false,
        richTextValue: RichTextEditor.createValueFromString(this.props.value || '', 'markdown')
    };

    /**
     * Set the value of the component, which in turn will validate it and the rest of the form (is required for Formsy
     * to work.)
     *
     * @param {Object} value
     */
    _handleChangeValue = (value) => {
        this.setState({ richTextValue: value });
        const stringValue = value.toString('markdown');
        this.props.setValue((stringValue && stringValue.length === 2) ?
            stringValue.replace(/(^[\s\u200b]*|[\s\u200b]*$)/g, '') :
            stringValue
        );
    };

    /**
     * Handle input styles on input focus
     *
     * @private
     */
    _handleInputFocus = () => {
        this.setState({
            isLabelActive: true,
            isInputError: false,
            isInputFocus: true,
            touched: true,
        });
    };

    /**
     * Handle Input styles on input blur
     *
     * @private
     */
    _handleInputBlur = () => {
        this.setState({
            isLabelActive: this.props.value || '',
            isInputError: this.props.errorMessage || (this.props.required && !this.props.value),
            isInputFocus: false,
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.touched) {
            this.setState({
                isInputError: this.props.errorMessage || (this.props.required && !this.props.value),
                touched: true,
            });
        }
        if (!this.state.isInputFocus && this.state.touched) {
            this.setState({
                isInputError: this.props.errorMessage || (this.props.required && !this.props.value),
            });
        }
        if (nextProps.forceValue && nextProps.forceValue !== this.props.forceValue) {
            this.setState({
                richTextValue: RichTextEditor.createValueFromString(nextProps.forceValue || '', 'markdown')
            });
        }
    }

    render() {
        const { name, errorMessage, className, placeholder } = this.props;
        const { _handleChangeValue, _handleInputFocus, _handleInputBlur } = this;
        const { isLabelActive, isInputError, isInputFocus, richTextValue } = this.state;
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
        return (
            <div
                className={ cx(styles.container, className, {
                    [ styles.containerActive ]: isInputFocus,
                    [ styles.containerLabelActive ]: isLabelActive,
                    [ styles.containerError ]: isInputError,
                }) }
            >
                <div
                    id={ name }
                    className={ styles.inputBox }
                >
                    <RichTextEditor
                        className={ styles.input }
                        value={ richTextValue }
                        onChange={ _handleChangeValue }
                        onFocus={ _handleInputFocus }
                        onBlur={ _handleInputBlur }
                        toolbarConfig={ toolbarConfig }
                        placeholder={ placeholder }
                        name={ name }
                        id={ name }
                    />

                    <span className={ styles.activeLine } />
                </div>
                { errorMessage && <label
                    className={ styles.label }
                    htmlFor={ name }
                >
                    { errorMessage &&
                    <span className={ styles.error }>
                        { errorMessage }
                    </span> }
                </label> }
            </div>
        );
    }
}

// This component assumes you will save value and change it inside some upper component (use "setValue" and "value" for
// that)
ReachTextAreaComponent.propTypes = {
    setValue: PropTypes.func.isRequired, // IMPORTANT save value in upper component (after modifyValueOnChange)
    value: PropTypes.string, // IMPORTANT pass value from upper component
    name: PropTypes.string.isRequired, // IMPORTANT used as id in inputs for labels

    onChange: PropTypes.func, // lunch function on every change and pass corresponding value (after modifyValueOnChange)
    modifyValueOnChange: PropTypes.func, // take value change it and return new value (e.g use it to filter some
                                         // characters)
    errorMessage: PropTypes.string, // will show error string
    touched: PropTypes.bool,
    className: PropTypes.string, // pass additional css class
    placeholder: PropTypes.string,
    forceValue: PropTypes.string,
    required: PropTypes.bool,
};

export default ReachTextAreaComponent;
