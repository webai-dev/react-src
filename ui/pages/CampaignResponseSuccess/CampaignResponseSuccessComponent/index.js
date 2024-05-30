import React, { Fragment }              from 'react';
import PropTypes                        from 'prop-types';
import GoogleIcon                       from '../../../../assets/icons/GoogleIcon';
import ButtonComponent, { BUTTON_TYPE } from '../../../components/ButtonComponent';
import classNames                       from 'classnames';
import styles                           from './styles.scss';

const CampaignResponseSuccessComponent = (props) => {
    const { linkToGoogleReview, agencyName, message } = props;
    return (
        <div className={ styles.box }>
            <h2 className={ styles.header }>
                Thank you for your response!
            </h2>
            <div className={ styles.text }>
                { message }
            </div>
            { linkToGoogleReview && <Fragment>
                <div className={ styles.text }>
                    Could you spare a few seconds for { agencyName } to add the review to Google.

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

CampaignResponseSuccessComponent.propTypes = {
    linkToGoogleReview: PropTypes.string,
    agencyName: PropTypes.string,
    message: PropTypes.string,
};

export default CampaignResponseSuccessComponent;
