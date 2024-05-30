import React                  from 'react';
import { NavLink }            from 'react-router-dom';
import PropTypes              from 'prop-types';
import RequiresPermission     from '../../../../components/User/RequiresPermission';
import styles                 from './styles.scss';

const DropDownButtonComponent = (props) => {
    const { url, label, roles } = props;
    return (
        <RequiresPermission roles={ roles }>
            <NavLink to={ url } className={ styles.button }>
                <div>
                    { label }
                </div>
            </NavLink>
        </RequiresPermission>
    );
};

DropDownButtonComponent.propTypes = {
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    roles: PropTypes.array,
};

export default DropDownButtonComponent;
