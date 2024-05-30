import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import TEST_IDS                                      from '../../../../tests/testIds';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../ButtonComponent';
import styles                                        from '../styles.scss';

const Step1Component = (props) => {
    const { handleNext, user } = props;

    return (
        <div className={ styles.box }>
            <h2 className={ styles.title }>
                Welcome { user.firstName }!
            </h2>
            <div className={ styles.text }>
                Collect reviews, boost your online brand and increase revenue with Sourcr.
            </div>
            <div className={ styles.buttonBox }>
                <ButtonComponent
                    className={ styles.button }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.BIG }
                    onClick={ handleNext }
                    dataTest={ TEST_IDS.TUTORIAL_1 }
                >
                    Get Started
                </ButtonComponent>
            </div>
        </div>
    );
};

Step1Component.propTypes = {
    handleNext: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};

export default Step1Component;
