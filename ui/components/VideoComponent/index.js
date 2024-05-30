import React       from 'react';
import PropTypes   from 'prop-types';
import ReactPlayer from 'react-player';
import styles      from './styles.scss';

const VideoComponent = (props) => {
    const { url } = props;
    return (
        <div className={ styles.iframeBox }>
            <ReactPlayer
                className={ styles.reactPlayer }
                url={ url }
                width="100%"
                height="100%"
            />
        </div>
    );
};

VideoComponent.propTypes = {
    url: PropTypes.string.isRequired,
};

export default VideoComponent;
