import React, { PureComponent }             from 'react';
import PropTypes                            from 'prop-types';
import SelectNodesComponent, { NODE_TYPES } from './SelectNodesComponent';
import { graphql, QueryRenderer }           from 'react-relay';
import {
    environment,
}                                           from '../../../../api';

const REVIEWS_AGENCY_QUERY = graphql`
    query SelectNodesContainerReviewsAgencyQuery {
        viewer {
            user {
                ...on Recruiter {
                    id
                    agency {
                        recruiters {
                            id
                            firstName
                            lastName
                            claimed
                        }
                        rating {
                            ratings {
                                id
                                title
                                isEmployer: responsiveness
                                createdAt
                                firstName
                                lastName
                                recruiter {
                                    id
                                    slug
                                }
                                placement {
                                    jobTitle
                                    placementDate
                                    employerFirstName
                                    employerLastName
                                    candidateFirstName
                                    candidateLastName
                                    companyName(public: true)
                                }
                                overallRating
                            }
                        }
                    }
                }
            }
        }
    }
`;

const REVIEWS_RECRUITER_QUERY = graphql`
    query SelectNodesContainerReviewsRecruiterQuery {
        viewer {
            user {
                ...on Recruiter {
                    rating {
                        ratings {
                            id
                            title
                            isEmployer: responsiveness
                            createdAt
                            firstName
                            lastName
                            recruiter {
                                id
                                slug
                            }
                            placement {
                                jobTitle
                                placementDate
                                employerFirstName
                                employerLastName
                                candidateFirstName
                                candidateLastName
                                companyName(public: true)
                            }
                            overallRating
                        }
                    }
                }
            }
        }
    }
`;

const PLACEMENTS_QUERY = graphql`
    query SelectNodesContainerPlacementsQuery {
        viewer {
            user {
                ...on Recruiter {
                    placements {
                        id
                        jobTitle
                        companyName(public: false)
                        suburb
                        salaryRange
                        jobType
                        industry {
                            name
                        }
                        recruiter {
                            id
                        }
                    }
                }
            }
        }
    }
`;

class SelectNodesContainer extends PureComponent {
    state = {
        showModal: false,
        errors: null,
        isRandomReviewSelection: true,
        selectedRecruiterId: null
    };

    /**
     * Handle dropdown to change recruiter (in order to see reviews from different recruiters)
     *
     * @param {string} id - recruiter id from agency
     */
    handleSelectRecruiter = (id) => {
        this.setState({ selectedRecruiterId: id });
    };


    /**
     *
     * @param isRandomReviewSelection
     */
    handleSelectionType = (isRandomReviewSelection) => {
        this.setState({ isRandomReviewSelection });
        if (isRandomReviewSelection) {
            this.props.handleSelectNodes(null);
        }
    };

    /**
     * Will open modal to send email
     */
    handleOpenModal = () => {
        this.setState({ showModal: true });
    };
    /**
     * Will close modal to send email
     */
    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    render() {
        const { handleOpenModal, handleCloseModal, handleSelectionType, handleSelectRecruiter } = this;
        const { showModal, isRandomReviewSelection, selectedRecruiterId } = this.state;
        const {
            selectedNodes,
            handleSelectNodes,
            isRemoveSelect,
            type = NODE_TYPES.REVIEWS_AGENCY,
            className,
            required,
            name,
            latestCount,
        } = this.props;

        return (
            <QueryRenderer
                environment={ environment }
                query={ {
                    [ NODE_TYPES.REVIEWS_AGENCY ]: REVIEWS_AGENCY_QUERY,
                    [ NODE_TYPES.REVIEWS_RECRUITER ]: REVIEWS_RECRUITER_QUERY,
                    [ NODE_TYPES.PLACEMENTS ]: PLACEMENTS_QUERY,
                }[ type ] }
                variables={ {} }
                render={ ({ error, props: data }) => {
                    const isLoading = !error && !data;

                    const nodes = type === NODE_TYPES.REVIEWS_AGENCY ?
                        (data?.viewer.user.agency.rating && data.viewer.user.agency.rating.ratings) :
                        type === NODE_TYPES.REVIEWS_RECRUITER ? (data && data.viewer.user.rating && data.viewer.user.rating.ratings) :
                            (data && data.viewer.user.placements);

                    const recruiters = type === NODE_TYPES.REVIEWS_AGENCY ? data?.viewer.user.agency.recruiters : null;

                    return (
                        <SelectNodesComponent
                            latestCount={ latestCount }
                            name={ name }
                            required={ required }
                            className={ className }
                            type={ type }
                            isRemoveSelect={ isRemoveSelect }
                            isRandomReviewSelection={ isRandomReviewSelection }
                            handleSelectionType={ handleSelectionType }
                            showModal={ showModal }
                            handleOpenModal={ handleOpenModal }
                            handleCloseModal={ handleCloseModal }
                            isLoading={ isLoading }
                            selectedNodes={ selectedNodes || [] }
                            handleSelectNodes={ handleSelectNodes }
                            nodes={ !selectedRecruiterId ? nodes : nodes.filter(node => node.recruiter.id === selectedRecruiterId) }
                            isItemsToDisplay={ nodes && !!nodes.length }
                            agencyRecruiters={ recruiters }
                            recruiterId={ data?.viewer.user?.id }
                            selectedRecruiterId={ selectedRecruiterId }
                            handleSelectRecruiter={ handleSelectRecruiter }
                        />
                    );
                } }
            />
        );
    }
}

export { NODE_TYPES };

SelectNodesContainer.propTypes = {
    type: PropTypes.string,
    selectedNodes: PropTypes.array,
    isRemoveSelect: PropTypes.bool,
    latestCount: PropTypes.number,
    required: PropTypes.bool,
    className: PropTypes.string,
    name: PropTypes.string,
    handleSelectNodes: PropTypes.func.isRequired
};

export default SelectNodesContainer;
