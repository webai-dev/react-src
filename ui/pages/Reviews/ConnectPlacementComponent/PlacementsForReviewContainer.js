import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import {
    graphql, QueryRenderer,
}                               from 'react-relay';
import {
    environment,
}                               from '../../../../api';
import ErrorComponent           from '../../../components/ErrorComponent';
import FormsySelectComponent    from '../../../components/formsy/FormsySelectComponent';
import LoaderComponent          from '../../../components/LoaderComponent';

const PLACEMENTS_QUERY = graphql`
    query PlacementsForReviewContainerQuery($excludeReviewType: String) {
        viewer {
            placements(excludeReviewType: $excludeReviewType) {
                id
                jobTitle
            }
        }
    }
`;


class SendReminderContainer extends PureComponent {
    render() {
        const { isCandidate, className, selectClassName } = this.props;
        return (
            <QueryRenderer
                environment={ environment }
                query={ PLACEMENTS_QUERY }
                variables={ {
                    excludeReviewType: !isCandidate ? 'Employer' : 'Candidate',
                } }
                render={ ({ error, props: data }) => {
                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (!data && !error) {
                        return <LoaderComponent row />;
                    }

                    return (
                        <FormsySelectComponent
                            required
                            label="Placement"
                            name="placementId"
                            className={ className }
                            selectClassName={ selectClassName }
                            values={ data.viewer.placements.map(placement => ({
                                key: placement.id,
                                label: placement.jobTitle,
                            })) }
                        />
                    );
                } }
            />
        );
    }
}

SendReminderContainer.propTypes = {
    isCandidate: PropTypes.bool,
    className: PropTypes.string,
    selectClassName: PropTypes.string,
};

export default SendReminderContainer;
