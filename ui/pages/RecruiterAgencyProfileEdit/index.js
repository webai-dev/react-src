import React, { PureComponent }            from 'react';
import PropTypes                           from 'prop-types';
import TEST_IDS                            from '../../../tests/testIds';
import getErrorMessage                     from '../../../util/getErrorMessage';
import RecruiterAgencyProfileEditComponent from './RecruiterAgencyProfileEditComponent';
import LoaderComponent                     from '../../components/LoaderComponent';
import ErrorComponent                      from '../../components/ErrorComponent';
import { toast }                           from 'react-toastify';
import {
    graphql,
    QueryRenderer
}                                          from 'react-relay';
import {
    commitMutation,
    environment,
}                                          from '../../../api';
import {
    ROUTES,
    LOCAL_STORAGE_KEYS,
    PARAM_SLUG,
    isDevelopment,
}                                          from '../../../constants';
import getBase64                           from '../../../util/getBase64';
import localStorageInstance                from '../../../util/LocalStorage';

const QUERY_RECRUITER = graphql`
    query RecruiterAgencyProfileEditRecruiterQuery($slug: String!, $type: String! $self: Boolean!, $other: Boolean!) {
        ...MainInfoContainerRecruiter_profileData @arguments(slug: $slug, type: $type, self: $self, other: $other)
        ...AdditionalInfoContainerRecruiter_profileData @arguments(slug: $slug, type: $type, self: $self, other: $other)
    }
`;
const QUERY_AGENCY = graphql`
    query RecruiterAgencyProfileEditAgencyQuery($slug: String!, $type: String! $self: Boolean!, $other: Boolean!) {
        ...MainInfoContainerAgency_profileData @arguments(slug: $slug, type: $type, self: $self, other: $other)
        ...AdditionalInfoContainerAgency_profileData @arguments(slug: $slug, type: $type, self: $self, other: $other)
    }
`;

const EDIT_RECRUITER_PROFILE = graphql`
    mutation RecruiterAgencyProfileEditRecruiterMutation($input: UpdateRecruiterProfileInput!) {
        mutator {
            updateRecruiterProfile(input: $input) {
                viewer {
                    profileComplete
                    companyComplete
                    agencyComplete
                    verified
                    approved
                    user {
                        ... on Recruiter {
                            profilePhoto {
                                url
                            }
                            backgroundImage {
                                url
                            }
                        }
                    }
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;
const EDIT_AGENCY_PROFILE = graphql`
    mutation RecruiterAgencyProfileEditAgencyMutation($input: UpdateAgencyInput!) {
        mutator {
            updateAgency(input: $input) {
                viewer {
                    user {
                        ... on Recruiter {
                            agency {
                                about: aboutUs
                                photo {
                                    url
                                }
                            }
                        }
                    }
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class RecruiterAgencyProfileEdit extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        form: {},
    };

    /**
     * Commit edit profile mutation
     *
     * @param {Object} input - input from form
     */
    commitEditProfile = (input) => {
        const { profilePhoto, backgroundImage, photo, ...restInput } = input;
        const uploadables = {};
        if (profilePhoto instanceof File) {
            uploadables.profilePhoto = profilePhoto; // avatar for recruiter
        }
        if (photo instanceof File) {
            uploadables.photo = photo; // avatar for agency
        }
        if (backgroundImage instanceof File) {
            uploadables.backgroundImage = backgroundImage;
        }

        return commitMutation(
            environment,
            {
                mutation: this.props.match.path === ROUTES.AGENCY_PROFILE_EDIT ? EDIT_AGENCY_PROFILE : EDIT_RECRUITER_PROFILE,
                variables: {
                    input: {
                        ...restInput,
                        roleTypes: restInput.roleTypes && restInput.roleTypes.map(roleType => roleType.id),
                        specialisations: restInput.specialisations && restInput.specialisations.map(specialisation => specialisation.id),
                    },
                },
                uploadables,
                errorPath: 'mutator.updateRecruiterProfile.errors',
            },
        );
    };

    /**
     * Handle recruiter/agency profile edition and corresponding app logic
     *
     * @param input - represents GQL UpdateRecruiterProfileInput
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitEditProfile(input)
            .then(() => {
                this.setState({ isLoading: false });

                if (this.props.match.path === ROUTES.AGENCY_PROFILE_EDIT) {
                    toast.success('Well done! You successfully edited your agency');
                } else {
                    toast.success(
                        'Well done! You successfully edited your profile',
                        { className: isDevelopment && TEST_IDS.EDIT_RECRUITER_PROFILE_SUCCESS }
                    );
                }
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    errors: errorParsed.message,
                });
            });
    };
    handleGoToPreview = () => {
        const isAgency = this.props.match.path === ROUTES.AGENCY_PROFILE_EDIT;
        const routeToGo = isAgency ? ROUTES.AGENCY_PROFILE_PREVIEW : ROUTES.RECRUITER_PROFILE_PREVIEW;

        if (
            this.state.form.photo instanceof File ||
            this.state.form.profilePhoto instanceof File ||
            this.state.form.backgroundImage instanceof File
        ) {
            let previewParams = { ...this.state.form };
            const promiseAvatar = this.state.form.profilePhoto instanceof File ? getBase64(this.state.form.profilePhoto) :
                this.state.form.photo instanceof File ? getBase64(this.state.form.photo) : null;
            const promiseBackground = this.state.form.backgroundImage instanceof File && getBase64(this.state.form.backgroundImage);
            Promise.all([ promiseAvatar, promiseBackground ])
                .then(([ base64Avatar, base64Background ]) => {
                    previewParams[ base64Avatar && 'avatarUrl' ] = base64Avatar;
                    previewParams[ base64Background && 'backgroundUrl' ] = base64Background;

                    localStorageInstance.setItem(
                        LOCAL_STORAGE_KEYS.RECRUITER_PROFILE_PREVIEW,
                        JSON.stringify(previewParams),
                        10,
                    );
                });
        } else {
            let previewParams = this.state.form;
            localStorageInstance.setItem(
                LOCAL_STORAGE_KEYS.RECRUITER_PROFILE_PREVIEW,
                JSON.stringify(previewParams),
                10,
            );
        }

        window.open(
            routeToGo,
            `page-name-${ routeToGo }`,
        );
    };

    handleSaveForm = (form) => {
        this.setState({ form });
    };

    render() {
        const { handleSaveForm, handleSubmit, handleGoToPreview } = this;
        const { isLoading, errors } = this.state;
        const { match: { params } } = this.props;
        const slug = params[ PARAM_SLUG ];
        const isAgency = this.props.match.path === ROUTES.AGENCY_PROFILE_EDIT;

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
                            <RecruiterAgencyProfileEditComponent
                                hash={ this.props.location.hash?.slice(1) }
                                profileData={ data }
                                isAgency={ isAgency }
                                handleSubmit={ handleSubmit }
                                handleSaveForm={ handleSaveForm }
                                handleGoToPreview={ handleGoToPreview }
                                isLoading={ isLoading }
                                errors={ errors }
                            />
                        );
                    }
                }
            />
        );
    }
}

RecruiterAgencyProfileEdit.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default RecruiterAgencyProfileEdit;
