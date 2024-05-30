import React                     from 'react';
import PropTypes                 from 'prop-types';
import RadioComponent            from '../../../components/RadioComponent';
import { SEARCH_CATEGORY_TYPES } from '../../../../constants';
import styles                    from './styles.scss';

const SelectCategoryComponent = (props) => {
    const {
        handleGoToQuery,
        tab,
    } = props;

    return (
        <div className={ styles.box }>
            { SEARCH_CATEGORY_TYPES.values.map(value => (
                <RadioComponent
                    key={ value }
                    label={ value }
                    name={ SEARCH_CATEGORY_TYPES.name }
                    value={ tab === value }
                    onChange={ () => {handleGoToQuery(value);} }
                />
            )) }
        </div>
    );
};

SelectCategoryComponent.propTypes = {
    tab: PropTypes.string.isRequired,
    handleGoToQuery: PropTypes.func.isRequired,
};

export default SelectCategoryComponent;
