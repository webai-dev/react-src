import React, {
    Fragment,
    PureComponent
}                                  from 'react';
import PropTypes                   from 'prop-types';
import LoaderComponent             from '../../../components/LoaderComponent';
import DevDropdownComponent        from './DevDropdownComponent';
import SwitchUserDropdownComponent from './SwitchUserDropdownComponent';
import { ROUTES }                  from '../../../../constants';
import BellIcon                    from '../../../../assets/icons/BellIcon';
import AvatarComponent             from '../../../components/AvatarComponent';
import DropDownComponent           from '../../../components/DropDownComponent';
import BadgeComponent              from '../../../components/BadgeComponent';
import ButtonComponent, {
    BUTTON_TYPE,
}                                  from '../../../components/ButtonComponent';
import DropDownButtonComponent     from './DropDownButtonComponent';
import NotificationItemComponent   from './NotificationItemComponent';
import classNames                  from 'classnames';
import styles                      from './styles.scss';

class HeaderComponent extends PureComponent {
    render() {
        const { profileInfo, loading, handleSeen, unseenNotificationsCount } = this.props;
        const { profilePhotoUrl, notifications } = profileInfo;
        const isDevEnv = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
        return (
            <Fragment>
                { isDevEnv && <DevDropdownComponent
                    labelClassName={ classNames(styles.dropDownLabel, styles.dropDownLabelDev) }
                    selectClassName={ styles.dropDownSelect }
                /> }

                <SwitchUserDropdownComponent
                    labelClassName={ classNames(styles.dropDownLabel, styles.dropDownLabelDev) }
                    selectClassName={ styles.dropDownSelect }
                />
                <DropDownComponent
                    className={ styles.bell }
                    ariaLabel="notifications"
                    labelClassName={ styles.dropDownLabel }
                    label={
                        <Fragment>
                            <BellIcon />
                            &nbsp;
                            { notifications && unseenNotificationsCount > 0 && (
                                <BadgeComponent>{ unseenNotificationsCount }</BadgeComponent>
                            ) }
                        </Fragment>
                    }
                    selectClassName={ styles.dropDownSelect }
                    select={
                        <Fragment>
                            { loading && <LoaderComponent
                                small
                                row
                                invertColor
                            /> }
                            { !loading && notifications && notifications.length === 0 && (
                                <div className={ styles.noNotifications }>You have no notifications</div>
                            ) }
                            { !loading &&
                            notifications &&
                            notifications.length > 0 &&
                            <Fragment>
                                <ButtonComponent
                                    btnType={ BUTTON_TYPE.ACCENT }
                                    className={ styles.readAll }
                                    onClick={ () => {
                                        handleSeen();
                                    } }
                                >
                                    Mark all as read
                                </ButtonComponent>
                                { notifications.map(notification => (
                                    <NotificationItemComponent
                                        key={ notification.id }
                                        seen={ notification.seen }
                                        url={ notification.link }
                                        message={ notification.message }
                                        subject={ notification.subject }
                                        date={ notification.date }
                                        onClick={ () => {
                                            handleSeen(notification.id);
                                        } }
                                    />))
                                }
                            </Fragment> }

                        </Fragment>
                    }
                />
                <DropDownComponent
                    ariaLabel="account"
                    labelClassName={ styles.dropDownLabel }
                    selectClassName={ styles.dropDownSelect }
                    label={
                        <Fragment>
                            <AvatarComponent
                                className={ styles.avatar }
                                url={ profilePhotoUrl }
                                alt="Your avatar"
                            />
                        </Fragment>
                    }
                    select={
                        <Fragment>
                            <DropDownButtonComponent
                                label="Dashboard"
                                url={ ROUTES.DASHBOARD }
                            />
                            <DropDownButtonComponent
                                label="Logout"
                                url={ ROUTES.LOGOUT }
                            />
                        </Fragment>
                    }
                />
            </Fragment>
        );
    }
}

HeaderComponent.propTypes = {
    profileInfo: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    handleSeen: PropTypes.func.isRequired,
    unseenNotificationsCount: PropTypes.number.isRequired,
};

export default HeaderComponent;
