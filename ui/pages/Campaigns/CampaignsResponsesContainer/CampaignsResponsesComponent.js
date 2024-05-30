import React, { Fragment }                           from 'react';
import PropTypes                                     from 'prop-types';
import {
    ROUTES,
    CAMPAIGN_RESPONSE_TYPE,
    CAMPAIGN_SCORES_TYPE,
    CAMPAIGN_ID,
}                                                    from '../../../../constants';
import getNpsType                                    from '../../../../util/getNpsType';
import ActionsRowComponent                           from '../../../components/ActionsRowComponent';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../../components/ButtonComponent';
import RowItemComponent, { STATUS }                  from '../../../components/RowItemComponent';
import SelectComponent                               from '../../../components/SelectComponent';
import ViewResponseContainer                         from './ViewResponseContainer';
import styles                                        from './styles.scss';

const CampaignsResponsesComponent = (props) => {
    const { responses, handleSelectFilter, selectedCampaignId, selectedScores, selectedType, campaigns } = props;

    return (
        <Fragment>
            <ActionsRowComponent
                className={ styles.actionRow }
                pageActions={
                    <Fragment>
                        <SelectComponent
                            setValue={ (value) => {handleSelectFilter(CAMPAIGN_ID, value);} }
                            value={ selectedCampaignId || null }
                            isWhite
                            className={ styles.dropDown }
                            selectClassName={ !responses.length ? styles.select : null }
                            values={ [
                                {
                                    key: null,
                                    label: 'All campaigns',
                                }
                            ].concat(campaigns.map(({ id, title }) => ({ key: id, label: title }))) }
                        />
                        <SelectComponent
                            setValue={ (value) => {handleSelectFilter(CAMPAIGN_SCORES_TYPE._NAME, value);} }
                            value={ selectedScores || CAMPAIGN_SCORES_TYPE.ALL }
                            isWhite
                            className={ styles.dropDown }
                            selectClassName={ !responses.length ? styles.select : null }
                            values={ [
                                {
                                    key: CAMPAIGN_SCORES_TYPE.ALL,
                                    label: 'All Scores',
                                },
                                {
                                    key: CAMPAIGN_SCORES_TYPE.PASSIVE,
                                    label: 'Passive',
                                },
                                {
                                    key: CAMPAIGN_SCORES_TYPE.PROMOTER,
                                    label: 'Promoter',
                                },
                                {
                                    key: CAMPAIGN_SCORES_TYPE.DETRACTOR,
                                    label: 'Detractor',
                                },
                            ] }
                        />
                        <SelectComponent
                            setValue={ (value) => {handleSelectFilter(CAMPAIGN_RESPONSE_TYPE._NAME, value);} }
                            value={ selectedType || CAMPAIGN_RESPONSE_TYPE.ALL }
                            isWhite
                            className={ styles.dropDown }
                            selectClassName={ !responses.length ? styles.select : null }
                            values={ [
                                {
                                    key: CAMPAIGN_RESPONSE_TYPE.ALL,
                                    label: 'All Types',
                                },
                                {
                                    key: CAMPAIGN_RESPONSE_TYPE.EMPLOYER,
                                    label: 'Employer',
                                },
                                {
                                    key: CAMPAIGN_RESPONSE_TYPE.CANDIDATE,
                                    label: 'Candidate',
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
            <div className={ styles.responses }>
                { responses && responses.map(response => (
                    <RowItemComponent
                        classNameStart={ styles.rowStart }
                        classNameMiddle={ styles.rowMiddle }
                        classNameEnd={ styles.rowEnd }
                        key={ response.id }
                        id={ response.id }
                        header={ (response.firstName || response.lastName) ?
                            `${ response.firstName || '' } ${ response.lastName || '' }` :
                            'Anonymous'
                        }
                        infoText={ response.userType }
                        status={
                            getNpsType(
                                response.score,
                                STATUS.SUCCESS,
                                STATUS.WARNING,
                                STATUS.DANGER
                            )
                        }
                        statusText={
                            getNpsType(
                                response.score,
                                'Promoter',
                                'Passive',
                                'Detractor'
                            ) + ` (${ response.score }/10)`
                        }
                        actions={
                            <Fragment>
                                { response.campaignName && <div className={ styles.moreInfo }>
                                    { response.campaignName }
                                </div> }
                                <ViewResponseContainer
                                    responseId={ response.id }
                                />
                            </Fragment>
                        }
                    />
                )) }
            </div>
        </Fragment>
    );
};

CampaignsResponsesComponent.propTypes = {
    campaigns: PropTypes.arrayOf(PropTypes.object),
    responses: PropTypes.arrayOf(PropTypes.object),
    handleSelectFilter: PropTypes.func.isRequired,
    selectedCampaignId: PropTypes.string,
    selectedScores: PropTypes.string,
    selectedType: PropTypes.string,
};

export default CampaignsResponsesComponent;
