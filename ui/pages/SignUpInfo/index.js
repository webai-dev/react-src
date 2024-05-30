import React      from 'react';
import TEST_IDS   from '../../../tests/testIds';
import ButtonComponent, {
    BUTTON_SIZE,
    BUTTON_TYPE,
}                 from '../../components/ButtonComponent';
import {
    ROUTES,
}                 from '../../../constants';
import classNames from 'classnames';
import styles     from './styles.scss';

const SignUpInfoView = () => {
    return (
        <div className={ styles.box }>
            <h2 className={ styles.margin }>
                Are you an employer
            </h2>
            <div className={ styles.margin }>
                If you are an employer simply signup below...
            </div>
            <ButtonComponent
                className={ classNames(styles.margin, styles.button) }
                btnType={ BUTTON_TYPE.ACCENT }
                size={ BUTTON_SIZE.BIG }
                to={ ROUTES.SIGNUP }
                dataTest={ TEST_IDS.SIGN_UP_ROUTE }
            >
                Employer sign up
            </ButtonComponent>
            <h2 className={ styles.margin }>
                Or, are you a Recruiter?
            </h2>

            <div className={ styles.margin }>
                Sourcr has already created profiles for a number of recruiters and
                agencies that our system could identify. Search for your profile here and claim it right away…
            </div>

            <ButtonComponent
                className={ classNames(styles.borderButton, styles.button) }
                btnType={ BUTTON_TYPE.LINK_ACCENT }
                size={ BUTTON_SIZE.BIG }
                to={ ROUTES.EXTERNAL_RECRUITERS }
            >
                Find your profile
            </ButtonComponent>
        </div>
    );
};

export default SignUpInfoView;
