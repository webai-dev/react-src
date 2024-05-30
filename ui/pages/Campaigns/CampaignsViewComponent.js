import React, { Fragment }         from 'react';
import PropTypes                   from 'prop-types';
import { ROUTES }                  from '../../../constants';
import HeaderRowButtonComponent    from '../../components/HeaderRowButtonComponent';
import HeaderRowComponent          from '../../components/HeaderRowComponent';
import CampaignsResponsesContainer from './CampaignsResponsesContainer';
import CampaignsContainer          from './CampaignsContainer';

const CampaignsViewComponent = (props) => {
    const { pathname, campaigns, responses } = props;

    return (
        <div>
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <HeaderRowButtonComponent
                            url={ ROUTES.CAMPAIGNS }
                            label="Campaigns"
                            isActive={
                                pathname === ROUTES.CAMPAIGNS
                            }
                            badgeText={ campaigns.length }
                        />
                        <HeaderRowButtonComponent
                            url={ ROUTES.CAMPAIGNS_RESPONSES }
                            label="Responses"
                            isActive={ pathname === ROUTES.CAMPAIGNS_RESPONSES }
                            badgeText={ responses.length }
                        />
                    </Fragment>
                }
            />
            { pathname === ROUTES.CAMPAIGNS &&
            <CampaignsContainer
                campaigns={ campaigns }
            />
            }
            { pathname === ROUTES.CAMPAIGNS_RESPONSES &&
            <CampaignsResponsesContainer
                responses={ responses }
                campaigns={ campaigns }
            />
            }
        </div>
    );
};

CampaignsViewComponent.propTypes = {
    pathname: PropTypes.string.isRequired,
    campaigns: PropTypes.arrayOf(PropTypes.object),
    responses: PropTypes.arrayOf(PropTypes.object),
};

export default CampaignsViewComponent;
