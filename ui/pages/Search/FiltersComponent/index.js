import React, { Fragment }   from 'react';
import PropTypes             from 'prop-types';
import CheckBoxItemComponent from './CheckBoxItemComponent';
import DownIcon              from '../../../../assets/icons/DownIcon';
import {
    SEARCH_ROLE_TYPES,
    SEARCH_LOCATION_TYPES,
    SEARCH_SPECIALIZATIONS_TYPES
}                            from '../../../../constants';
import classNames            from 'classnames';
import styles                from './styles.scss';


const FiltersComponent = (props) => {
    const { queryParams, handleGoToQuery, handleOpenFiltersMobile, mobileFilters } = props;

    return (
        <div className={ styles.box }>
            <Fragment>
                <h3
                    className={ styles.title }
                    onClick={ () => {handleOpenFiltersMobile(SEARCH_ROLE_TYPES.label);} }
                >
                    { SEARCH_ROLE_TYPES.label }
                    <span
                        className={ classNames(styles.dropIcon, {
                            [styles.dropIconOpen]: mobileFilters.includes(SEARCH_ROLE_TYPES.label)
                        }) }>
                        &nbsp;
                        <DownIcon />
                    </span>
                </h3>
                <div
                    className={ classNames(styles.filters, {
                        [styles.filtersOpen]: mobileFilters.includes(SEARCH_ROLE_TYPES.label)
                    }) }
                >
                    { SEARCH_ROLE_TYPES.values.map(value => (
                        <CheckBoxItemComponent
                            key={ value }
                            checkBoxProps={ SEARCH_ROLE_TYPES }
                            queryParams={ queryParams }
                            handleGoToQuery={ handleGoToQuery }
                            value={ value }
                            label={ value }
                        />
                    )) }
                </div>
            </Fragment>
            <Fragment>
                <h3
                    className={ styles.title }
                    onClick={ () => {handleOpenFiltersMobile(SEARCH_LOCATION_TYPES.label);} }
                >
                    { SEARCH_LOCATION_TYPES.label }
                    <span
                        className={ classNames(styles.dropIcon, {
                            [styles.dropIconOpen]: mobileFilters.includes(SEARCH_LOCATION_TYPES.label)
                        }) }>
                        &nbsp;
                        <DownIcon />
                    </span>
                </h3>
                <div
                    className={ classNames(styles.filters, {
                        [styles.filtersOpen]: mobileFilters.includes(SEARCH_LOCATION_TYPES.label)
                    }) }
                >
                { SEARCH_LOCATION_TYPES.values.map(({ value, label }) => (
                    <CheckBoxItemComponent
                        key={ value }
                        checkBoxProps={ SEARCH_LOCATION_TYPES }
                        queryParams={ queryParams }
                        handleGoToQuery={ handleGoToQuery }
                        value={ value }
                        label={ label }
                    />
                )) }
                </div>
            </Fragment>
            <Fragment>
                <h3
                    className={ styles.title }
                    onClick={ () => {handleOpenFiltersMobile(SEARCH_SPECIALIZATIONS_TYPES.label);} }
                >
                    { SEARCH_SPECIALIZATIONS_TYPES.label }
                    <span
                        className={ classNames(styles.dropIcon, {
                            [styles.dropIconOpen]: mobileFilters.includes(SEARCH_SPECIALIZATIONS_TYPES.label)
                        }) }>
                        &nbsp;
                        <DownIcon />
                    </span>
                </h3>
                <div
                    className={ classNames(styles.filters, {
                        [styles.filtersOpen]: mobileFilters.includes(SEARCH_SPECIALIZATIONS_TYPES.label)
                    }) }
                >
                { SEARCH_SPECIALIZATIONS_TYPES.values.map(value => (
                    <CheckBoxItemComponent
                        key={ value }
                        checkBoxProps={ SEARCH_SPECIALIZATIONS_TYPES }
                        queryParams={ queryParams }
                        handleGoToQuery={ handleGoToQuery }
                        value={ value }
                        label={ value }
                    />
                )) }
                </div>
            </Fragment>
        </div>
    );
};

FiltersComponent.propTypes = {
    handleOpenFiltersMobile: PropTypes.func.isRequired,
    queryParams: PropTypes.object,
    handleGoToQuery: PropTypes.func.isRequired,
    mobileFilters: PropTypes.array.isRequired,
};

export default FiltersComponent;
