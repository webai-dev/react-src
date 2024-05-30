import React                from 'react';
import PropTypes            from 'prop-types';
import { withRouter }       from 'react-router-dom';
import { ROUTES }           from '../../../constants';
import * as Sentry          from '@sentry/browser';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                           from '../../components/ButtonComponent';
import RequiresPermission   from '../../components/User/RequiresPermission';
import styles               from './styles.scss';

const NotFound = (props) => {
    const { location } = props;
    Sentry.captureMessage(`Such route doesn't exist: ${ location.pathname }`);
    return (
        <div className={ styles.container }>
            <h2>Sorry! But such page doesn&apos;t exist</h2>
            <div className={ styles.buttonBox }>
                <RequiresPermission noUser>
                    <ButtonComponent
                        className={ styles.button }
                        to={ ROUTES.ROOT }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                    >
                        Back to login
                    </ButtonComponent>
                </RequiresPermission>
                <RequiresPermission roles={ [ 'logged' ] }>
                    <ButtonComponent
                        className={ styles.button }
                        to={ ROUTES.DASHBOARD }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                    >
                        Back to dashboard
                    </ButtonComponent>
                </RequiresPermission>
                <ButtonComponent
                    className={ styles.button }
                    to={ ROUTES.SEARCH }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.BIG }
                >
                    Back to search
                </ButtonComponent>
            </div>
        </div>
    );
};

NotFound.propTypes = {
    location: PropTypes.object.isRequired,
};

export default withRouter(NotFound);
