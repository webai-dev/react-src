import React                 from 'react';
import FiltersContainer      from './FiltersContainer';
import SearchResultContainer from './SearchResultContainer';
import styles                from './styles.scss';

const SearchView = () => {
    return (
        <div className={ styles.box }>
            <FiltersContainer />
            <SearchResultContainer />
        </div>
    );
};

export default SearchView;
