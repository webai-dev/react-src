import React              from 'react';
import PropTypes          from 'prop-types';
import getNpsType         from '../../../../../util/getNpsType';
import ErrorComponent     from '../../../../components/ErrorComponent';
import LoaderComponent    from '../../../../components/LoaderComponent';
import SelectComponent    from '../../../../components/SelectComponent';
import StatusComponent    from '../../../../components/StatusComponent';
import classNames         from 'classnames';
import RequiresPermission from '../../../../components/User/RequiresPermission';
import styles             from '../styles.scss';

const NPSRankingComponent = (props) => {
    const {
        groupRankingBy,
        handleSelectGroupRankingBy,
        npsRanking,
        error,
        isLoading,
    } = props;

    if (error) {
        return <ErrorComponent error={ error } />;
    }
    return (
        <div className={ styles.card }>
            <h2 className={ styles.npsTitle }>
                <span>NPS Rankings </span>
                { npsRanking && <span className={ styles.bench }>Benchmark <StatusComponent
                    status={
                        getNpsType(
                            npsRanking.benchmark,
                            StatusComponent.STATUS.SUCCESS,
                            StatusComponent.STATUS.WARNING,
                            StatusComponent.STATUS.DANGER,
                            [-33,33]
                        ) }
                /> NPS: { npsRanking.benchmark }</span> }
            </h2>
            <RequiresPermission roles={ [ 'recruiter_admin' ] }>
                <SelectComponent
                    className={ styles.selectRanking }
                    value={ groupRankingBy }
                    setValue={ handleSelectGroupRankingBy }
                    values={ [
                        {
                            key: NPSRankingComponent.GROUP_BY.JOB_CATEGORY,
                            label: 'Job category',
                        },
                        {
                            key: NPSRankingComponent.GROUP_BY.RECRUITER,
                            label: 'Recruiter',
                        },
                        {
                            key: NPSRankingComponent.GROUP_BY.CAMPAIGN,
                            label: 'campaign',
                        },
                    ] }
                />
            </RequiresPermission>

            { isLoading && <LoaderComponent row /> }
            { npsRanking && <div>
                { npsRanking.rows?.map((row, index) => (
                    <div
                        key={ index }
                        className={ styles.npsRow }
                    >
                            <span className={ styles.rowIndex }>
                                { index + 1 }.
                            </span>
                        <span className={ styles.rowName }>
                                { row.name }
                            </span>
                        <span className={ styles.responses }>
                                { row.responses } responses
                            </span>
                        <span className={ styles.npsScore }>
                                <StatusComponent
                                    status={
                                        getNpsType(
                                            row.score,
                                            StatusComponent.STATUS.SUCCESS,
                                            StatusComponent.STATUS.WARNING,
                                            StatusComponent.STATUS.DANGER,
                                            [-33,33]
                                        ) }
                                /> NPS: { row.score }
                            </span>
                        <span
                            className={ classNames(styles.vsBench, {
                                [ styles.increase ]: row.vsBenchmark > 0,
                                [ styles.decrease ]: row.vsBenchmark < 0,
                            }) }
                        >
                                { row.vsBenchmark > 0 && '+' }{ row.vsBenchmark }
                            </span>
                    </div>
                )) }
            </div> }
        </div>
    );
};

NPSRankingComponent.GROUP_BY = {
    JOB_CATEGORY: 'jobCategory',
    RECRUITER: 'recruiter',
    CAMPAIGN: 'campaign',
};

NPSRankingComponent.propTypes = {
    npsRanking: PropTypes.object,
    groupRankingBy: PropTypes.oneOf([
        NPSRankingComponent.GROUP_BY.JOB_CATEGORY,
        NPSRankingComponent.GROUP_BY.RECRUITER,
        NPSRankingComponent.GROUP_BY.CAMPAIGN,
    ]),
    error: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    handleSelectGroupRankingBy: PropTypes.func.isRequired,
};

export default NPSRankingComponent;
