import React                                from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import FontAwesomeIcon                      from '@fortawesome/react-fontawesome';
import UnpublishedIcon                      from '@fortawesome/fontawesome-free-regular/faCircle';
import PublishedIcon                        from '@fortawesome/fontawesome-free-solid/faCircle';
import './styles.scss';

const JobStatus = createFragmentContainer(
    ({ data: { status = 'draft' }, icon = true }) => {
        let realStatus = status,
            textStatus = status;

        if (status === 'pending_open') {
            realStatus = 'open';
            textStatus = 'Open';
        }

        if (status === 'filled') {
            realStatus = 'open';
        }

        if (status === 'engaged') {
            realStatus = 'open';
        }

        return (
            <span className={ `job-status job-status__${ status }` }>
                { icon && (
                    <FontAwesomeIcon
                        icon={ realStatus === 'open' ? PublishedIcon : UnpublishedIcon }
                    />
                ) }{ ' ' }
                { textStatus || realStatus }
            </span>
        );
    },
    {
        data: graphql`
            fragment JobStatusComponent_data on Job {
                status
            }
        `
    }
);

export default JobStatus;
