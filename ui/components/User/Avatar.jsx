import React         from 'react';
import DefaultAvatar from '../../../images/user_avatar.png';
import Avatar        from 'react-avatar';

const AvatarComponentOld = (props) => {
    const { round = true, size = 70, src = DefaultAvatar, ...restProps } = props;
    return (
        <Avatar
            { ...restProps }
            src={ src }
            round={ round }
            size={ size }
        />
    );
};

export default AvatarComponentOld;
