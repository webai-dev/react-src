import React                      from 'react';
import PropTypes                  from 'prop-types';
import { graphql, QueryRenderer } from 'react-relay';
import { environment }            from '../../../api';
import ErrorComponent             from '../../components/ErrorComponent';
import LoaderComponent            from '../../components/LoaderComponent';
import MarketplaceJobTable        from './MarketplaceJobTable';
import { Row, Col }               from 'reactstrap';
import NotMPOModal                from '../../components/NotMPOModal';
import { ROUTES }                 from '../../../constants';

export const JobsMarketplaceView = (props) => {
    const { history } = props;
    return (
        <QueryRenderer
            environment={ environment }
            query={ graphql`
            query JobsMarketplacePageQuery($jobStatus: JobStatusFilter) {
                viewer {
                    mpoApproved
                    ...MarketplaceJobTable_data @arguments(jobStatus: $jobStatus)
                }
            }
        ` }
            variables={ { jobStatus: 'Active' } }
            render={ ({ error, props: data }) => {
                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                if (!data && !error) {
                    return <LoaderComponent row />;
                }

                if (!data.viewer.mpoApproved) {
                    return <NotMPOModal handleCloseModal={ () => { props.history.push(ROUTES.DASHBOARD_REVIEWS);} } />;
                }
                return (
                    <Row key="marketplace-table-row" className="mb-3">
                        <Col>
                            <MarketplaceJobTable
                                data={ data.viewer }
                                onJobSelected={ job => {
                                    history.push(`/marketplace/job/${ job.id }`);
                                } }
                            />
                        </Col>
                    </Row>
                );
            } }
        />
    );
};

JobsMarketplaceView.propTypes = {
    history: PropTypes.object.isRequired,
};

export default JobsMarketplaceView;
