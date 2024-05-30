import React              from 'react';
import { NavLink }        from 'react-router-dom';
import PropTypes          from 'prop-types';
import RequiresPermission from '../../../../components/User/RequiresPermission';
import styles             from './styles.scss';

const NavButtonComponent = (props) => {
    const { icon, url, label, roles, isActive, dataTest, onClick } = props;
    const isOuterLink = url.indexOf('http') === 0;
    const Component = isOuterLink ? 'a' : NavLink;
    const ComponentProps = isOuterLink ? {
        onClick,
        'data-test': dataTest,
        href: url,
        className: styles.link,
        target: '_blank',
        rel: 'noopener noreferrer',
    } : {
        onClick,
        'data-test': dataTest,
        to: url,
        className: styles.link,
        activeClassName: styles.linkActive,
        isActive: isActive,
    };

    return (
        <RequiresPermission roles={ roles }>
            <Component { ...ComponentProps }>
                <div className={ styles.linkIcon }>
                    { icon }
                </div>
                <div className={ styles.linkLabel }>
                    { label }
                </div>
            </Component>
        </RequiresPermission>
    );
};

NavButtonComponent.propTypes = {
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    dataTest: PropTypes.string,
    url: PropTypes.string.isRequired,
    roles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
    isActive: PropTypes.func,
    onClick: PropTypes.func,
};

export default NavButtonComponent;
