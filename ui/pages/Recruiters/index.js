import React               from 'react';
import PropTypes           from 'prop-types';
import {
    graphql,
    QueryRenderer,
}                          from 'react-relay';
import { environment }     from '../../../api';
import ErrorComponent      from '../../components/ErrorComponent';
import LoaderComponent     from '../../components/LoaderComponent';
import RecruitersComponent from './RecruitersComponent';

const EMPLOYER_RECRUITERS_LIST_QUERY = graphql`
    query RecruitersPageQuery($relationshipType: RecruiterRelationshipType) {
        viewer {
            psaCount: recruiterCount(type: PSA)
            recentCount: recruiterCount(type: Recent)
            favouriteCount: recruiterCount(type: Favourite)
            ...RecruiterTable_data @arguments(relationshipType: $relationshipType)
        }
    }
`;

const recruiterRelationshipTypes = {
    psa: 'PSA',
    favourite: 'Favourite',
    recent: 'Recent',
};
const asRelationshipType = val => {
    let possibleItem = recruiterRelationshipTypes[ (val || 'recent').toLowerCase() ];
    if (typeof possibleItem === 'undefined') {
        possibleItem = 'recent';
    }
    return possibleItem;
};

const RecruitersView = (props) => {
    const { match, history } = props;
    return (
        <QueryRenderer
            environment={ environment }
            query={ EMPLOYER_RECRUITERS_LIST_QUERY }
            variables={ {
                relationshipType: asRelationshipType(match.params.tab),
            } }
            render={ ({ error, props: data }) => {
                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                if (!data && !error) {
                    return <LoaderComponent row />;
                }

                return (
                    <RecruitersComponent
                        data={ data.viewer }
                        tab={ match.params.tab }
                        history={ history }
                    />
                );
            } }
        />
    );
};

RecruitersView.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default RecruitersView;
