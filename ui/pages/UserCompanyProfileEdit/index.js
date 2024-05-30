import React, { PureComponent }        from 'react';
import PropTypes                       from 'prop-types';
import { toast }                       from 'react-toastify';
import getErrorMessage                 from '../../../util/getErrorMessage';
import LoaderComponent                 from '../../components/LoaderComponent';
import ErrorComponent                  from '../../components/ErrorComponent';
import UserCompanyProfileEditComponent from './UserCompanyProfileEditComponent';
import TEST_IDS                        from '../../../tests/testIds';
import { isDevelopment, ROUTES }       from '../../../constants';
import {
    graphql,
    QueryRenderer,
}                                      from 'react-relay';
import {
    commitMutation,
    environment,
}                                      from '../../../api';

const USER_PROFILE_EDIT_QUERY = graphql`
    query UserCompanyProfileEditUserQuery {
        viewer {
            profileComplete
            user {
                ... on User {
                    id
                    firstName
                    lastName
                    email
                    jobTitle
                    contactNumber
                    timezone
                    profilePhoto {
                        url
                    }
                }
            }
        }
    }
`;

const COMPANY_PROFILE_EDIT_QUERY = graphql`
    query UserCompanyProfileEditCompanyQuery {
        viewer {
            companyComplete
            industries {
                label: name
                key: id
            }
            user {
                ... on User {
                    company {
                        name
                        abn
                        website
                        address
                        city
                        state
                        contactNumber
                        employees
                        overview
                        industry {
                            name
                            id
                        }
                        photo {
                            url
                        }
                    }
                }
            }
        }
    }
`;

const mutationEditUser = graphql`
    mutation UserCompanyProfileEditUserMutation($input: UpdateUserProfileInput!) {
        mutator {
            updateUserProfile(input: $input) {
                viewer {
                    profileComplete
                    user {
                        ... on User {
                            id
                            firstName
                            lastName
                            email
                            jobTitle
                            contactNumber
                            timezone
                            profilePhoto {
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

const mutationEditCompany = graphql`
    mutation UserCompanyProfileEditCompanyMutation($input: UpdateCompanyInput!) {
        mutator {
            updateCompany(input: $input) {
                viewer {
                    companyComplete
                    verified
                    approved
                    agencyComplete
                }
                errors {
                    key
                    value
                }
            }
        }
    }
`;

class UserCompanyProfileEditView extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
    };

    /**
     * Commit updateUserProfile mutation
     *
     * @param {File} profilePhoto - File
     * @param {string} email - remove from input to send to GQL
     * @param {string} password - remove from input to send to GQL
     * @param {string} passwordConfirm - remove from input to send to GQL
     * @param {Object} input - represents GQL UpdateUserProfileInput type
     */
    commitEditUserProfile = ({ profilePhoto, email, password, passwordConfirm, ...input }) => {
        const variables = {
            input: {
                ...input,
                password: {
                    first: password,
                    second: passwordConfirm,
                }
            },
        };
        const uploadables = {};
        if (profilePhoto instanceof File) {
            uploadables.profilePhoto = profilePhoto;
        }

        return commitMutation(
            environment,
            {
                mutation: mutationEditUser,
                variables,
                errorPath: 'mutator.updateUser.errors',
                uploadables,
            },
        );
    };

    /**
     * Handle placement creation and corresponding app logic
     *
     * @param {Object} input - object
     */
    handleEditUser = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitEditUserProfile(input)
            .then(() => {
                this.setState({ isLoading: false });
                toast.success(
                    'Well done! You successfully edited your profile',
                    { className: isDevelopment && TEST_IDS.EDIT_EMPLOYER_SUCCESS }
                    );
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

    /**
     * Commit updateUserProfile mutation
     *
     * @param {File} photo - File
     * @param {Object} input - represents GQL UpdateUserProfileInput type
     */
    commitEditCompanyProfile = ({ photo, ...input }) => {
        const variables = {
            input,
        };
        const uploadables = {};
        if (photo instanceof File) {
            uploadables.photo = photo;
        }

        return commitMutation(
            environment,
            {
                mutation: mutationEditCompany,
                variables,
                errorPath: 'mutator.updateCompany.errors',
                uploadables,
            },
        );
    };

    /**
     * Handle placement creation and corresponding app logic
     *
     * @param {Object} input - object
     */
    handleEditCompany = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitEditCompanyProfile(input)
            .then(() => {
                this.setState({ isLoading: false });
                toast.success('Well done! You successfully edited your company');
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

    render() {
        const { handleEditUser, handleEditCompany } = this;
        const { isLoading, errors } = this.state;
        const isCompany = ROUTES.COMPANY_PROFILE_EDIT === this.props.match.path;

        return (
            <QueryRenderer
                environment={ environment }
                query={ isCompany ? COMPANY_PROFILE_EDIT_QUERY : USER_PROFILE_EDIT_QUERY }
                render={
                    ({ error, props: data }) => {
                        if (error) {
                            return <ErrorComponent error={ error } />;
                        }
                        if (!data && !error) {
                            return <LoaderComponent row />;
                        }

                        const profile = data && data.viewer && data.viewer.user && isCompany
                            ? data.viewer.user.company : data.viewer.user;

                        const complete = data && data.viewer && isCompany
                            ? data.viewer.companyComplete : data.viewer.profileComplete;


                        const industries = data && data.viewer && isCompany
                            ? data.viewer.industries : data.viewer.industries;

                        return (
                            <UserCompanyProfileEditComponent
                                isCompany={ isCompany }
                                handleSubmit={ isCompany ? handleEditCompany : handleEditUser }
                                isLoading={ isLoading }
                                errors={ errors }
                                profile={ profile }
                                complete={ complete }
                                industries={ industries }
                            />
                        );
                    }
                }
            />
        );
    }
}

UserCompanyProfileEditView.propTypes = {
    match: PropTypes.object.isRequired,
};

export default UserCompanyProfileEditView;

