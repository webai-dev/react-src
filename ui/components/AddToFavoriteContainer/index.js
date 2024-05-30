import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import AddToFavoriteComponent   from './AddToFavoriteComponent';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
} from '../../components/ButtonComponent';
import { toast } from 'react-toastify';
import {
    QueryRenderer,
    graphql,
} from 'react-relay';
import {
    LoginManager,
    commitMutation,
    environment,
} from '../../../api';
import { ROUTES } from '../../../constants';

const mutation = graphql`
    mutation AddToFavoriteContainerMutation($recruiterId: String!) {
        mutator {
            toggleFavourite(recruiterId: $recruiterId) {
                isFavourite
                id
                recruiter {
                    id
                    recruiterRelationship {
                        isFavourite
                        id
                    }
                }
            }
        }
    }
`;
// TODO change approved to mpoApproved
const USER_QUERY = graphql`
    query AddToFavoriteContainerQuery($id: ID!) {
        node(id: $id) {
            ... on Recruiter {
                canBeFavourite
                firstName
                lastName
                recruiterRelationship {
                    isFavourite
                }
            }
        }
    }
`;

class AddToFavoriteContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        showModal: false,
    };
    /**
     * Commit addToFavorite mutation
     */
    commitAddToFavorite = () => {
        const variables = {
            recruiterId: this.props.id,
        };

        return commitMutation(
            environment,
            {
                mutation,
                variables,
                errorPath: 'mutator.addToFavorite.errors',
            },
        );
    };

    /**
     * Handle addToFavorite and corresponding app logic
     *
     * @param {string} name - recruiter name
     * @param {bool} active - is favorite before click
     */
    handleAddToFavorite = (name, active) => {
        if (this.props.noAction) {
            return;
        }
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitAddToFavorite()
            .then(() => {
                this.setState({ isLoading: false });
                if (!active) {
                    toast.success(<span>
                        { name }&nbsp;has been added to your&nbsp;
                        <ButtonComponent
                            to={ ROUTES.RECRUITERS_FAVOURITE }
                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                            size={ BUTTON_SIZE.SMALL }
                        >favourites</ButtonComponent>
                    </span>);
                }
            });
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
    /**
     * Will initiate request to backend to add entity to shortlist
     *
     * @param {Object} input - email and password
     */
    handleSubmit = (input) => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        LoginManager
            .login(
                input.email,
                input.password,
            )
            .catch(err => {
                this.setState({
                    isLoading: false,
                    error: err,
                });
            })
            .then(() => {
                this.setState({ isLoading: false });
                this.handleCloseModal();
                toast.success('You have been successfully logged in');
            });
    };

    render() {
        const {
            text,
            id,
            big,
            small,
            className,
        } = this.props;
        const { handleOpenModal, handleCloseModal, handleSubmit, handleAddToFavorite } = this;
        const { showModal, isLoading } = this.state;
        return (
            <QueryRenderer
                environment={ environment }
                query={ USER_QUERY }
                variables={ { id } }
                render={
                    ({ error, props: data }) => {
                        if (!data || error) {
                            return null;
                        }
                        const canBeFavourite = data.node && data.node.canBeFavourite;
                        if (!canBeFavourite || !data.node) {
                            return null;
                        }
                        const {
                            recruiterRelationship,
                            firstName,
                            lastName,
                        } = data.node;

                        const active = recruiterRelationship && recruiterRelationship.isFavourite;
                        const name = `${firstName} ${lastName}`;
                        return (
                            <AddToFavoriteComponent
                                className={ className }
                                active={ active }
                                showModal={ showModal }
                                handleOpenModal={ handleOpenModal }
                                handleCloseModal={ handleCloseModal }
                                handleSubmit={ handleSubmit }
                                handleAddToFavorite={ () => {
                                    handleAddToFavorite(
                                        name,
                                        active,
                                    );
                                } }
                                text={ text }
                                isLoading={ isLoading }
                                big={ big }
                                small={ small }
                            />
                        );
                    }
                }
            />
        );
    }
}

AddToFavoriteContainer.propTypes = {
    text: PropTypes.string,
    id: PropTypes.string.isRequired,
    big: PropTypes.bool,
    small: PropTypes.bool,
    noAction: PropTypes.bool,
    className: PropTypes.string,
};

export default AddToFavoriteContainer;
