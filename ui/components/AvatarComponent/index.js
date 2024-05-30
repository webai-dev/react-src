import React                      from 'react';
import PropTypes                  from 'prop-types';
import styles                     from './styles.scss';
import classNames                 from 'classnames';
import userDefaultAvatar          from '../../../images/user_avatar.png';
import jobDefaultAvatar           from '../../../images/job_icon_placeholder.png';
import messageDefaultAvatar       from '../../../images/campaign_icon.png';
import { STAGE_URL, BaseAPiPath } from '../../../constants';

const AvatarComponent = (props) => {
    const { className, url, jobType, messageType, isEmbeded, alt, itemProp, refToImg } = props;
    let defaultAvatar = messageType ? messageDefaultAvatar : jobType ? jobDefaultAvatar : userDefaultAvatar;
    defaultAvatar = isEmbeded ? `${ BaseAPiPath }${ defaultAvatar }` : defaultAvatar;
    const fullUrl = (url && (url.includes('data:') || url.includes('http://') || url.includes('https://'))) ? url :
        (process.env.NODE_ENV !== 'development') ?
            (url && `${ BaseAPiPath }${ url }`) : (url && `${ STAGE_URL }${ url }`);
    const defaultAvatarStyle = fullUrl ? {} : {
        style: {
            backgroundImage: `url(${ defaultAvatar })`,
        }
    };

    // will show <img> if url not null
    // will show defaultAvatar as background if url is null
    return (
        <div
            className={ classNames(styles.box, className) }
            { ...defaultAvatarStyle }
        >
            { fullUrl && <img
                itemProp={ itemProp }
                src={ fullUrl }
                alt={ alt }
                ref={ refToImg }
            /> }
        </div>
    );
};

AvatarComponent.propTypes = {
    className: PropTypes.string,
    url: PropTypes.string,
    jobType: PropTypes.bool,
    isEmbeded: PropTypes.bool,
    messageType: PropTypes.bool,
    alt: PropTypes.string,
    itemProp: PropTypes.string,
    refToImg: PropTypes.func,
};

export default AvatarComponent;
