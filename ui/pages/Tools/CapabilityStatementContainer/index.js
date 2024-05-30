import React, { PureComponent }       from 'react';
import { toast }                      from 'react-toastify';
import { LOCAL_STORAGE_KEYS, ROUTES } from '../../../../constants';
import getErrorMessage                from '../../../../util/getErrorMessage';
import localStorageInstance           from '../../../../util/LocalStorage';
import CapabilityStatementComponent   from './CapabilityStatementComponent';
import {
    graphql,
    QueryRenderer,
}                                     from 'react-relay';
import {
    commitMutation,
    environment,
}                                     from '../../../../api';
import ErrorComponent                 from '../../../components/ErrorComponent';
import LoaderComponent                from '../../../components/LoaderComponent';

const STATEMENT_CREATE_QUERY = graphql`
    query CapabilityStatementContainerQuery {
        viewer {
            user {
                ...on Recruiter {
                    slug
                    firstName
                    lastName
                    jobTitle
                    email
                    contactNumber
                    linkedinUrl
                    backgroundImage {
                        url
                    }
                    photo: profilePhoto {
                        url
                    }
                    backgroundColor
                }
            }
            capabilityStatements {
                id
                name
                placements {
                    id
                }
                reviews {
                    id
                }
                textColor
                createdAt
                statement
            }
        }
    }
`;

const mutationSave = graphql`
    mutation CapabilityStatementContainerSaveMutation($input: CapabilityStmtInput!) {
        mutator {
            saveCapabilityStmt(input: $input) {
                viewer {
                    capabilityStatements {
                        id
                        name
                        placements {
                            id
                        }
                        reviews {
                            id
                        }
                        textColor
                        createdAt
                        statement
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

const mutationDelete = graphql`
    mutation CapabilityStatementContainerDeleteMutation($id: ID!) {
        mutator {
            removeCapabilityStmt(id: $id) {
                viewer {
                    capabilityStatements {
                        id
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

class CapabilityStatementContainer extends PureComponent {
    state = {
        isDeleteLoading: false,
        isSaveLoading: false,
        selectedReviews: null,
        selectedPlacements: null,
        saveErrors: null,
        deleteErrors: null,
        form: {},
    };

    /**
     * Add or remove reviewId from selected reviews.
     *
     * @param {string} reviewId
     */
    handleSelectReviews = (reviewId) => {
        const selectedReviewsNew = this.state.selectedReviews || [];
        if (!reviewId) {
            this.setState({
                selectedReviews: null,
            });
        } else if (selectedReviewsNew.includes(reviewId)) {
            this.setState({
                selectedReviews: selectedReviewsNew.filter(id => id !== reviewId),
            });
        } else {
            this.setState({
                selectedReviews: [ ...selectedReviewsNew, reviewId ],
            });
        }
    };
    /**
     * Add or remove placementId from selected placements.
     *
     * @param {string} placementId
     */
    handleSelectPlacements = (placementId) => {
        const selectedPlacementsNew = this.state.selectedPlacements || [];
        if (!placementId) {
            this.setState({
                selectedPlacements: null,
            });
        } else if (selectedPlacementsNew.includes(placementId)) {
            this.setState({
                selectedPlacements: selectedPlacementsNew.filter(id => id !== placementId),
            });
        } else {
            this.setState({
                selectedPlacements: [ ...selectedPlacementsNew, placementId ],
            });
        }
    };

    /**
     * Commit saveCapabilityStmt mutation
     *
     * @param {Object} input - represents GQL CapabilityStmtInput
     */
    commitStatementSave = input => {
        return commitMutation(
            environment,
            {
                mutation: mutationSave,
                variables: { input },
            },
        );
    };

    /**
     * Handle placement creation and corresponding app logic
     *
     * @param {Object} input - object
     */
    handleSave = input => {
        this.setState({
            isSaveLoading: true,
            saveErrors: null,
        });

        this.commitStatementSave(input)
            .then(() => {
                this.setState({ isSaveLoading: false });

                toast.success('Your statement has successfully been created');
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isSaveLoading: false,
                    saveErrors: errorParsed.message,
                });
            });
    };
    /**
     * Commit removeCapabilityStmt mutation
     *
     * @param {string} id - represents statement id
     */
    commitStatementDelete = id => {
        return commitMutation(
            environment,
            {
                mutation: mutationDelete,
                variables: { id },
            },
        );
    };

    /**
     * Handle placement creation and corresponding app logic
     *
     * @param {string} statementId - string
     */
    handleDelete = statementId => {
        this.setState({
            isDeleteLoading: true,
            deleteErrors: null,
        });

        this.commitStatementDelete(statementId)
            .then(() => {
                this.setState({ isDeleteLoading: false });

                toast.success('Your statement has successfully been deleted');
            })
            .catch((error) => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isDeleteLoading: false,
                    deleteErrors: errorParsed.message,
                });
            });
    };

    /**
     * Save form to local storage and open statement preview page in new tab
     */
    handleGoToPreview = () => {
        const routeToGo = ROUTES.STATEMENT_PREVIEW;

        let previewParams = { ...this.state.form, backgroundImage: null };
        localStorageInstance.setItem(
            LOCAL_STORAGE_KEYS.RECRUITER_PROFILE_PREVIEW,
            JSON.stringify(previewParams),
            30,
        );

        window.open(
            routeToGo,
            `page-name-${ routeToGo }`,
        );
    };

    /**
     * Save form so it can be used in this.handleGoToPreview
     *
     * @param {Object} form
     */
    handleSaveForm = (form) => {
        this.setState({ form });
    };

    render() {
        const {
            handleSave,
            handleDelete,
            handleSelectReviews,
            handleSelectPlacements,
            handleSaveForm,
            handleGoToPreview
        } = this;
        const {
            isSaveLoading,
            isDeleteLoading,
            selectedReviews,
            selectedPlacements,
            saveErrors,
        } = this.state;
        return (
            <QueryRenderer
                environment={ environment }
                query={ STATEMENT_CREATE_QUERY }
                render={ ({ error, props: data }) => {
                    const loading = !error && !data;

                    if (error) {
                        return <ErrorComponent error={ error } />;
                    }
                    if (loading) {
                        return <LoaderComponent row />;
                    }
                    const recruiter = data.viewer.user;
                    const capabilityStatements = data.viewer.capabilityStatements;

                    return (
                        <CapabilityStatementComponent
                            handleGoToPreview={ handleGoToPreview }
                            handleSave={ handleSave }
                            handleDelete={ handleDelete }
                            isDeleteLoading={ isDeleteLoading }
                            recruiter={ recruiter }
                            capabilityStatements={ capabilityStatements }
                            handleSelectReviews={ handleSelectReviews }
                            handleSelectPlacements={ handleSelectPlacements }
                            selectedReviews={ selectedReviews }
                            selectedPlacements={ selectedPlacements }
                            isSaveLoading={ isSaveLoading }
                            saveErrors={ saveErrors }
                            handleSaveForm={ handleSaveForm }
                        />
                    );
                } }
            />
        );
    }
}

export default CapabilityStatementContainer;
