import React, { Fragment } from 'react';
import PropTypes           from 'prop-types';
import MarkdownComponent   from '../../../components/MarkdownComponent';
import {
    PropertyValue,
    PropertyKey,
}                          from '../../../components/PropertyList';
import {
    JobSalary,
    JobType,
    JobSearchType,
    JobFee,
}                          from '../../../../util/getSalary';
import JobStatusComponent  from '../../../components/JobStatusComponent';
import { Money }           from '../../../components/Misc';
import styles              from './styles.scss';

const JobTabDescriptionComponent = (props) => {
    const { job, isEmployer } = props;
    return (
        <div className={ styles.tab }>
            <div className={ styles.titleBox }>
                <h2>{ job.title }</h2>
                { job.myApplication &&
                (job.myApplication.status === 'engaged' || job.myApplication.status === 'invited') &&
                <h4>{ job.company.name }</h4> }
                <h3>{ job.suburb }{ ' ' }{ job.state }</h3>
            </div>
            <div className={ styles.mainInfoBox }>
                {
                    !isEmployer && job.myApplication &&
                    (job.myApplication.status === 'engaged' || job.myApplication.status === 'invited') &&
                    <div className={ styles.mainInfoItem }>
                        <PropertyValue>
                            { job.postedBy.firstName }
                        </PropertyValue>
                        <PropertyKey>Job Contact</PropertyKey>
                    </div>
                }
                <div className={ styles.mainInfoItem }>
                    <PropertyValue>{ job.category ? job.category.name : 'Unknown' }</PropertyValue>
                    <PropertyKey>Job Category</PropertyKey>
                </div>
                { isEmployer && <div className={ styles.mainInfoItem }>
                    <PropertyValue>
                        <JobSearchType job={ job } />
                    </PropertyValue>
                    <PropertyKey>Search Type</PropertyKey>
                </div> }
                { isEmployer && <div className={ styles.mainInfoItem }>
                    <PropertyValue>
                        <JobStatusComponent
                            icon={ false }
                            data={ job }
                        />
                    </PropertyValue>
                    <PropertyKey>Job Status</PropertyKey>
                </div> }
                <div className={ styles.mainInfoItem }>
                    <PropertyValue>
                        <JobType job={ job } />
                    </PropertyValue>
                    <PropertyKey>Job Type</PropertyKey>
                </div>
                <div className={ styles.mainInfoItem }>
                    <PropertyValue>{ job.vacancies }</PropertyValue>
                    <PropertyKey>Number of vacancies</PropertyKey>
                </div>
                <div className={ styles.mainInfoItem }>
                    <PropertyValue>
                        <JobSalary job={ job } />
                    </PropertyValue>
                    <PropertyKey>
                        { job.type === 'temp'
                            ? ({
                            daily: 'Daily',
                            hourly: 'Hourly',
                        }[ job.rateType ] || '') + ' Rate'
                            : 'Base + Super + Car Allowance' }
                    </PropertyKey>
                </div>
                { job.type === 'temp' && (
                    <div className={ styles.mainInfoItem }>
                        <PropertyValue>
                            { job.rateType || 'Not set' }
                        </PropertyValue>
                        <PropertyKey>Rate Type</PropertyKey>
                    </div>
                ) }
                { job.type !== 'temp' && (
                    <div className={ styles.mainInfoItem }>
                        <PropertyValue>{ job.feePercentage }%</PropertyValue>
                        <PropertyKey>Fee Percentage</PropertyKey>
                    </div>
                ) }
                { job.type !== 'temp' && (
                    <div className={ styles.mainInfoItem }>
                        <PropertyValue color="pink">
                            <Money>{ JobFee({ job }) }</Money>
                        </PropertyValue>
                        <PropertyKey>Notional Fee</PropertyKey>
                    </div>
                ) }

                { !isEmployer && job.company.agencyRelationship && job.company.agencyRelationship.isPsa && <Fragment>
                    <div className={ styles.mainInfoItem }>
                        <PropertyValue>
                            { job.company.agencyRelationship.psaDocument.map((it, index) => (
                                <a
                                    className="psa-document-url"
                                    href={ it.url }
                                    key={ index }
                                >
                                    { it.name }
                                </a>
                            )) }
                        </PropertyValue>
                        <PropertyKey>PSA Documents</PropertyKey>
                    </div>
                </Fragment> }
            </div>

            <hr />

            <div className={ styles.box }>
                <h5 className={ styles.titleMargin }>Job documents</h5>
                { job.files.length === 0 && <em>No documents are available</em> }
                { job.files.map(file => (
                    <a
                        key={ file.id }
                        className={ styles.document }
                        href={ file.url }
                    >
                        { file.name }
                    </a>
                )) }
            </div>

            <hr />

            <div className={ styles.box }>
                <div>
                    <h5 className={ styles.titleMargin }>Job Description</h5>
                    <MarkdownComponent source={ job.description || '_No information_' } />
                </div>

                <div>
                    <h5 className={ styles.titleMargin }>Who are you looking for</h5>
                    <MarkdownComponent source={ job.whoLookingFor || '_No information_' } />
                </div>

                <div>
                    <h5 className={ styles.titleMargin }>Company Overview</h5>
                    <MarkdownComponent source={ job.companyOverview || '_No information_' } />
                </div>

                <div>
                    <h5 className={ styles.titleMargin }>Detailed Compensation Benefits</h5>
                    <MarkdownComponent source={ job.compensationAndBenefits || '_No information_' } />
                </div>
            </div>
        </div>
    );
};

JobTabDescriptionComponent.propTypes = {
    isEmployer: PropTypes.bool,
    job: PropTypes.object.isRequired,
};

export default JobTabDescriptionComponent;
