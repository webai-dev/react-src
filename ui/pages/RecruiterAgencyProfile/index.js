import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    ROUTES,
    PARAM_SLUG,
} from '../../../constants';
import LoaderComponent                 from '../../components/LoaderComponent';
import ErrorComponent                  from '../../components/ErrorComponent';
import RecruiterAgencyProfileComponent from './RecruiterAgencyProfileComponent';
import {
    graphql,
    QueryRenderer,
} from 'react-relay';
import { environment } from '../../../api';

const QUERY_RECRUITER = graphql`
    query RecruiterAgencyProfileRecruiterQuery($slug: String!, $type: String! $self: Boolean!, $other: Boolean!) {
        ...MainInfoContainerRecruiter_profileData @arguments(slug: $slug, type: $type, self: $self, other: $other)
        ...AdditionalInfoContainerRecruiter_profileData @arguments(slug: $slug, type: $type, self: $self, other: $other)
    }
`;
const QUERY_AGENCY = graphql`
    query RecruiterAgencyProfileAgencyQuery($slug: String!, $type: String! $self: Boolean!, $other: Boolean!) {
        ...MainInfoContainerAgency_profileData @arguments(slug: $slug, type: $type, self: $self, other: $other)
        ...AdditionalInfoContainerAgency_profileData @arguments(slug: $slug, type: $type, self: $self, other: $other)
    }
`;

class RecruiterAgencyProfile extends PureComponent {
    render() {
        const { match: { params, path } } = this.props;

        const slug = params[ PARAM_SLUG ];
        const isAgency = ROUTES.AGENCY_PROFILE === path || ROUTES.AGENCY_PROFILE_PREVIEW === path;

        return (
            <QueryRenderer
                environment={ environment }
                query={ isAgency ? QUERY_AGENCY : QUERY_RECRUITER }
                variables={ {
                    slug: slug || 'null',
                    type: isAgency ? 'agency' : 'recruiter',
                    self: !slug,
                    other: !!slug,
                } }
                render={
                    ({ error, props: data }) => {
                        if (error) {
                            return <ErrorComponent error={ error } />;
                        }
                        if (!data && !error) {
                            return <LoaderComponent row />;
                        }

                        return (
                            <RecruiterAgencyProfileComponent
                                profileData={ data }
                            />
                        );
                    }
                }
            />
        );
    }
}

RecruiterAgencyProfile.propTypes = {
    match: PropTypes.object,
};

export default RecruiterAgencyProfile;
