import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import TEST_IDS                                      from '../../../../tests/testIds';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../ButtonComponent';
import VideoComponent                                from '../../VideoComponent';
import styles                                        from '../styles.scss';

const Step2Component = (props) => {
    const { handleNext, handlePrev } = props;

    return (
        <div className={ styles.box }>
            <h2 className={ styles.title }>
                See how you can convert reviews into revenue
            </h2>
            <div className={ styles.videoBox }>
                <div className={ styles.videoContainer }>
                    <VideoComponent url="https://www.youtube.com/watch?v=by1tHFtxMSE" />
                </div>
            </div>
            <div className={ styles.buttonBox }>
                <ButtonComponent
                    className={ styles.button }
                    size={ BUTTON_SIZE.BIG }
                    onClick={ handlePrev }
                >
                    Previous
                </ButtonComponent>
                <ButtonComponent
                    className={ styles.button }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.BIG }
                    onClick={ handleNext }
                    dataTest={ TEST_IDS.TUTORIAL_2 }
                >
                    Next
                </ButtonComponent>
            </div>
        </div>
    );
};

Step2Component.propTypes = {
    handleNext: PropTypes.func.isRequired,
    handlePrev: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
};

export default Step2Component;
