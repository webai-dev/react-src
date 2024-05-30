import React, { Fragment }          from 'react';
import PropTypes                    from 'prop-types';
import { withRouter }               from 'react-router-dom';
import { ROUTES }                   from '../../../constants';
import HeaderRowButtonComponent     from '../../components/HeaderRowButtonComponent';
import HeaderRowComponent           from '../../components/HeaderRowComponent';
import RequiresBillingContainer     from '../../components/RequiresBillingContainer';
import LockMarkerComponent          from '../../components/RequiresBillingContainer/LockMarkerComponent';
import RequiresPermission           from '../../components/User/RequiresPermission';
import WidgetsContainer             from './WidgetsContainer';
import SocialSharingContainer       from './SocialSharingContainer';
import CapabilityStatementContainer from './CapabilityStatementContainer';
import EmailSettingsContainer       from './EmailSettingsContainer';
import CampaignSettingsContainer    from './CampaignSettingsContainer';
import styles                       from './styles.scss';

const ToolsView = (props) => {
    const { location: { pathname } } = props;
    return (
        <div>
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <RequiresBillingContainer>
                            <HeaderRowButtonComponent
                                url={ ROUTES.CAPABILITY_STATEMENT }
                                label={
                                    <span><LockMarkerComponent className={ styles.icon } />Capability statement</span>
                                }
                                isActive={ pathname === ROUTES.CAPABILITY_STATEMENT }
                            />
                        </RequiresBillingContainer>
                        <RequiresBillingContainer>
                            <HeaderRowButtonComponent
                                url={ ROUTES.SOCIAL_CUSTOM }
                                label={
                                    <span><LockMarkerComponent className={ styles.icon } />Social sharing</span>
                                }
                                isActive={ pathname === ROUTES.SOCIAL_CUSTOM }
                                helpText="Create a template consistent with your brand for
                            you and the team to use when sharing reviews to LinkedIn"
                            />
                        </RequiresBillingContainer>
                        <RequiresPermission roles={ [ 'widget_view' ] }>
                            <HeaderRowButtonComponent
                                url={ ROUTES.WIDGETS }
                                label="Widgets"
                                isActive={ pathname === ROUTES.WIDGETS }
                                helpText="Widgets can be added to your website to showcase your reviews and build trust with visitors"
                            />
                        </RequiresPermission>
                        <RequiresBillingContainer>
                            <HeaderRowButtonComponent
                                url={ ROUTES.INVITE_SETTINGS }
                                label={
                                    <span><LockMarkerComponent className={ styles.icon } />Invite settings</span>
                                }
                                isActive={ pathname === ROUTES.INVITE_SETTINGS }
                                helpText="Tailor the content of the email invitations sent to clients and candidates to be
                            on point with your brand and voice"
                            />
                        </RequiresBillingContainer>

                        <RequiresPermission
                            roles={ [
                                { include: [ 'recruiter_admin' ] },
                                { include: [ 'recruiter_freelancer' ] }
                            ] }
                        >
                            <RequiresBillingContainer>
                                <HeaderRowButtonComponent
                                    url={ ROUTES.CAMPAIGN_SETTINGS }
                                    label={
                                        <span><LockMarkerComponent className={ styles.icon } />Campaign settings</span>
                                    }
                                    isActive={ pathname === ROUTES.CAMPAIGN_SETTINGS }
                                />
                            </RequiresBillingContainer>
                        </RequiresPermission>
                    </Fragment>
                }
            />
            { pathname === ROUTES.CAPABILITY_STATEMENT && <CapabilityStatementContainer /> }
            { pathname === ROUTES.SOCIAL_CUSTOM && <SocialSharingContainer /> }
            { pathname === ROUTES.WIDGETS && <WidgetsContainer /> }
            { pathname === ROUTES.INVITE_SETTINGS && <EmailSettingsContainer /> }
            { pathname === ROUTES.CAMPAIGN_SETTINGS && <CampaignSettingsContainer /> }
        </div>
    );
};

ToolsView.propTypes = {
    location: PropTypes.object.isRequired,
};

export default withRouter(ToolsView);
