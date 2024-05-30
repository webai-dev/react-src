import React, { Fragment }              from 'react';
import PropTypes                        from 'prop-types';
import GoogleIcon                       from '../../../../assets/icons/GoogleIcon';
import { ROUTES, PARAM_SLUG }           from '../../../../constants';
import { generatePath }                 from 'react-router-dom';
import ButtonComponent, { BUTTON_TYPE } from '../../../components/ButtonComponent';
import classNames                       from 'classnames';
import styles                           from './styles.scss';

const ReviewSuccessViewComponent = (props) => {
    const { linkToGoogleReview, recruiter, redirected } = props;

    return (
        <div className={ styles.box }>
            <h2 className={ styles.header }>
                { redirected ? 'It looks like you\'ve already left a review' : 'Thank you' }
            </h2>
            <div className={ styles.text }>
                Your review has been completed and will be added to the recruiters rating. To check
                out { recruiter.firstName }&apos;s profile click
                below.
            </div>
            <ButtonComponent
                to={ generatePath(
                    ROUTES.RECRUITER_PROFILE,
                    {
                        [ PARAM_SLUG ]: recruiter.slug,
                    },
                ) }
                btnType={ BUTTON_TYPE.ACCENT }
                className={ styles.button }
            >
                See profile
            </ButtonComponent>
            { linkToGoogleReview && <Fragment>
                <div className={ styles.text }>
                    Could you spare a few seconds for { recruiter.agency?.name } to add the review to Google.

                    It only takes 20 seconds! Clicking the link below copies your testimonial and opens our google
                    account for you to paste in to.

                    Thanks!
                </div>
                <ButtonComponent
                    to={ linkToGoogleReview }
                    btnType={ BUTTON_TYPE.BORDER }
                    className={ classNames(
                        styles.faq,
                        styles.button,
                    ) }
                >
                    <GoogleIcon />oogle review
                </ButtonComponent>
            </Fragment> }
            <div className={ styles.text }>
                Sourcr is a reviews and recommendations platform for employers and candidates to search and discover top
                recruiters in their market.
            </div>
        </div>
    );
};

ReviewSuccessViewComponent.propTypes = {
    recruiter: PropTypes.object.isRequired,
    redirected: PropTypes.bool,
    linkToGoogleReview: PropTypes.string,
};

export default ReviewSuccessViewComponent;
