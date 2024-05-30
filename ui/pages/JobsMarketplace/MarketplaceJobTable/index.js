import React, { Component }             from 'react';
import PropTypes                        from 'prop-types';
import { FormattedRelativeTime }        from 'react-intl';
import { ROUTES }                       from '../../../../constants';
import { withRouter }                   from 'react-router-dom';
import {
    inject,
    observer,
}                                       from 'mobx-react/index';
import TEST_IDS                         from '../../../../tests/testIds';
import getDateObjectFromString          from '../../../../util/getDateObjectFromString';
import { TempJobSalary, JobFee }        from '../../../../util/getSalary';
import getRelativeTimeUnit              from '../../../../util/getRelativeTimeUnit';
import ButtonComponent, { BUTTON_TYPE } from '../../../components/ButtonComponent';
import ApplyModalContainer              from '../../../components/ApplyModalContainer';
import Table                            from '../../../components/Table/Table';
import TableRow                         from '../../../components/Table/TableRow';
import TableCell                        from '../../../components/Table/TableCell';
import Badge                            from '../../../components/Badge';
import {
    graphql,
    createFragmentContainer,
}                                       from 'react-relay';
import { Money }                        from '../../../components/Misc';
import {
    Confirm,
}                                       from '../../../components/Modal';
import styles                           from './styles.scss';

const MarketplaceJobListTableRow = (props) => {
    const {
        job = {},
        onJobSelected = () => {},
        onRequestJobApply = () => {},
        type,
    } = props;
    const relativeDateParams = getRelativeTimeUnit(getDateObjectFromString(
        job.published
    ));
    return (
        <TableRow
            className={ `marketplace-job-table--row__${
                job.myApplication ? job.myApplication.status : 'no_application'
                } marketplace-job-table--row__search_type_${ job.searchType }` }
            type={ type }
        >
            <TableCell name="title">
                <h3
                    onClick={ () => onJobSelected(job) }
                    className={ styles.pointer }
                >
                    { job.title }
                </h3>
                <div className={ styles.location }>{ job.suburb }{ ' ' }{ job.state }</div>
                <div>
                    { job.type }
                    { job.searchType === 'exclusive' && (
                        <React.Fragment>
                            { ' ' }
                            -{ ' ' }
                            <strong>Exclusive</strong>
                        </React.Fragment>
                    ) }
                </div>
            </TableCell>
            <TableCell
                align="center"
                valign="center"
                name="published"
            >
                <label htmlFor="">Created{ ' ' }</label>
                <span className="openSans"><FormattedRelativeTime
                    numeric="auto"
                    value={ relativeDateParams.value }
                    unit={ relativeDateParams.unit }
                /></span>
            </TableCell>
            <TableCell
                align="center"
                valign="center"
                name="fee"
            >
                <label htmlFor="">{ job.type === 'temp' ? 'Rate:' : 'Fee:' }</label>{ ' ' }
                <span className="openSans">
                    { job.type === 'temp' && <TempJobSalary job={ job } /> }
                    { job.type !== 'temp' && <Money>{ JobFee({ job }) }</Money> }
                </span>

            </TableCell>
            <TableCell
                align="center"
                valign="center"
                name="count"
            >
                <Badge color={ job.recruiterCount > 0 ? 'pink' : 'empty-value' }>
                    { job.recruiterCount } Recruiters
                </Badge>
            </TableCell>
            <TableCell
                align="center"
                valign="center"
                name="count"
            >
                <ButtonComponent
                    btnType={ BUTTON_TYPE.ACCENT }
                    onClick={ () => onRequestJobApply(job) }
                    dataTest={ TEST_IDS.APPLY_FOR_A_JOB }
                >
                    Apply
                </ButtonComponent>
            </TableCell>
        </TableRow>
    );
};

MarketplaceJobListTableRow.propTypes = {
    job: PropTypes.object.isRequired,
    onJobSelected: PropTypes.func.isRequired,
    onRequestJobApply: PropTypes.func.isRequired,
    type: PropTypes.string,
};

@withRouter
@inject('store')
@observer
class Index extends Component {
    state = { jobApply: null, isLoading: false };

    render() {
        const { profileComplete, jobs = [], onJobSelected, type, history } = this.props;
        const { jobApply, isLoading } = this.state;

        return (
            <React.Fragment>
                <Table type="marketplace-job">
                    { jobs.map(job => (
                        <MarketplaceJobListTableRow
                            onJobSelected={ onJobSelected }
                            type={ type }
                            key={ job.id }
                            job={ job }
                            onRequestJobApply={ jobToApply => {
                                if (profileComplete) {
                                    this.setState({ jobApply: jobToApply });
                                    return true;
                                }
                                Confirm(
                                    <div className="confirmations-title">
                                        <p>
                                            You must complete your profile before you can apply for
                                            a job
                                        </p>
                                    </div>,
                                    {
                                        proceed: false,
                                        cancel: 'OK',
                                        title: 'Your profile is not complete',
                                    },
                                )
                                    .then(
                                        () => {},
                                        () => {
                                            history.push(ROUTES.RECRUITER_PROFILE_EDIT);
                                        },
                                    );
                            } }
                        />
                    )) }
                    { jobs.length === 0 && (
                        <TableRow className="no-border">
                            <TableCell>No jobs matched the criteria</TableCell>
                        </TableRow>
                    ) }
                </Table>
                { jobApply && (
                    <ApplyModalContainer
                        handleClose={ () => this.setState({ jobApply: null }) }
                        isLoading={ isLoading }
                        job={ jobApply }
                    />
                ) }
            </React.Fragment>
        );
    }
}

Index.propTypes = {
    history: PropTypes.object, // required
    profileComplete: PropTypes.bool,
    jobs: PropTypes.array.isRequired,
    onJobSelected: PropTypes.func.isRequired,
    type: PropTypes.string,
};

const MarketplaceJobTableFragment = createFragmentContainer(
    (props) => {
        const { data: { jobs = [], profileComplete }, onJobSelected } = props;
        return <Index
            jobs={ jobs }
            profileComplete={ profileComplete }
            onJobSelected={ onJobSelected }
        />;
    },
    {
        data: graphql`
            fragment MarketplaceJobTable_data on Viewer {
                profileComplete
                jobs: marketplaceJobs {
                    id
                    state
                    title
                    suburb
                    type
                    published
                    created
                    expires
                    feePercentage
                    salary
                    term
                    searchType
                    recruiterCount
                    candidateCount
                    maxRate
                    minRate
                    rateType
                    myApplication {
                        id
                        status
                        briefingRequests {
                            id
                            dateTime
                            endDate
                            status
                            notes
                            whoWillCall
                            numberToCall
                        }
                    }
                }
            }
        `,
    },
);

export default MarketplaceJobTableFragment;
