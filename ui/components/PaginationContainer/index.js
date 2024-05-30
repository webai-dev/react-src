import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import { withRouter }           from 'react-router-dom';
import PaginationComponent      from './PaginationComponent';

class PaginationContainer extends PureComponent {
    /**
     * Scroll to top on pagination button click
     */
    scrollTop = () => {
        if (window.navigator.userAgent.includes('Edge')) {
            return;
        }
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    render() {
        const { scrollTop } = this;
        const { totalPages, isScrollToTop } = this.props;

        return (
            <PaginationComponent
                totalPages={ totalPages }
                scrollTop={ isScrollToTop ? scrollTop : () => {} }
                location={ this.props.location }
            />
        );
    }
}

PaginationContainer.propTypes = {
    history: PropTypes.object,
    totalPages: PropTypes.number.isRequired,
    location: PropTypes.object,
    isScrollToTop: PropTypes.bool,
};

export default withRouter(PaginationContainer);
