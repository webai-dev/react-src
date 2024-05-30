import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames';
import styles                   from './styles.scss';

class DropDownComponent extends PureComponent {
    state = {
        isFocused: false,
        preventBlur: false,
    };

    /**
     * Set isFocused flag when focus or blur dropdown
     *
     * @param {boolean} isFocused
     */
    handleFocus = (isFocused) => {
        if (this.state.preventBlur) { // This will prevent from blur when notHideOnSelectClick === true
            this.setState({ preventBlur: false });
            return;
        }
        this.setState({ isFocused });
        if (isFocused && this.props.onFocus) {
            this.props.onFocus();
        }
        if (!isFocused && this.props.onBlur) {
            this.props.onBlur();
        }
    };
    // /**
    //  * Close dropdown if it is opened and user click on dropdown again
    //  */
    handleBlurOnSecondClick = () => {
        if (this.state.isFocused) {
            setTimeout(() => {
                this.ref.blur();
            }, 10);
        }
    };

    render() {
        const { isFocused } = this.state;
        const { handleFocus, handleBlurOnSecondClick } = this;
        const {
            className,
            selectVisibleClassName,
            selectClassName,
            select,
            labelClassName,
            label,
            notHideOnSelectClick,
            ariaLabel = 'dropdown',
            isActive,
            isLabelFocusable,
            labelId,
            dataTest,
        } = this.props;
        // If notHideOnSelectClick === false dropDown will be hide on ANY browser action inside select (mouse or
        // keyboard)
        const selectProps = notHideOnSelectClick ? {
            onMouseDown: () => {
                this.setState({ preventBlur: true });
            },
        } : {
            onMouseDown: (e) => {
                e.preventDefault();
            },
            onClick: () => {
                handleFocus(false);
                this.ref.blur();
            }
        };
        const LabelTag = isLabelFocusable ? 'div' : 'label';
        const labelProps = isLabelFocusable ? {} : { tabIndex: '0' };
        return (
            <div
                className={ classNames(
                    styles.box,
                    className,
                ) }
                onFocus={ () => {handleFocus(true);} }
                onBlur={ () => {handleFocus(false);} }
                aria-label={ ariaLabel }
            >
                <LabelTag
                    data-test={ dataTest }
                    ref={ (ref) => {this.ref = ref;} }
                    className={ classNames(styles.label, labelClassName) }
                    onMouseDown={ handleBlurOnSecondClick }
                    { ...labelProps }
                    id={ labelId }
                >
                    { label }
                </LabelTag>
                { select && <div
                    className={ classNames(
                        styles.select,
                        selectClassName,
                        {
                            [ styles.selectVisible ]: isActive || isFocused,
                            [ selectVisibleClassName ]: selectVisibleClassName && (isActive || isFocused),
                        },
                    ) }
                    { ...selectProps }
                >
                    { select }
                </div> }
            </div>
        );
    }
}

DropDownComponent.propTypes = {
    notHideOnSelectClick: PropTypes.bool,
    className: PropTypes.string,
    label: PropTypes.element.isRequired, // HAST TO BE ACTIVE ELEMENT e.g <button> or <a>
    selectClassName: PropTypes.string,
    labelId: PropTypes.string,
    selectVisibleClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    ariaLabel: PropTypes.string,
    dataTest: PropTypes.string,
    select: PropTypes.element,
    isActive: PropTypes.bool, // allows to show dropdown constantly helpful for adding styles
    isLabelFocusable: PropTypes.bool, // pass true if label is input or button it will improve UX
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
};

export default DropDownComponent;
