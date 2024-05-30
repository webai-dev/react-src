import React                   from 'react';
import * as Sentry             from '@sentry/browser';
import { ROUTES }              from '../../../constants';
import backgroundImage         from '../../../assets/images/bg-image.jpg';
import styles                  from './styles.scss';

const SentryErrorComponent = () => {
    return (
        <div className={ styles.box } style={ {
            backgroundImage: `url(${backgroundImage})`
        } }>
            <p className={ styles.errorMessage }>
                Oops! Something went wrong!
            </p>
            <a
                onClick={ () => Sentry.showReportDialog() }
                className={ styles.button }
            >
                Report feedback
            </a>
            <a
                href={ ROUTES.ROOT }
                className={ styles.button }
            >
                Back to site
            </a>
            <a
                href={ ROUTES.LOGOUT }
                className={ styles.button }
            >
                Logout
            </a>
        </div>
    );
};

export default SentryErrorComponent;
