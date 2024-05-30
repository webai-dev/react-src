import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import { FormattedRelativeTime }          from 'react-intl';
import getDateObjectFromString            from '../../../../util/getDateObjectFromString';
import getNpsType                         from '../../../../util/getNpsType';
import getRelativeTimeUnit                from '../../../../util/getRelativeTimeUnit';
import PromoterScoreComponent             from '../../../components/PromoterScoreComponent';
import ChartComponent, { CHART_TYPE }     from '../../../components/ChartComponent';
import AvatarComponent                    from '../../../components/AvatarComponent';
import StatusComponent                    from '../../../components/StatusComponent';
import NPSRankingContainer                from './NPSRankingContainer';
import classNames                         from 'classnames';
import styles                             from './styles.scss';

class NPSComponent extends PureComponent {
    render() {
        const {
            recruiterToDisplay,
        } = this.props;

        return (
            <Fragment>
                <div className={ styles.row }>
                    <div className={ classNames(styles.cardBox, styles.cardNps) }>
                        <div className={ styles.card }>
                            <h2 className={ styles.title }>Net Promoter Score</h2>
                            <PromoterScoreComponent
                                npsScore={ recruiterToDisplay.npsScore }
                                npsDetractors={ recruiterToDisplay.npsDetractors }
                                npsPassives={ recruiterToDisplay.npsPassives }
                                npsPromoters={ recruiterToDisplay.npsPromoters }
                            />
                        </div>
                        <div className={ styles.card }>
                            <h2>Responses</h2>
                            { recruiterToDisplay.npsResponses?.map(response => {
                                const relativeDateParams = getRelativeTimeUnit(getDateObjectFromString(
                                    response.createdAt
                                ));
                                const recruiterFirstName = response.review?.firstName || response.npsCampaignRecipient?.firstName;
                                const recruiterLastName = response.review?.lastName || response.npsCampaignRecipient?.lastName;

                                return (
                                    <div
                                        key={ response.id }
                                        className={ styles.responseBox }
                                    >
                                        <AvatarComponent className={ styles.avatar } />
                                        <div className={ styles.response }>
                                            <div className={ classNames(styles.score, styles.marginBottom) }>
                                                <StatusComponent
                                                    status={
                                                        getNpsType(
                                                            response.score,
                                                            StatusComponent.STATUS.SUCCESS,
                                                            StatusComponent.STATUS.WARNING,
                                                            StatusComponent.STATUS.DANGER
                                                        ) }
                                                    big
                                                />
                                                <span>NPS: { response.score }</span>
                                            </div>
                                            { response.comment &&
                                            <div className={ classNames(styles.comment, styles.marginBottom) }>
                                                &quot;{ response.comment }&quot;
                                            </div> }
                                            <div className={ styles.sign }>
                                                { recruiterFirstName || '' }
                                                { recruiterFirstName && ' ' }
                                                { recruiterLastName || '' }
                                                { !!(recruiterFirstName || recruiterLastName) && ' ' }
                                                <span className={ styles.date }>
                                                    (<FormattedRelativeTime
                                                    value={ relativeDateParams.value }
                                                    unit={ relativeDateParams.unit }
                                                />)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) }
                        </div>
                    </div>
                    <div className={ styles.cardBox }>
                        <div className={ styles.card }>
                            <h2>NPS History</h2>
                            <ChartComponent
                                data={ {
                                    labels: recruiterToDisplay.npsAverages.labels,
                                    series: [
                                        recruiterToDisplay.npsAverages.series.overall,
                                        recruiterToDisplay.npsAverages.series.employer,
                                        recruiterToDisplay.npsAverages.series.candidate,
                                    ]
                                } }
                                options={ {
                                    high: 100,
                                    low: -100,
                                    height: 300,
                                    showPoint: false,
                                    lineSmooth: false,
                                    chartPadding: {
                                        right: 0,
                                        left: 15
                                    },
                                    axisX: {
                                        labelOffset: {
                                            x: -15,
                                            y: 0
                                        },
                                    },
                                    axisY: {
                                        offset: 20,
                                    }
                                } }
                                type={ CHART_TYPE.LINE }
                            />
                            <div className={ styles.legendBox }>
                                <div className={ styles.legendItem }>
                                    <div className={ classNames(styles.legend, styles.legendA) } />
                                    Overall ({ recruiterToDisplay.npsAverages.series.overallCount })
                                </div>
                                <div className={ styles.legendItem }>
                                    <div className={ classNames(styles.legend, styles.legendB) } />
                                    Employer ({ recruiterToDisplay.npsAverages.series.employerCount })
                                </div>
                                <div className={ styles.legendItem }>
                                    <div className={ classNames(styles.legend, styles.legendC) } />
                                    Candidate ({ recruiterToDisplay.npsAverages.series.candidateCount })
                                </div>
                            </div>
                        </div>
                        <NPSRankingContainer id={ recruiterToDisplay.id } />
                    </div>
                </div>
            </Fragment>
        );
    }
}

NPSComponent.propTypes = {
    verifiedReviews: PropTypes.array,
    requestedReviews: PropTypes.array,
    recruiterToDisplay: PropTypes.object.isRequired,
    recruiterId: PropTypes.string.isRequired,
};

export default NPSComponent;
