import React, { PureComponent, Fragment }            from 'react';
import PropTypes                                     from 'prop-types';
import classNames                                    from 'classnames';
import SearchIcon                                    from '../../../assets/icons/SearchIcon/index';
import DropDownComponent                             from '../DropDownComponent';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../ButtonComponent';
import LoaderComponent                               from '../LoaderComponent';
import QuickSearchFiltersContainer                   from './QuickSearchFiltersContainer';
import QuickSearchResultComponent                    from './QuickSearchResultComponent';
import styles                                        from './styles.scss';

class QuickSearchComponent extends PureComponent {
    render() {
        const {
            handleChangeFilters,
            filtersSearch,
            error,
            loading,
            agencies,
            agenciesCount,
            recruiters,
            recruitersCount,
            valueToSearch,
            valueToShow,
            handleChangeValue,
            pathToSearch,
        } = this.props;
        const isForRecruiters = window.location.href.includes('for-recruiters');

        return (
            <div className={ styles.searchBox }>
                <DropDownComponent
                    className={ styles.dropDown }
                    labelClassName={ styles.labelBox }
                    selectClassName={ classNames(styles.results, { [styles.resultsWithoutFilters]: isForRecruiters }) }
                    isLabelFocusable
                    label={
                        <Fragment>
                            <input
                                id="searchItem"
                                className={ styles.input }
                                type="text"
                                value={ valueToShow }
                                onChange={ handleChangeValue }
                                name={ 'searchItem' }
                                autoComplete="off"
                            />
                            {
                                !valueToShow &&
                                <label
                                    className={ styles.label }
                                    htmlFor="searchItem"
                                >
                                    <SearchIcon />{ ' ' }
                                    { isForRecruiters ?
                                        <span>Search recruiter or agency name</span> :
                                        <span>Search for recruiters or agencies by name</span> }
                                </label>
                            }
                            {
                                loading && <div className={ styles.loader }>
                                    <LoaderComponent small />
                                </div>
                            }
                        </Fragment>
                    }
                    select={
                        <QuickSearchResultComponent
                            search={ valueToSearch }
                            recruiters={ recruiters }
                            recruitersCount={ recruitersCount }
                            agenciesCount={ agenciesCount }
                            agencies={ agencies }
                            error={ error }
                            loading={ loading }
                        />
                    }
                />
                { !isForRecruiters && <QuickSearchFiltersContainer
                    noRoleTypes
                    filtersSearch={ filtersSearch }
                    handleChangeFilters={ handleChangeFilters }
                /> }
                <ButtonComponent
                    className={ styles.button }
                    to={ pathToSearch }
                    size={ BUTTON_SIZE.BIG }
                    btnType={ BUTTON_TYPE.ACCENT }
                    onFocus={ event => {event.stopPropagation();} }
                >
                    Find
                </ButtonComponent>
            </div>
        );
    }
}

QuickSearchComponent.propTypes = {
    filtersSearch: PropTypes.string,
    handleChangeFilters: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.object,
    agencies: PropTypes.arrayOf(PropTypes.object),
    recruiters: PropTypes.arrayOf(PropTypes.object),
    recruitersCount: PropTypes.number,
    agenciesCount: PropTypes.number,
    valueToSearch: PropTypes.string,
    valueToShow: PropTypes.string,
    pathToSearch: PropTypes.string.isRequired,
    handleChangeValue: PropTypes.func,
};

export default QuickSearchComponent;
