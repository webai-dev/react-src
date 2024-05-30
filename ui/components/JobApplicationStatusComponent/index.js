import React           from 'react';
import PropTypes       from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import UnpublishedIcon from '@fortawesome/fontawesome-free-solid/faCircle';
import PublishedIcon   from '@fortawesome/fontawesome-free-solid/faCircle';
import './styles.scss';

const JobApplicationStatusComponent = (props) => {
    const { jobApplication } = props;
    const status = jobApplication.status,
        icon = status === 'active' ? PublishedIcon : UnpublishedIcon;

    return (
        <span className={ `job-application-status job-application-status__${ status }` }>
            <FontAwesomeIcon icon={ icon } /> { status }
        </span>
    );
};

JobApplicationStatusComponent.propTypes = {
    jobApplication: PropTypes.object.isRequired,
};

export default JobApplicationStatusComponent;
