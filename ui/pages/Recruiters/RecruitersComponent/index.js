import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import {
    RecruiterTableFragment,
}                                     from '../../../components/Recruiter/RecruiterTable';
import RecruiterFilter                from '../RecruiterFilter';
import { RecruiterFilters }           from '../../../../constants';
import {
    Row,
}                                     from 'reactstrap';
import classNames                     from 'classnames';
import styles                         from './styles.scss';

class RecruitersComponent extends Component {
    state = {
        filterText: '',
    };

    onChangeFilter = filter => {
        if (filter === RecruiterFilters.recent) {
            this.props.history.push('/recruiters');
        } else {
            this.props.history.push(`/recruiters/${ filter }`);
        }
    };

    onChangeFilterText = filterText => {
        this.setState({ filterText });
    };

    filterRecruiter = recruiter => {
        if (this.state.filterText.length > 0) {
            return (
                `${ recruiter.firstName } ${ recruiter.lastName }`
                    .toLowerCase()
                    .indexOf(this.state.filterText.toLowerCase()) >= 0
            );
        }
        return true;
    };

    render() {
        const { data, tab } = this.props;
        const { psaCount, recentCount, favouriteCount } = data;

        return <Fragment>
            <Row className="sub-nav no-gutters">
                <RecruiterFilter
                    activeFilter={ tab || RecruiterFilters.recent }
                    psaCount={ psaCount }
                    recentCount={ recentCount }
                    favouriteCount={ favouriteCount }
                    onChangeFilter={ this.onChangeFilter }
                    onChangeFilterText={ this.onChangeFilterText }
                    filterText={ this.state.filterText }
                />
            </Row>
            <div
                className={ classNames(
                    styles.row,
                ) }
            >
                <RecruiterTableFragment
                    type="list"
                    data={ data }
                    filterText={ this.state.filterText }
                    filter={ this.filterRecruiter }
                    isPsa={ tab === 'psa' }
                />
            </div>
        </Fragment>;
    }
}

RecruitersComponent.propTypes = {
    data: PropTypes.object,
    history: PropTypes.object.isRequired,
    tab: PropTypes.string,
};

export default RecruitersComponent;
