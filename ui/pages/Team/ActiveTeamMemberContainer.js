import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    graphql,
    QueryRenderer,
} from 'react-relay';
import {
    environment,
} from '../../../api';
import ActiveTeamMemberComponent from './ActiveTeamMemberComponent';

const MEMBER_QUERY = graphql`
    query ActiveTeamMemberContainerQuery($id: ID!) {
        node(id: $id) {
            ... on User {
                    id
                    email
                    firstName
                    lastName
                    contactNumber
                    profilePhoto {
                        url
                    }
                }
                ... on Recruiter {
                    id
                    email
                    firstName
                    lastName
                    city
                    state
                    contactNumber
                    profilePhoto {
                        url
                    }
                }
        }
    }
`;

class ActiveTeamMemberContainer extends PureComponent {
    render() {
        const { handleCloseModal, id } = this.props;
        return (
            <QueryRenderer
                environment={ environment }
                query={ MEMBER_QUERY }
                variables={ { id } }
                render={
                    ({ error, props: data }) => {
                        const isLoading = !data && !error;

                        const member = data && data.node;

                        return (
                            <ActiveTeamMemberComponent
                                handleCloseModal={ handleCloseModal }
                                isLoading={ isLoading }
                                member={ member }
                            />
                        );
                    }
                }
            />
        );
    }
}

ActiveTeamMemberContainer.propTypes = {
    id: PropTypes.string.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
};

export default ActiveTeamMemberContainer;
