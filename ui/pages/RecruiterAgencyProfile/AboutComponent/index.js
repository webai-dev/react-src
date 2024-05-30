import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import styles                   from './styles.scss';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                               from '../../../components/ButtonComponent';
import VideoComponent           from '../../../components/VideoComponent';

class AboutComponent extends PureComponent {
    state = {
        short: true,
    };

    handleShowMoreOrLess = () => {
        this.setState({ short: !this.state.short });
    };

    render() {
        const { profileInfo, isAgency } = this.props;
        const { videoUrl } = profileInfo;
        const { handleShowMoreOrLess } = this;
        const { short } = this.state;
        const about = profileInfo.aboutMe || profileInfo.aboutUs || profileInfo.about;
        const text = about;
        const CHARACTERS_LIMIT = 230;
        const isTextBig = text && text.length > 230;
        return (
            <div className={ styles.box }>
                <h3>
                    { isAgency ? 'About Us' : 'About Me' }
                </h3>
                { !videoUrl && !about && <div>There is currently no { isAgency ? 'agency ' : 'personal ' }info</div> }
                { videoUrl && <VideoComponent url={ videoUrl } /> }
                <div className={ styles.hiddenMobile }>
                    { isTextBig && short ? text.slice(
                        0,
                        CHARACTERS_LIMIT,
                    ) : text }
                    { isTextBig && short && '...' }
                    {
                        isTextBig &&
                        <div>
                            <ButtonComponent
                                onClick={ handleShowMoreOrLess }
                                btnType={ BUTTON_TYPE.LINK_ACCENT }
                                size={ BUTTON_SIZE.SMALL }
                            >
                                { short ? 'Show more' : 'Show less' }
                            </ButtonComponent>
                        </div>
                    }
                </div>
                <div
                    className={ styles.hiddenDesktop }
                    itemProp="description"
                >
                    { text }
                </div>
            </div>
        );
    }
}

AboutComponent.propTypes = {
    profileInfo: PropTypes.object.isRequired,
    isAgency: PropTypes.bool,
};

export default AboutComponent;
