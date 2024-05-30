import React, { Fragment }                         from 'react';
import { generatePath, Link }                      from 'react-router-dom';
import PropTypes                                   from 'prop-types';
import { LOCAL_STORAGE_KEYS, REVIEWS_TAB, ROUTES } from '../../../../constants';
import AlertComponent                              from '../../../components/AlertComponent';
import RequiresPermission                          from '../../../components/User/RequiresPermission';
import styles                                      from '../ProfileCompleteContainer/styles.scss';

const AlertsComponent = (props) => {
    const { isShowPendingReviews, handleHideNotificationBanner, routeToConfigureTool } = props;
    return (
        <Fragment>
            { isShowPendingReviews && <RequiresPermission roles={ [ 'recruiter' ] }>
                <AlertComponent
                    type={ AlertComponent.TYPE.WARNING }
                    onClose={ () => {handleHideNotificationBanner(LOCAL_STORAGE_KEYS.HIDE_PENDING_REVIEWS_WARNING);} }
                    className={ styles.warning }
                >
                    <b>Hey There!</b> You currently have pending reviews,{ ' ' }
                    <Link to={ generatePath(ROUTES.REVIEWS, { [ REVIEWS_TAB._NAME ]: REVIEWS_TAB.PENDING }) }>
                        click here
                    </Link>{ ' ' } to verify
                </AlertComponent>
            </RequiresPermission> }
            { routeToConfigureTool && <RequiresPermission roles={ [ 'individual_subscription' ] }>
                <AlertComponent
                    type={ AlertComponent.TYPE.INFO }
                    onClose={ () => {handleHideNotificationBanner(LOCAL_STORAGE_KEYS.HIDE_TOOLS_SETTING_INFO);} }
                    className={ styles.warning }
                >
                    Customise your templates for email and social{ ' ' }
                    <Link to={ routeToConfigureTool }>
                        here
                    </Link>
                </AlertComponent>
            </RequiresPermission> }
        </Fragment>
    );
};

AlertsComponent.propTypes = {
    isShowPendingReviews: PropTypes.bool,
    routeToConfigureTool: PropTypes.string,
    handleHideNotificationBanner: PropTypes.func.isRequired,
};

export default AlertsComponent;
