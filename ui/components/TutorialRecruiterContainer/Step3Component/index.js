import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import TEST_IDS                                      from '../../../../tests/testIds';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../ButtonComponent';
import classNames                                    from 'classnames';
import styles                                        from '../styles.scss';

const Step2Component = (props) => {
    const { handleSendReview, handleInviteTeam, handlePrev, handleClose } = props;

    return (
        <div className={ styles.box }>
            <h2 className={ styles.title }>
                Take control of your brand in 2 simple steps
            </h2>
            <div className={ styles.chooseBox }>
                <div className={ styles.choose }>
                    <div>
                        <h3>Invite your team</h3>
                        <p>
                            Boost your agency brand and team page by inviting your colleagues to take control to their
                            profiles
                        </p>
                    </div>
                    <ButtonComponent
                        className={ styles.button }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                        onClick={ handleInviteTeam }
                    >
                        Invite team
                    </ButtonComponent>
                </div>
                <div className={ styles.line } />
                <div className={ styles.choose }>
                    <div>
                        <h3>Collect your first reviews</h3>
                        <p>
                            Feel great about positive reviews.
                            Share with your manager, share on social and showcase on your profile to stand out above
                            your competition.
                        </p>
                    </div>
                    <ButtonComponent
                        className={ styles.button }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                        onClick={ handleSendReview }
                    >
                        Send reviews
                    </ButtonComponent>
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
                    className={ classNames(styles.button, styles.skipButton) }
                    size={ BUTTON_SIZE.SMALL }
                    btnType={ BUTTON_TYPE.LINK }
                    onClick={ handleClose }
                    dataTest={ TEST_IDS.TUTORIAL_3 }
                >
                    Skip, I&apos;m ready to go
                </ButtonComponent>
            </div>
        </div>
    );
};

Step2Component.propTypes = {
    handlePrev: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSendReview: PropTypes.func.isRequired,
    handleInviteTeam: PropTypes.func.isRequired,
};

export default Step2Component;
