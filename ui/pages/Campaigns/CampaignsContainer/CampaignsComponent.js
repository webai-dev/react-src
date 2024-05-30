import classNames                                    from 'classnames';
import React, { Fragment }                           from 'react';
import PropTypes                                     from 'prop-types';
import { generatePath }                              from 'react-router-dom';
import DownIcon                                      from '../../../../assets/icons/DownIcon';
import { ROUTES, CAMPAIGN_QUERY_TYPE, CAMPAIGN_ID }  from '../../../../constants';
import ActionsRowComponent                           from '../../../components/ActionsRowComponent';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../../components/ButtonComponent';
import DropDownComponent                             from '../../../components/DropDownComponent';
import RowItemComponent, { STATUS }                  from '../../../components/RowItemComponent';
import SelectComponent                               from '../../../components/SelectComponent';
import getFullDateFromDateString                     from '../../../../util/getFullDateFromDateString';
import AddPeopleToListContainer                      from './AddPeopleToListContainer';
import DeleteCampaignContainer                       from './DeleteCampaignContainer';
import styles                                        from './styles.scss';

const CampaignsComponent = (props) => {
    const {
        campaigns,
        campaignType,
        handleSelectCampaignType,
        handleDelete,
        isNoCampaigns,
        isLoading,
        handleSelectCampaigns,
        selectedCampaigns,
        handlePauseStart,
        action,
        handleSelectGroupAction,
        handleGroupAction,
        handleEdit,
    } = props;

    return (
        <Fragment>
            <ActionsRowComponent
                className={ styles.actionRow }
                itemActions={
                    <Fragment>
                        <SelectComponent
                            value={ action }
                            setValue={ handleSelectGroupAction }
                            isWhite
                            className={ styles.dropDown }
                            values={ [ CampaignsComponent.DELETE_ACTION ] }
                        />
                        <ButtonComponent
                            btnType={ BUTTON_TYPE.WHITE }
                            size={ BUTTON_SIZE.BIG }
                            disabled={ isLoading }
                            onClick={ () => {handleGroupAction(action, selectedCampaigns);} }
                        >
                            Apply
                        </ButtonComponent>
                    </Fragment>
                }
                pageActions={
                    <Fragment>
                        <SelectComponent
                            setValue={ handleSelectCampaignType }
                            value={ campaignType || CAMPAIGN_QUERY_TYPE.ALL }
                            isWhite
                            className={ styles.dropDown }
                            values={ [
                                {
                                    key: CAMPAIGN_QUERY_TYPE.ALL,
                                    label: 'All',
                                },
                                {
                                    key: CAMPAIGN_QUERY_TYPE.ACTIVE,
                                    label: 'Active',
                                },
                                {
                                    key: CAMPAIGN_QUERY_TYPE.IN_ACTIVE,
                                    label: 'Inactive',
                                },
                            ] }
                        />
                        <ButtonComponent
                            to={ ROUTES.CAMPAIGNS_NEW }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                        >
                            New Campaign
                        </ButtonComponent>
                    </Fragment>
                }
            />
            <div className={ styles.campaigns }>
                { campaigns && campaigns.map(campaign => (
                    <RowItemComponent
                        onCheckBoxClick={ () => {handleSelectCampaigns(campaign.id);} }
                        classNameStart={ styles.rowStart }
                        classNameMiddle={ styles.rowMiddle }
                        classNameEnd={ styles.rowEnd }
                        selected={ selectedCampaigns.includes(campaign.id) }
                        key={ campaign.id }
                        id={ campaign.id }
                        checkBoxId={ `campaign_${ campaign.id }` }
                        header={ campaign.title }
                        infoText={ getFullDateFromDateString(campaign.createdAt) }
                        messageType
                        date={ campaign.created }
                        status={
                            (campaign.active ? STATUS.SUCCESS : STATUS.NOT_ACTIVE)
                        }
                        statusText={ (campaign.active ? 'active' : 'inactive') }
                        actions={
                            <DropDownComponent
                                labelClassName={ styles.dropDownLabel }
                                label={
                                    <Fragment>
                                        Actions
                                        { ' ' }
                                        <DownIcon />
                                    </Fragment>
                                }
                                selectClassName={ styles.dropDownSelect }
                                select={
                                    <Fragment>
                                        <button
                                            type="button"
                                            className={ classNames(styles.item) }
                                            onClick={ () => {
                                                handleEdit(generatePath(ROUTES.CAMPAIGNS_EDIT, { [ CAMPAIGN_ID ]: campaign.id }));
                                            } }
                                        >
                                            Edit campaign
                                        </button>
                                        { !campaign.slug && <AddPeopleToListContainer
                                            isLoading={ isLoading }
                                            campaignId={ campaign.id }
                                        /> }
                                        <button
                                            type="button"
                                            className={ classNames(styles.item) }
                                            onClick={ () => {handlePauseStart(campaign.id, !campaign.active);} }
                                        >
                                            { campaign.active ? 'Pause' : 'Resume' }
                                        </button>
                                        <DeleteCampaignContainer
                                            campaignTitle={ campaign.title }
                                            isLoading={ isLoading }
                                            handleDelete={ () => {handleDelete([ campaign.id ]);} }
                                        />
                                    </Fragment>
                                }
                            />
                        }
                    />
                )) }
                { isNoCampaigns && <div>
                    You currently have no campaigns. To get started{ ' ' }
                    <ButtonComponent
                        size={ BUTTON_SIZE.SMALL }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        to={ ROUTES.CAMPAIGNS_NEW }
                    >click here</ButtonComponent>.
                </div> }
            </div>
        </Fragment>
    );
};

CampaignsComponent.DELETE_ACTION = {
    key: 'delete',
    label: 'Delete',
};

CampaignsComponent.propTypes = {
    campaigns: PropTypes.arrayOf(PropTypes.object),
    campaignType: PropTypes.string,
    handleSelectCampaignType: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handlePauseStart: PropTypes.func.isRequired,
    isNoCampaigns: PropTypes.bool,
    isLoading: PropTypes.bool,
    handleSelectCampaigns: PropTypes.func.isRequired,
    handleGroupAction: PropTypes.func.isRequired,
    handleSelectGroupAction: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    action: PropTypes.string,
    selectedCampaigns: PropTypes.arrayOf(PropTypes.string),
};

export default CampaignsComponent;
