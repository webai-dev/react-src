import React, { Fragment } from 'react';
import Currency            from 'react-currency-formatter';

export const Money = ({ children: money }) => {
    return (
        <Currency
            quantity={ money } // Required
            currency="AUD" // Optional (USD by default)
        />
    );
};

export const TempJobSalary = ({ job }) => {
    return !job.minRate && !job.minRate ? (
        <span>Not set</span>
    ) : (
        <Fragment>
            { job.minRate ? <Money>{ job.minRate }</Money> : <span>Not set</span> }{ ' ' }-{ ' ' }
            { job.maxRate ? <Money>{ job.maxRate }</Money> : <span>Not set</span> }
        </Fragment>
    );
};
export const NormJobSalary = ({ job }) => <Money>{ job.salary }</Money>;

export const JobSalary = ({ job }) =>
    job.type === 'temp' ? <TempJobSalary job={ job } /> : <NormJobSalary job={ job } />;

export const JobType = ({ job }) => (
    <span className={ `job-type--descriptor job-type--descriptor__${ job.type }` }>
        { job.type === 'fixed-term'
            ? `Fixed Term - ${ job.term } weeks`
            : job.type === 'permanent'
                ? 'Permanent'
                : `Temp - ${ job.term } weeks` }
    </span>
);

export const JobSearchType = ({ job }) => (job.searchType === 'network' ? 'Network' : 'Exclusive');
const TempJobFee = ({ job, type }) => job[ type + 'Rate' ];
const PermanentJobFee = (job) => Math.round(job.salary * (job.feePercentage / 100));
const FixedTermJobFee = (job) => Math.round((Math.min(
    job.term,
    52,
) / 52) * (job.feePercentage / 100) * job.salary);
export const JobFee = ({ job, type }) => {

    if (job.type === 'fixed-term') {
        return FixedTermJobFee(job);
    }
    if (job.type === 'permanent') {
        return PermanentJobFee(job);
    }
    return TempJobFee({
        job: job,
        type,
    });
};
