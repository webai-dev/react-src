import React, {
    Fragment,
}                                       from 'react';
import PropTypes                        from 'prop-types';
import {
    graphql,
    QueryRenderer,
}                                       from 'react-relay';
import { Link }                         from 'react-router-dom';
import { environment }                  from '../../../api';
import { generatePath }                 from 'react-router-dom';
import {
    ROUTES,
    PARAM_SLUG,
}                                       from '../../../constants';
import LinkedinImage                    from '../../../images/linkedin.png';
import AvatarComponent                  from '../../components/AvatarComponent';
import ErrorComponent                   from '../../components/ErrorComponent';
import LoaderComponent                  from '../../components/LoaderComponent';
import ButtonComponent, { BUTTON_TYPE } from '../../components/ButtonComponent';
import { Button }                       from '../../components/Button';
import RatingComponent                  from '../../components/Form/RatingComponent';
import AddToFavoriteContainer           from '../../components/AddToFavoriteContainer';
import {
    Badge,
}                                       from 'reactstrap';
import FixedInputComponent              from '../../components/Form/FixedInputComponent';
import RequiresPermission               from '../../components/User/RequiresPermission';
import MarkdownComponent                from '../../components/MarkdownComponent';
import styles                           from './RecruiterPage.scss';

const BaseRecruiterView = (props) => {
    const { recruiter, showBackButton = true } = props;

    const { agency } = recruiter;
    const { agencyRelationship } = agency || {};
    const { isPsa, psaDocument } = agencyRelationship || {};

    return (
        <Fragment>
            { showBackButton && (
                <Button
                    to={ '/recruiters' }
                    tag={ Link }
                    key="back-button"
                >
                    Back
                </Button>
            ) }
            <div className="recruiter--action-buttons">
                { !isPsa && (
                    <AddToFavoriteContainer
                        big
                        id={ recruiter.id }
                    />
                ) }
                { isPsa && (
                    <Badge
                        className={ styles.button }
                        color="empty-value"
                        style={ {
                            marginTop: 15,
                            marginRight: 20,
                            float: 'left',
                        } }
                    >
                        PSA
                    </Badge>
                ) }
                { recruiter.linkedinUrl && <a
                    className={ styles.button }
                    href={ recruiter.linkedinUrl }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={ {
                        width: 60,
                        height: 60,
                        float: 'left',
                        flex: '0 0 auto',
                    } }
                >
                    <img
                        src={ LinkedinImage }
                        alt={ recruiter.linkedinUrl }
                    />
                </a> }
                <ButtonComponent
                    className={ styles.button }
                    btnType={ BUTTON_TYPE.ACCENT }
                    target="_blank"
                    rel="noopener noreferrer"
                    to={ generatePath(
                        ROUTES.RECRUITER_PROFILE,
                        {
                            [ PARAM_SLUG ]: recruiter.slug,
                        },
                    ) }
                >
                    View profile
                </ButtonComponent>
            </div>
            <div className={ styles.avatarBox }>
                <AvatarComponent
                    className={ styles.avatar }
                    url={ recruiter.profilePhoto && recruiter.profilePhoto.url }
                    alt={ `${ name } avatar` }
                />
            </div>

            { isPsa && <strong
                className="text-center"
                style={ {
                    display: 'block',
                    margin: '-10px 0 0 0',
                } }
            >
                { psaDocument.map(doc => (
                    <a
                        style={ { textDecoration: 'underline' } }
                        key={ doc.id }
                        href={ doc.url }
                    >
                        Download PSA Document
                    </a>
                )) }
            </strong>
            }
            <div className={ styles.infoBox }>
                <FixedInputComponent
                    className={ styles.infoItem }
                    value={ recruiter.firstName }
                    name="firstName"
                    label="First Name"
                />
                <FixedInputComponent
                    className={ styles.infoItem }
                    value={ recruiter.lastName }
                    name="lastName"
                    label="Last Name"
                />
                <FixedInputComponent
                    className={ styles.infoItem }
                    value={ recruiter.email }
                    name="email"
                    label="Email"
                />
                <FixedInputComponent
                    className={ styles.infoItem }
                    value={ recruiter.userType || 'Recruiter' }
                    name="userType"
                    label="User Type"
                />
                <FixedInputComponent
                    className={ styles.infoItem }
                    value={ `${ recruiter.address } - ${ recruiter.city } - ${ recruiter.state }` }
                    name="location"
                    label="Location"
                />
                <FixedInputComponent
                    className={ styles.infoItem }
                    value={ recruiter.contactNumber }
                    name="contactNumber"
                    label="Contact Number"
                />
            </div>
            <div>
                <div>
                    <h2 className="recruiter--section-title">Specialisations</h2>
                    <MarkdownComponent
                        source={
                            (recruiter.specialisations || []).map(it => it.name)
                                .join(', ') ||
                            '*No information*'
                        }
                    />
                </div>
                <div>
                    <h2 className="recruiter--section-title">About me</h2>
                    <MarkdownComponent source={ recruiter.aboutMe || '*No information*' } />
                </div>
            </div>

            <RequiresPermission roles={ [ 'user' ] }>
                { ((recruiter.rating && recruiter.rating.overallRating) ? (
                    <div>
                        <h2 className="recruiter--section-title">Overall Rating</h2>
                        <RatingComponent
                            fixed
                            small
                            rating={ recruiter.rating.overallRating }
                        />
                    </div>
                ) : null) }
            </RequiresPermission>
        </Fragment>
    );
};

BaseRecruiterView.propTypes = {
    showBackButton: PropTypes.bool,
    recruiter: PropTypes.object.isRequired,
};

export const RecruiterView = (props) => {
    const { recruiterId, showBackButton } = props;
    return (
        <QueryRenderer
            environment={ environment }
            query={ graphql`
            query RecruiterPageQuery($recruiterId: ID!) {
                recruiter: node(id: $recruiterId) {
                    ... on Recruiter {
                        id
                        slug
                        aboutMe
                        placementHistory
                        profilePhoto {
                            url
                            id
                            name
                            path
                        }
                        specialisations {
                            id
                            name
                        }
                        firstName
                        lastName
                        address
                        city
                        state
                        email
                        contactNumber
                        linkedinUrl
                        agency {
                            id
                            slug
                            name
                            logo: photo {
                                url
                                id
                                name
                                path
                            }
                            agencyRelationship {
                                id
                                isPsa
                                psaDocument {
                                    id
                                    name
                                    url
                                }
                            }
                        }
                        recruiterRelationship {
                            id
                            isFavourite
                        }
                        rating {
                            overallRating
                            reviews {
                                postedBy
                                review
                            }
                        }
                    }
                }
            }
        ` }
            variables={ { recruiterId } }
            render={ ({ error, props: data }) => {
                if (error) {
                    return <ErrorComponent error={ error } />;
                }
                if (!data && !error) {
                    return <LoaderComponent row />;
                }

                if (!data.recruiter) {
                    return <span>Recruiter was not found</span>;
                }
                const { recruiter } = data;

                return <BaseRecruiterView
                    recruiter={ recruiter }
                    showBackButton={ showBackButton }
                />;
            } }
        />
    );
};

RecruiterView.propTypes = {
    recruiterId: PropTypes.string.isRequired,
    showBackButton: PropTypes.bool,
};

export default RecruiterView;
