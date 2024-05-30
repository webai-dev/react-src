import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import {
    graphql,
    QueryRenderer,
}                           from 'react-relay';
import { environment }      from '../../../../../api';
import NPSRankingComponent  from './NPSRankingComponent';

const NPS_RANKING_QUERY = graphql`
    query NPSRankingContainerQuery(
        $id: ID!,
        $groupRankingBy: String!
    ) {
        node(id: $id) {
            ... on Recruiter {
                npsRanking(groupBy: $groupRankingBy) {
                    rows {
                        name
                        responses
                        score
                        vsBenchmark
                    }
                    benchmark
                }
            }
            ... on Agency {
                npsRanking(groupBy: $groupRankingBy) {
                    rows {
                        name
                        responses
                        score
                        vsBenchmark
                    }
                    benchmark
                }
            }
        }
    }
`;

class NPSRankingContainer extends Component {
    state = {
        selectedRecruiterId: null,
        groupRankingBy: NPSRankingComponent.GROUP_BY.JOB_CATEGORY
    };

    /**
     * Select how to group ranking on dashboard nps page
     *
     * @param {string} groupRankingBy - group nps ranking by
     */
    handleSelectGroupRankingBy = (groupRankingBy) => {
        this.setState({ groupRankingBy });
    };

    render() {
        const { groupRankingBy } = this.state;
        const { handleSelectGroupRankingBy } = this;
        const { id } = this.props;

        return (
            <QueryRenderer
                environment={ environment }
                variables={ {
                    id,
                    groupRankingBy: groupRankingBy
                } }
                query={ NPS_RANKING_QUERY }
                render={ ({ props: data, error }) => {
                    return <NPSRankingComponent
                        error={ error }
                        isLoading={ !data && !error }
                        npsRanking={ data?.node.npsRanking }
                        handleSelectGroupRankingBy={ handleSelectGroupRankingBy }
                        groupRankingBy={ groupRankingBy }
                    />;
                } }
            />
        );
    }
}

NPSRankingContainer.propTypes = {
    id: PropTypes.string.isRequired,
};

export default NPSRankingContainer;
