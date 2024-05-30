import React               from 'react';
import PropTypes           from 'prop-types';
import ProfileRowComponent from '../../../components/ProfileRowComponent';
import styles              from './styles.scss';

const OurTeamComponent = (props) => {
	const { recruiters } = props;
    return (
        <div className={ styles.box }>
            { !recruiters.length && <div>There are currently no team</div> }
            { 
                recruiters.map(recruiter => (
                    <ProfileRowComponent
                        name={ `${recruiter.firstName} ${recruiter.lastName}` }
                        city={ recruiter.city }
                        state={ recruiter.state }
                        url={ recruiter.profilePhoto && recruiter.profilePhoto.url }
                        slug={ recruiter.slug }
                        key={ recruiter.id }
                        rating={ recruiter.rating && recruiter.rating.overallRating }
                        reviewsCount={ recruiter.rating && recruiter.rating.reviewsCount }
                        recruiterAgency={ recruiter.agency }
                    />
                ))
            }
        </div>
    );
};

OurTeamComponent.propTypes = {
    recruiters: PropTypes.array.isRequired,
};

export default OurTeamComponent;
