import React from 'react';

import './PropertyValue.scss';

const PropertyValue = (props) => {
    const { children, color = 'standard' } = props;
    return (
        <span className={ `property--value property--value__${ color }` }>{ children }</span>
    );
};

export default PropertyValue;
