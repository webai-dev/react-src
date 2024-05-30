import PropTypes from 'prop-types';
import {
    inject,
    observer,
} from 'mobx-react';
import getPermissions from '../../../util/getPermissions';

const RequiresPermission = ({ roles, children, store, disallowedComponent = null, noUser }) =>
    getPermissions(
        store,
        roles,
        noUser,
    ) ? children : disallowedComponent;

RequiresPermission.propTypes = {
    roles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    children: PropTypes.node.isRequired,
    store: PropTypes.object,
    disallowedComponent: PropTypes.node,
    noUser: PropTypes.bool,
};

export default inject('store')(
    observer(RequiresPermission),
);
