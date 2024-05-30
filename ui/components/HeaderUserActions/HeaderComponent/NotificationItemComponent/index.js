import React       from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes   from 'prop-types';
import classNames  from 'classnames';
import styles      from './styles.scss';

const NotificationItemComponent = (props) => {
    const { seen, subject, url, message, date, onClick } = props;
    const dateFormatted = (new Date(date)).toLocaleDateString('en-US');

    const isHref = /^https?:\/\//.test(url);
    const Component = url ? isHref ? 'a' : NavLink : 'div' ;
    const componentProps = url ? isHref ? { href: url } : { to: url } : {};
    return (
        <Component
            { ...componentProps }
            className={ classNames(
                styles.notification,
                {
                    [styles.notificationSeen]: seen,
                },
            ) }
            onClick={ onClick }
        >
            <div className={ styles.subject }>
                { subject }
            </div>
            <div className={ styles.message }>
                { message }
            </div>
            <div className={ styles.date }>
                { dateFormatted }
            </div>
        </Component>
    );
};

NotificationItemComponent.propTypes = {
    seen: PropTypes.bool,
    url: PropTypes.string,
    message: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default NotificationItemComponent;
