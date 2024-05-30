import React                  from 'react';
import Avatar                 from './Avatar';
import CandidateImage         from '../../../images/candidate_avatar.png';
import AddToFavoriteContainer from '../../components/AddToFavoriteContainer';
import styles                 from './ProfileSnippet.scss';

const ProfileAvatar = (props) => {
    const { name, ...otherProps } = props;
    return (
        <Avatar
            name={ name } { ...otherProps }
            className="profile-snippet--avatar"
        />
    );
};

const RecruiterProfileSnippet = (props) => {
    const {
        recruiter = {},
        avatarProps = {},
        withAvatar = true,
        withName = true,
        withFullName = true,
        onClick = undefined
    } = props;
    const {
        firstName,
        lastName,
        agency,
        profilePhoto = { url: undefined }
    } = recruiter;
    const isPsa = agency && agency.agencyRelationship && agency.agencyRelationship.isPsa;

    return (
        <div className="profile-snippet">
            { withAvatar && (
                <ProfileAvatar
                    { ...avatarProps }
                    name={ `${ firstName } ${ lastName }` }
                    src={ profilePhoto ? profilePhoto.url : undefined }
                    key="recruiter-avatar"
                />
            ) }
            { withName && (
                <div
                    className="mr-1 ml-1"
                    key="recruiter-details"
                >
                    <h3
                        onClick={ onClick }
                        className={ styles.header }
                    >
                        { withFullName ? `${ firstName } ${ lastName }` : firstName }
                        { !isPsa && (
                            <AddToFavoriteContainer
                                className={ styles.favorite }
                                id={ recruiter.id }
                                small
                                noAction
                            />
                        ) }
                    </h3>
                    { agency && <div className="profile-snippet--company">
                        { agency.name } { agency.state && `(${ agency.state })` }{ ' ' }
                        { isPsa && <span className="psa-state">PSA</span> }
                    </div> }
                </div>
            ) }
        </div>
    );
};

const CandidateProfileSnippet = (props) => {
    const {
        candidate: { firstName, lastName },
        withAvatar = true,
        withName = true,
        withFullName = true,
        avatarProps = {},
        onClick = undefined
    } = props;
    return (
        <div className="profile-snippet">
            { withAvatar && (
                <ProfileAvatar
                    { ...avatarProps }
                    name={ `${ firstName } ${ lastName }` }
                    src={ CandidateImage }
                    key="candidate-avatar"
                />
            ) }
            { withName && (
                <div
                    key="candidate-details"
                    className="mr-1 ml-1"
                >
                    <h3
                        onClick={ onClick }
                        className={ styles.header }
                    >
                        { withFullName ? `${ firstName } ${ lastName }` : firstName }
                    </h3>
                    <div className={ styles.info }>Candidate</div>
                </div>
            ) }
        </div>
    );
};

const UserProfileSnippet = (props) => {
    const {
        user: { firstName, lastName },
        withAvatar = true,
        withName = true,
        withFullName = true,
        avatarProps = {},
        onClick = undefined
    } = props;
    return (
        <div className="profile-snippet">
            { withAvatar && (
                <ProfileAvatar
                    { ...avatarProps }
                    name={ `${ firstName } ${ lastName }` }
                    key="candidate-avatar"
                />
            ) }
            { withName && (
                <div
                    key="candidate-details"
                    className="mr-1 ml-1"
                >
                    <h3
                        onClick={ onClick }
                        className={ styles.header }
                    >
                        { withFullName ? `${ firstName } ${ lastName }` : firstName }
                    </h3>
                    <div className={ styles.info }>User</div>
                </div>
            ) }
        </div>
    );
};

const ProfileSnippet = (props) => {
    const { type, profile, ...restProps } = props;
    const lowerType = (type || '').toLowerCase();
    if (lowerType === 'recruiter') {
        return <RecruiterProfileSnippet { ...restProps } recruiter={ profile } />;
    }
    if (lowerType === 'candidate') {
        return <CandidateProfileSnippet { ...restProps } candidate={ profile } />;
    }
    if (lowerType === 'user') {
        return <UserProfileSnippet { ...restProps } user={ profile } />;
    }

    return <div>Unknown { type }</div>;
};

export default ProfileSnippet;
