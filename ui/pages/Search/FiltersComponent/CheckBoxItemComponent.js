import React             from 'react';
import PropTypes         from 'prop-types';
import CheckBoxComponent from '../../../components/CheckBoxComponent';

const CheckBoxItemComponent = ({ checkBoxProps, handleGoToQuery, value, label, queryParams }) => {
    const name = checkBoxProps.name;
    return (
        <CheckBoxComponent
            name={ value.replace(/ and /g, ' & ') }
            value={ queryParams[ name ] && queryParams[ name ].includes(value.replace(/ & /g, ' and ')) }
            onChange={ () => {
                handleGoToQuery({
                    name,
                    value: value.replace(/ & /g, ' and '),
                    isArray: true,
                });
            } }
            label={ label }
        />
    );
};

CheckBoxItemComponent.propTypes = {
    checkBoxProps: PropTypes.object.isRequired,
    handleGoToQuery: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    queryParams: PropTypes.object.isRequired,
};

export default CheckBoxItemComponent;
