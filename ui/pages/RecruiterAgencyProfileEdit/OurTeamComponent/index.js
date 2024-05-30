import React                 from 'react';
import PropTypes             from 'prop-types';
import { generatePath }      from 'react-router-dom';
import AlertComponent        from '../../../components/AlertComponent';
import ProfileRowComponent   from '../../../components/ProfileRowComponent';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
} from '../../../components/ButtonComponent';
import { ROUTES, TEAM_TAB } from '../../../../constants';

const OurTeamComponent = (props) => {
    const { recruiters } = props;
    return (
        <div>
            <AlertComponent>
                <span>Below are all team members currently associated with your agency. You can manage your team{ ' ' }
                <ButtonComponent
                    to={ generatePath(
                        ROUTES.AGENCY_RECRUITERS,
                        { [TEAM_TAB._NAME]: TEAM_TAB.ACTIVE },
                    ) }
                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                    size={ BUTTON_SIZE.SMALL
                    }
                >
                    here
                </ButtonComponent>
                </span>

            </AlertComponent>
            { !recruiters.length && <div>There are currently no team</div> }
            {
                recruiters.map(recruiter => (
                    <ProfileRowComponent
                        isInnerApp
                        slug={ recruiter.slug }
                        name={ `${recruiter.firstName} ${recruiter.lastName}` }
                        location={
                            (recruiter.city || recruiter.state)
                            && `${recruiter.state || ''} ${recruiter.city || ''}`
                        }
                        url={ recruiter.profilePhoto && recruiter.profilePhoto.url }
                        id={ recruiter.id }
                        key={ recruiter.id }
                        rating={ recruiter.rating && recruiter.rating.overallRating }
                        reviewsCount={ recruiter.rating && recruiter.rating.reviewsCount }
                        specialisations={ recruiter.specialisations }
                    />
                ))
            }
        </div>
    );
};

OurTeamComponent.propTypes = {
    recruiters: PropTypes.array,
};

export default OurTeamComponent;
