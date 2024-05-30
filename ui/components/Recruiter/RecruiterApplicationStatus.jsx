import React                                from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import FontAwesomeIcon                      from '@fortawesome/react-fontawesome';
import UnpublishedIcon                      from '@fortawesome/fontawesome-free-solid/faCircle';
import PublishedIcon                        from '@fortawesome/fontawesome-free-solid/faCircle';
import './RecruiterApplicationStatus.scss';

const RecruiterApplicationStatus =  createFragmentContainer(
    ({ data }) => {
        const status = data && data.status ? data.status : 'Unapplied';
        let realStatus = status;
        if (status === 'pending_open') {
            realStatus = 'open';
        }
        if (status === 'invite_pending') {
            realStatus = 'invited';
        }
        return (
            <span
                className={ `recruiter-application-status recruiter-application-status__${ realStatus }` }
            >
                <FontAwesomeIcon
                    icon={ realStatus === 'engaged' ? PublishedIcon : UnpublishedIcon }
                />{ ' ' }
                { realStatus }
            </span>
        );
    },
    {
        data: graphql`
            fragment RecruiterApplicationStatus_data on RecruiterApplication {
                status
            }
        `
    }
);

export default RecruiterApplicationStatus;
