import React          from 'react';
import PropTypes      from 'prop-types';
import { Link }       from 'react-router-dom';
import getQueryParams from '../../../util/getQueryParams';
import getQueryString from '../../../util/getQueryString';
import classNames     from 'classnames';
import styles         from './styles.scss';

const PaginationComponent = (props) => {
    const { totalPages, scrollTop, location } = props;
    const paginationItems = [];
    const PAGES_TO_SHOW_MAX = 5;
    const PAGES_TO_SHOW = Math.min(PAGES_TO_SHOW_MAX, totalPages);
    const PAGES_GAP = Math.ceil(PAGES_TO_SHOW_MAX / 2);

    const queryParams = getQueryParams(location.search);
    const currentPage = +getQueryParams(location.search).page || 1;

    for (let i = 1; i <= PAGES_TO_SHOW; i++) { // use totalPages if totalPages <= PAGES_TO_SHOW_MAX
        const startPage = currentPage < PAGES_GAP ?
            0 : currentPage > (totalPages - PAGES_GAP + 1) ? // if we at count from [1, PAGES_TO_SHOW_MAX]
                (totalPages - PAGES_TO_SHOW) : // if we at end count from [totalPages - PAGES_TO_SHOW_MAX, totalPages]
                (currentPage - PAGES_GAP); // and here is the rest cases

        const realIndex = startPage + i;
        paginationItems.push(
            <Link
                key={ realIndex }
                to={ location.pathname + getQueryString({ ...queryParams, page: realIndex }) }
                onClick={ () => {
                    if (currentPage !== realIndex) {
                        scrollTop(realIndex);
                    }
                } }
                className={ classNames(
                    styles.item,
                    {
                        [ styles.itemActive ]: currentPage === realIndex,
                    },
                ) }
                title={ `go to page ${ realIndex }` }
                rel={ (currentPage - 1 === realIndex && 'prev') || (currentPage + 1 === realIndex && 'next') || undefined }
            >
                { realIndex }
            </Link>,
        );
    }

    return (
        <div className={ styles.box }>
            {
                currentPage !== 1 &&
                <Link
                    onClick={ scrollTop }
                    to={ location.pathname + getQueryString({ ...queryParams, page: currentPage - 1 }) }
                    className={ styles.item }
                    title={ `go to page ${ currentPage - 1 }` }
                    rel="prev"
                >
                    «
                </Link>
            }
            { paginationItems }
            {
                currentPage !== totalPages &&
                <Link
                    onClick={ scrollTop }
                    to={ location.pathname + getQueryString({ ...queryParams, page: currentPage + 1 }) }
                    className={ styles.item }
                    title={ `go to page ${ currentPage + 1 }` }
                    rel="next"
                >
                    »
                </Link>
            }
        </div>
    );
};

PaginationComponent.propTypes = {
    scrollTop: PropTypes.func,
    totalPages: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
};

export default PaginationComponent;

