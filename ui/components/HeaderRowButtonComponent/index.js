import React          from 'react';
import PropTypes      from 'prop-types';
import { NavLink }    from 'react-router-dom';
import BadgeComponent from '../BadgeComponent';
import HelpComponent  from '../HelpComponent';
import classNames     from 'classnames';
import styles         from './styles.scss';

const HeaderRowButtonComponent = (props) => {
    const { url, label, badgeText, isActive, dataTest, onClick, helpText } = props;

    return (
        <NavLink
            onClick={ onClick }
            data-test={ dataTest }
            to={ url }
            className={ classNames(styles.navLink, {
                [ styles.navLinkActive ]: isActive
            }) }
        >
            { label }
            { !!badgeText && <BadgeComponent className={ styles.badge }>
                { badgeText }
            </BadgeComponent> }
            { helpText && <HelpComponent
                text={ helpText }
                bottom
                center
                className={ styles.helpBox }
                helpClassName={ styles.help }
            /> }
        </NavLink>
    );
};

HeaderRowButtonComponent.propTypes = {
    url: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    onClick: PropTypes.func, // May be passed via RequiresBillingContainer
    dataTest: PropTypes.string,
    badgeText: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    isActive: PropTypes.bool,
    helpText: PropTypes.string,
};

export default HeaderRowButtonComponent;
