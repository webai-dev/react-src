import React, { Fragment }   from 'react';
import PropTypes             from 'prop-types';
import DropDownComponent     from '../../../DropDownComponent';
import CheckBoxItemComponent from './CheckBoxItemComponent';
import DownIcon              from '../../../../../assets/icons/DownIcon';
import {
    SEARCH_LOCATION_TYPES,
    SEARCH_SPECIALIZATIONS_TYPES
}                            from '../../../../../constants';
import styles                from './styles.scss';


const QuickSearchFiltersComponent = (props) => {
    const { queryParams, handleGoToQuery } = props;

    return (
        <div className={ styles.box }>
            <DropDownComponent
                className={ styles.dropDown }
                labelClassName={ styles.labelBox }
                selectClassName={ styles.filters }
                notHideOnSelectClick
                label={
                    <Fragment>
                        { SEARCH_LOCATION_TYPES.label }
                        <span className={ styles.dropIcon }>
                            &nbsp;
                            <DownIcon />
                        </span>
                    </Fragment>
                }
                select={
                    <Fragment>
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
                    </Fragment>
                }
            />
            <DropDownComponent
                className={ styles.dropDown }
                labelClassName={ styles.labelBox }
                selectClassName={ styles.filters }
                notHideOnSelectClick
                label={
                    <Fragment>
                        { SEARCH_SPECIALIZATIONS_TYPES.label }
                        <span className={ styles.dropIcon }>
                            &nbsp;
                            <DownIcon />
                        </span>
                    </Fragment>
                }
                select={
                    <Fragment>
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
                    </Fragment>
                }
            />
        </div>
    );
};

QuickSearchFiltersComponent.propTypes = {
    queryParams: PropTypes.object,
    handleGoToQuery: PropTypes.func.isRequired,
};

export default QuickSearchFiltersComponent;
