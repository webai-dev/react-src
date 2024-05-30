import React                            from 'react';
import { RecruiterFilters }             from '../../../constants';
import Tabs                             from '../../components/Tabs/Tabs';
import Tab                              from '../../components/Tabs/Tab';
import { Col, Form, Input, InputGroup } from 'reactstrap';
import { Button }                       from '../../components/Button';
import Badge                            from '../../components/Badge';
import FontAwesomeIcon                  from '@fortawesome/react-fontawesome';
import SearchIcon                       from '@fortawesome/fontawesome-free-solid/faSearch';
import './RecruiterFilter.scss';

const RecruiterFilter = (props) => {
    const {
        recentCount = 0,
        psaCount = 0,
        favouriteCount = 0,
        activeFilter = RecruiterFilters.recent,
        onChangeFilter = () => {},
        filterText = '',
        onChangeFilterText = () => {
            return true;
        }
    } = props;
    return [
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
                <Tab tabId={ RecruiterFilters.recent }>
                    Recent <Badge>{ recentCount }</Badge>
                </Tab>
                <Tab tabId={ RecruiterFilters.favourite }>
                    Favourite <Badge>{ favouriteCount }</Badge>
                </Tab>
                <Tab tabId={ RecruiterFilters.psa }>
                    PSA Only <Badge>{ psaCount }</Badge>
                </Tab>
            </Tabs>
        </Col>,
        <Col
            xs={ 12 }
            md={ 4 }
            key="job-search"
        >
            <Form>
                <InputGroup>
                    <Input
                        type="search"
                        name="search"
                        id="exampleSearch"
                        placeholder="Find a recuiter..."
                        onChange={ e => onChangeFilterText(e.target.value) }
                        value={ filterText }
                    />
                    <Button color="link">
                        <FontAwesomeIcon
                            className="search-icon"
                            icon={ SearchIcon }
                        />
                    </Button>
                </InputGroup>
            </Form>
        </Col>
    ];
};

export default RecruiterFilter;
