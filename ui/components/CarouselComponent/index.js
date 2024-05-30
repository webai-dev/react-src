import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import Siema                    from 'siema';
import classNames               from 'classnames';
import styles                   from './styles.scss';

class CarouselComponent extends PureComponent {
    static CAROUSEL_ID = 'carousel';
    static START_INDEX = 0;
    static INTERVAL = styles.interval;
    state = {
        currentIndex: CarouselComponent.START_INDEX,
    };

    componentDidMount() {
        this.Siema = new Siema({
            selector: `#${ CarouselComponent.CAROUSEL_ID }_${ this.props.id }`,
            duration: styles.duration,
            easing: 'ease-out',
            perPage: this.props.perPage,
            startIndex: CarouselComponent.START_INDEX,
            draggable: this.props.draggable,
            multipleDrag: true,
            threshold: 20,
            loop: true,
            rtl: false,
            onInit: this.handleAutoScroll,
            onChange: this.handleSetItemIndex,
        });
    }

    handleAutoScroll = () => {
        this.autoScrollIntervalId = setInterval(
            () => {
                if (!document.hidden) {
                    this.Siema.next();
                }
            },
            CarouselComponent.INTERVAL,
        );
    };

    /**
     * Set proper index so react can track it and add active style to proper one
     */
    handleSetItemIndex = () => {
        this.setState({ currentIndex: this.Siema.currentSlide });
        clearInterval(this.autoScrollIntervalId);
        this.handleAutoScroll();
    };

    /**
     * Will change slide to clicked index
     *
     * @param {number} index - index from array from 0 to ...
     */
    handleGoTo = (index) => {
        this.Siema.goTo(index);
    };

    componentWillUnmount() {
        clearInterval(this.autoScrollIntervalId);
        this.Siema.destroy();
    }

    render() {
        const { handleGoTo } = this;
        const { currentIndex } = this.state;
        const { className, items } = this.props;
        const carouselItems = [];
        const carouselActions = [];
        items.forEach((item, index) => {
            carouselItems.push(
                <div
                    key={ index }
                    className={ styles.item }
                >
                    { item }
                </div>,
            );

            carouselActions.push(
                <button
                    key={ index }
                    className={ classNames(
                        styles.action,
                        { [ styles.actionActive ]: currentIndex === -1 ? index + 1 === items.length : currentIndex === index },
                    ) }
                    type="button"
                    onClick={ () => {handleGoTo(index);} }
                    aria-label={ `go to slide #${ index }` }
                />,
            );
        });
        return (
            <div
                className={ classNames(
                    className,
                    styles.carouselBox,
                ) }
            >
                <div id={ `${ CarouselComponent.CAROUSEL_ID }_${ this.props.id }` }>
                    { carouselItems }
                </div>
                <div className={ styles.actions }>
                    { carouselActions }
                </div>
            </div>
        );
    }
}

CarouselComponent.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    draggable: PropTypes.bool,
    items: PropTypes.array.isRequired,
    perPage: PropTypes.number.isRequired,
};

export default CarouselComponent;
