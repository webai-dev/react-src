import React                   from 'react';
import PropTypes               from 'prop-types';
import FormsyInputComponent    from '../../../components/formsy/FormsyInputComponent';
import FormsyTextAreaComponent from '../../../components/formsy/FormsyTextAreaComponent';
import styles                  from './styles.scss';

const AboutComponent = (props) => {
    const { isAgency, profileInfo } = props;
    const { about, videoUrl } = profileInfo;
    return (
        <div>
            <h4 className={ styles.title }>
                { isAgency ? 'About us' : 'About me' }
            </h4>
            <FormsyInputComponent
                className={ styles.input }
                value={ videoUrl }
                placeholder="Video embed URL"
                name="videoUrl"
            />
            <FormsyTextAreaComponent
                className={ styles.textBox }
                value={ about }
                placeholder={ isAgency ?
                    'In a few short paragraphs tell us a bit about your agency' :
                    'In a few short paragraphs tell us a bit about you, your experience and skills' }
                label="Small description"
                name={ isAgency ? 'aboutUs' : 'aboutMe' }
            />
        </div>
    );
};

AboutComponent.propTypes = {
    isAgency: PropTypes.bool,
    profileInfo: PropTypes.object.isRequired,
};

export default AboutComponent;
