import React, { PureComponent }                            from 'react';
import { generatePath, withRouter }                        from 'react-router-dom';
import PropTypes                                           from 'prop-types';
import { PARAM_PLACEMENT_TYPE, PLACEMENTS_MODALS, ROUTES } from '../../../constants';
import JobAdderComponent                                   from './JobAdderComponent';
import getQueryParams                                      from '../../../util/getQueryParams';
import getQueryString                                      from '../../../util/getQueryString';

class JobAdderContainer extends PureComponent {
    /**
     * Will open modal to send email
     */
    handleOpenModal = () => {
        this.props.history.push(
            generatePath(ROUTES.PLACEMENTS, { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }) +
            getQueryString({ [ PLACEMENTS_MODALS._NAME ]: PLACEMENTS_MODALS.JOBADDER }));
    };

    /**
     * Will close modal to send email
     */
    handleCloseModal = () => {
        this.props.history.push(generatePath(ROUTES.PLACEMENTS, { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }));
    };

    render() {
        const { isJobadderIntegrated, location } = this.props;
        const { handleOpenModal, handleCloseModal } = this;
        const showModal = getQueryParams(location.search)[PLACEMENTS_MODALS._NAME] === PLACEMENTS_MODALS.JOBADDER;

        return (
            <JobAdderComponent
                isJobadderIntegrated={ isJobadderIntegrated }
                showModal={ showModal }
                handleCloseModal={ handleCloseModal }
                handleOpenModal={ handleOpenModal }
            />
        );
    }
}

JobAdderContainer.propTypes = {
    isJobadderIntegrated: PropTypes.bool,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default withRouter(JobAdderContainer);
