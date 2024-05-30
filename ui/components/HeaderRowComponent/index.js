import React     from 'react';
import PropTypes from 'prop-types';
import styles    from './styles.scss';

const HeaderRowComponent = (props) => {
    const { tabs, search } = props;
    return (
        <div className={ styles.box }>
            { tabs && <div className={ styles.tabs }>
                { tabs }
            </div> }
            { search && <div className={ styles.search }>
                { search }
            </div> }
        </div>
    );
};

HeaderRowComponent.propTypes = {
    tabs: PropTypes.node.isRequired,
    search: PropTypes.node,
};

export default HeaderRowComponent;
