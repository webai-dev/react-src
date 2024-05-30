import React      from 'react';
import PropTypes  from 'prop-types';
import styles     from './styles.scss';
import classNames from 'classnames';
import SearchIcon from '../../../../assets/icons/SearchIcon/index';

const SearchComponent = (props) => {
    const { className, label, name, handleChangeValue, value, innerSearchStyle } = props;

    return (
        <div
            className={ classNames(
                className,
                styles.searchBox,
                {
                    [styles.searchBoxInner]: innerSearchStyle,
                }
            ) }
        >
            <input
                id={ name }
                className={ classNames(styles.input,
                    {
                        [styles.inputInner]: innerSearchStyle,
                    }) }
                type="text"
                value={ value }
                onChange={ handleChangeValue }
                name={ name }
            />
            {
                !value &&
                <label className={ classNames(styles.label, {
                    [styles.labelInner]: innerSearchStyle
                }) } htmlFor={ name }>
                    { !innerSearchStyle && <SearchIcon /> }
                    { ' ' }
                    { label }
                </label>
            }
            {
                innerSearchStyle &&
                <div className={ styles.searchIcon }>
                    <SearchIcon />
                </div>
            }
        </div>
    );
};

SearchComponent.propTypes = {
    className: PropTypes.string,
    innerSearchStyle: PropTypes.bool,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    handleChangeValue: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default SearchComponent;
