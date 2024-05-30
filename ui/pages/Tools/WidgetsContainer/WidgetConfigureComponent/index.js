import React, {
    PureComponent,
    Fragment,
}                                           from 'react';
import PropTypes                            from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                           from '../../../../components/ButtonComponent';
import RequiresPermission                   from '../../../../components/User/RequiresPermission';
import WidgetContainer                      from '../../../../components/WidgetContainer';
import TextAreaComponent                    from '../../../../components/Form/TextAreaComponent';
import ToggleYesNoComponent                 from '../../../../components/Form/ToggleYesNoComponent';
import SendCodeContainer                    from '../SendCodeContainer';
import SelectNodesContainer, { NODE_TYPES } from '../../SelectNodesContainer';
import { toast }                            from 'react-toastify';
import {
    WIDGET_THEME,
    WIDGET_TYPE,
    WIDGET_VARS,
}                                           from '../../../../../constants';
import { floatCode, carouselCode }          from '../../../../../widget/widgetCode';
import classNames                           from 'classnames';
import styles                               from './styles.scss';

class WidgetConfigureComponent extends PureComponent {
    state = {
        theme: WIDGET_THEME.LIGHT,
        isGoogleSnippets: false,
        selectedReviews: null,
    };

    /**
     * Add or remove reviewId from selected reviews. If reviewId null remove all selectedReviews
     *
     * @param {string} [reviewId]
     */
    handleSelectReviews = (reviewId) => {
        const selectedReviewsNew = this.state.selectedReviews || [];
        if (!reviewId) {
            this.setState({
                selectedReviews: null,
            });
        } else if (selectedReviewsNew.includes(reviewId)) {
            this.setState({
                selectedReviews: selectedReviewsNew.filter(id => id !== reviewId),
            });
        } else {
            this.setState({
                selectedReviews: [ ...selectedReviewsNew, reviewId ],
            });
        }
    };

    /**
     * Set theme state - that will change appearance of carouselBox
     *
     * @param theme
     */
    handleThemeSelect = (theme) => {
        this.setState({
            theme,
        });
    };

    /**
     * Enable google snippets for widget
     */
    handleToggleGoogleSnippets = (isGoogleSnippets) => {
        this.setState({
            isGoogleSnippets,
        });
    };

    /**
     * Copy text from textarea - select textarea using id, focus, select and lunch copy command
     */
    handleCopyText = (id) => {
        const copyTextarea = document.querySelector(`#${ id }`);
        copyTextarea.focus();
        copyTextarea.select();
        document.execCommand('copy');
        toast.success('Copied to clipboard');
    };

    render() {
        const { handleThemeSelect, handleCopyText, handleSelectReviews, handleToggleGoogleSnippets } = this;
        const { slug, hasReviews, type, isFreelancer } = this.props;
        const { theme, selectedReviews, isGoogleSnippets } = this.state;

        const newWidgetCodeFloat = floatCode
            .replace(WIDGET_VARS, `{slug: '${ slug }', type: '${ type }', theme: '${ theme }', ids: [${
                selectedReviews ? selectedReviews.map(id => `"${ id }"`)
                    .join(', ') : ''
                }], isFreelancer: ${ isFreelancer }, isGoogleSnippets: ${ isGoogleSnippets }}`);

        const newWidgetCodeCarousel = carouselCode
            .replace(WIDGET_VARS, `{slug: '${ slug }', type: '${ type }', theme: '${ theme }', ids: [${
                selectedReviews ? selectedReviews.map(id => `"${ id }"`)
                    .join(', ') : ''
                }], isFreelancer: ${ isFreelancer }, isGoogleSnippets: ${ isGoogleSnippets }}`);
        const code = (type === WIDGET_TYPE.SINGLE || type === WIDGET_TYPE.DOUBLE) ?
            newWidgetCodeCarousel :
            newWidgetCodeFloat;

        return (
            <Fragment>
                { !hasReviews ?
                    <div className={ styles.box }>You have no reviews to share</div> :
                    <div className={ styles.box }>
                        <div className={ styles.col }>
                            <h2>{ {
                                [ WIDGET_TYPE.SINGLE ]: 'Carousel 1',
                                [ WIDGET_TYPE.DOUBLE ]: 'Carousel 2',
                                [ WIDGET_TYPE.ASIDE ]: 'Pinned Left',
                                [ WIDGET_TYPE.FOOTER ]: 'Footer bar',
                            }[ type ] }
                                { WIDGET_TYPE.DOUBLE === type && <span className={ styles.scaleSpan }>
                                    { ' ' }image displayed is { styles.scale * 100 }% scale
                                </span> }
                            </h2>
                            <WidgetContainer
                                className={ classNames(styles.widget, { [ styles.widgetDouble ]: type === WIDGET_TYPE.DOUBLE }) }
                                isFreelancer={ isFreelancer }
                                theme={ theme }
                                slug={ slug }
                                type={ type }
                                ids={ selectedReviews }
                                isApp
                            />
                        </div>

                        <div className={ styles.col }>
                            <h2>Configuration</h2>
                            <div className={ styles.customizeBox }>
                                <div className={ styles.customize }>
                                    <b>
                                        Choose Theme
                                    </b>

                                    <div className={ classNames(styles.switchBox, styles.marginTop) }>
                                        <ButtonComponent
                                            btnType={ theme === WIDGET_THEME.LIGHT ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.ACCENT_BORDER }
                                            size={ BUTTON_SIZE.BIG }
                                            onClick={ () => {handleThemeSelect(WIDGET_THEME.LIGHT);} }
                                            className={ styles.switchButton }
                                        >
                                            { WIDGET_THEME.LIGHT }
                                        </ButtonComponent>
                                        <ButtonComponent
                                            btnType={ theme === WIDGET_THEME.DARK ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.ACCENT_BORDER }
                                            size={ BUTTON_SIZE.BIG }
                                            onClick={ () => {handleThemeSelect(WIDGET_THEME.DARK);} }
                                            className={ styles.switchButton }
                                        >
                                            { WIDGET_THEME.DARK }
                                        </ButtonComponent>
                                    </div>
                                </div>
                                <RequiresPermission roles={ [ 'individual_subscription' ] }>
                                    <div className={ styles.customize }>
                                        <b>
                                            Use Google snippets in reviews?
                                        </b>
                                        <ToggleYesNoComponent
                                            name={ `${ type }-google` }
                                            value={ isGoogleSnippets }
                                            setValue={ handleToggleGoogleSnippets }
                                            className={ styles.marginTop }
                                        />
                                    </div>
                                </RequiresPermission>
                            </div>
                            <RequiresPermission roles={ [ 'individual_subscription' ] }>
                                <div className={ styles.marginTop }>
                                    <SelectNodesContainer
                                        type={ isFreelancer ? NODE_TYPES.REVIEWS_RECRUITER : NODE_TYPES.REVIEWS_AGENCY }
                                        selectedNodes={ selectedReviews }
                                        handleSelectNodes={ handleSelectReviews }
                                    />
                                </div>
                            </RequiresPermission>
                            <div className={ styles.marginTop }>
                                <b>
                                    { (type === WIDGET_TYPE.SINGLE || type === WIDGET_TYPE.DOUBLE) ?
                                        'Paste where you want your widget inside <body>' :
                                        'Paste below <body> opening' }
                                </b>
                            </div>
                            <TextAreaComponent
                                className={ styles.marginTop }
                                value={ code }
                                name={ type + 'iframe' }
                                setValue={ () => {} }
                            />
                            <div className={ styles.buttonsBox }>
                                <SendCodeContainer
                                    className={ styles.button }
                                    iframeUrl={ code }
                                />
                                <ButtonComponent
                                    className={ styles.button }
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    main
                                    size={ BUTTON_SIZE.BIG }
                                    onClick={ () => {
                                        handleCopyText(type + 'iframe');
                                    } }
                                >
                                    Copy to clipboard
                                </ButtonComponent>
                            </div>
                        </div>
                    </div> }
            </Fragment>
        );
    }
}

WidgetConfigureComponent.propTypes = {
    slug: PropTypes.string.isRequired,
    hasReviews: PropTypes.bool,
    isFreelancer: PropTypes.bool,
    type: PropTypes.string.isRequired,
};

export default WidgetConfigureComponent;
