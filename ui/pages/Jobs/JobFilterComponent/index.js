import React                            from 'react';
import Relay, { graphql }               from 'react-relay';
import { JobFilters }                   from '../../../../constants';
import Tabs                             from '../../../components/Tabs/Tabs';
import Tab                              from '../../../components/Tabs/Tab';
import { Col, Form, Input, InputGroup } from 'reactstrap';
import { Button }                       from '../../../components/Button';
import Badge                            from '../../../components/Badge';
import FontAwesomeIcon                  from '@fortawesome/react-fontawesome';
import SearchIcon                       from '@fortawesome/fontawesome-free-solid/faSearch';
import './styles.scss';

const JobFilter = Relay.createFragmentContainer(
    ({
         data,
         activeFilter = JobFilters.all,
         visible = [ 'all', 'draft', 'active', 'closed' ],
         onChangeFilter = () => {
             return true;
         },
         onChangeFilterText = () => {
             return true;
         },
         filterText = ''
     }) => [
        <Col
            xs={ 12 }
            md={ 8 }
            className="job-filter"
            key="job-filter"
        >
            <Tabs
                activeTab={ activeFilter }
                onChangeTab={ filter => onChangeFilter(filter) }
                className="job-table-filter"
            >
                { visible.indexOf('all') >= 0 && (
                    <Tab tabId={ JobFilters.all }>
                        All Jobs{ ' ' }
                        <Badge>
                            { visible.reduce((count, it) => {
                                return count + data[ it + 'Count' ] || 0;
                            }, 0) }
                        </Badge>
                    </Tab>
                ) }
                { visible.indexOf('pending') >= 0 && (
                    <Tab tabId={ JobFilters.pending }>
                        Pending Jobs <Badge>{ data.pendingCount || 0 }</Badge>
                    </Tab>
                ) }
                { visible.indexOf('draft') >= 0 && (
                    <Tab tabId={ JobFilters.draft }>
                        Draft Jobs <Badge>{ data.draftCount || 0 }</Badge>
                    </Tab>
                ) }
                { visible.indexOf('active') >= 0 && (
                    <Tab tabId={ JobFilters.active }>
                        Active Jobs <Badge>{ data.activeCount || 0 }</Badge>
                    </Tab>
                ) }
                { visible.indexOf('closed') >= 0 && (
                    <Tab tabId={ JobFilters.closed }>
                        Closed Jobs <Badge>{ data.closedCount || 0 }</Badge>
                    </Tab>
                ) }
            </Tabs>
        </Col>,
        <Col
            xs={ 12 }
            md={ 4 }
            key="job-search"
        >
            <Form
                onSubmit={ e => {
                    e.preventDefault();
                    return false;
                } }
            >
                <InputGroup>
                    <Input
                        type="search"
                        name="search"
                        placeholder="Find a job..."
                        value={ filterText }
                        onChange={ e => onChangeFilterText(e.target.value) }
                    />
                    <Button
                        color="link"
                        type="submit"
                    >
                        <FontAwesomeIcon
                            className="search-icon"
                            icon={ SearchIcon }
                        />
                    </Button>
                </InputGroup>
            </Form>
        </Col>
    ],
    {
        data: graphql`
            fragment JobFilterComponent_data on Viewer {
                pendingCount: jobCount(status: Pending)
                activeCount: jobCount(status: Active)
                closedCount: jobCount(status: Closed)
                draftCount: jobCount(status: Draft)
            }
        `
    }
);

export default JobFilter;
