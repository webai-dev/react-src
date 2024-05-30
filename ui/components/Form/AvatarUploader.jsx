import React, { Component } from 'react';
import Dropzone             from 'react-dropzone';
import Avatar               from '../User/Avatar';
import FontAwesomeIcon      from '@fortawesome/react-fontawesome';
import CameraIcon           from '@fortawesome/fontawesome-free-solid/faCamera';
import './AvatarUploader.scss';

export default class AvatarUploader extends Component {
    state = { uploaded: null };

    onDropDocuments = accepted => {
        this.setState({ uploaded: Array.isArray(accepted) ? accepted[ 0 ] : null });
        this.props.onChange(accepted[ 0 ]);
    };

    render() {
        const { defaultSrc = undefined, size = 125, showUploadIcon = true, ...props } = this.props;
        const { uploaded } = this.state;

        let src = this.props.value && this.props.value.url ? this.props.value.url : defaultSrc;

        if (uploaded) {
            src = uploaded.preview;
        }
        if (!src) {
            src = undefined;
        }

        return (
            <Dropzone
                style={ {} }
                className="dropzone avatar-uploader"
                activeClassName="dropzone__active"
                acceptClassName="dropzone__accept"
                rejectClassName="dropzone__reject"
                disabledClassName="dropzone__disabled"
                accept={ [ 'image/*' ] }
                onDrop={ this.onDropDocuments }
                multiple={ false }
            >
                <Avatar
                    size={ size }
                    src={ src }
                />
                { showUploadIcon && (
                    <span className="camera-icon-wrapper">
                        <FontAwesomeIcon
                            size={ size > 100 ? 'lg' : undefined }
                            icon={ CameraIcon }
                        />
                    </span>
                ) }
            </Dropzone>
        );
    }
}
