import React    from 'react';
import Loadable from 'react-loadable';

const getLoadableView = getLoader => {
    return Loadable({
        loader: getLoader,
        loading: () => <div />,
    });
};

const AllUsersLayoutLoad = getLoadableView(() => {
    return import('./AllUsersLayout');
});
export const AllUsersLayout = (params) => {
    return <AllUsersLayoutLoad { ...params } />;
};
const AppLayoutLoad = getLoadableView(() => {
    return import('./AppLayout');
});
export const AppLayout = (params) => {
    return <AppLayoutLoad { ...params } />;
};
const LoginLayoutLoad = getLoadableView(() => {
    return import('./LoginLayout');
});
export const LoginLayout = (params) => {
    return <LoginLayoutLoad { ...params } />;
};

const NoLayoutLoad = getLoadableView(() => {
    return import('./NoLayout');
});
export const NoLayout = (params) => {
    return <NoLayoutLoad { ...params } />;
};
