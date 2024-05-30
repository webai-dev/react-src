import { inject, observer } from 'mobx-react';
import React                from 'react';
import PropTypes            from 'prop-types';
import getPermissions       from '../../../util/getPermissions';
import LockIcon             from '../../../assets/icons/LockIcon';
import classNames           from 'classnames';
import styles               from './styles.scss';

const LockMarkerComponent = (props) => {
    const { store, isForTeam, children, className } = props;
    const hasActiveSubscription = isForTeam ?
        getPermissions(store, [ 'team_subscription' ]) :
        getPermissions(store, [ 'individual_subscription' ]);

    return hasActiveSubscription ? (children || null) :
        <span className={ classNames(className, styles.lock) }><LockIcon /></span>;
};

LockMarkerComponent.propTypes = {
    store: PropTypes.object.isRequired,
    isForTeam: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default inject('store')(
    observer(LockMarkerComponent),
);
