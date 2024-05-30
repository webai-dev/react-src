import React  from 'react';
import styles from './PropertyKey.scss';

const PropertyKey = (props) => {
    const { children } = props;
    return <span className={ styles.label }>{ children }</span>;
};


export default PropertyKey;
