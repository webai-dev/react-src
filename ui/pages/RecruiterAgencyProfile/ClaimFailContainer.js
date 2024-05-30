import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import getErrorMessage          from '../../../util/getErrorMessage';
import ClaimFailComponent       from './ClaimFailComponent';
import { toast }                from 'react-toastify';
import {
    graphql, QueryRenderer,
}                               from 'react-relay';
import {
    commitMutation,
    environment,
}                               from '../../../api';

const QUERY = graphql`
    query ClaimFailContainerQuery($slug: String!) {
        recruiter: sluggable(slug: $slug, type: "recruiter") {
            ... on Recruiter {
                id
            }
        }
    }
`;

const mutationContactSupport = graphql`
    mutation ClaimFailContainerMutation($input: ClaimSupportInput!) {
        claimSupport(input: $input) {
            success
            errors {
                key
                value
            }
        }
    }
`;


class EmailContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
        showModal: false,
    };
    /**
     * Commit contact support mutation
     *
     * @param {Object} input
     */
    commitContactSupport = (input) => {
        const variables = {
            input
        };

        return commitMutation(
            environment,
            {
                mutation: mutationContactSupport,
                variables,
            },
        );
    };

    /**
     * Handle placement creation  and loading and error state
     *
     * @param {Object} input
     */
    handleContactSupport = (input) => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitContactSupport(input)
            .then(() => {
                this.setState({ isLoading: false });
                toast.success('Thanks. One of the team will be in touch shortly');
                this.props.handleCloseModal();
            })
            .catch(error => {
                const errorParsed = getErrorMessage(error);
                toast.error(errorParsed.title);
                this.setState({
                    isLoading: false,
                    errors: errorParsed.message,
                });
            });
    };

    render() {
        const { handleCloseModal, slug } = this.props;
        const { handleContactSupport } = this;
        const { isLoading, errors } = this.state;
        return (
            <QueryRenderer
                environment={ environment }
                query={ QUERY }
                variables={ { slug } }
                render={ ({ error, props: data }) => {

                    return (
                        <ClaimFailComponent
                            handleCloseModal={ handleCloseModal }
                            handleContactSupport={ handleContactSupport }
                            isLoading={ isLoading }
                            errors={ errors }
                            error={ error }
                            isDataLoading={ !error && !data }
                            id={ data && data.recruiter.id }
                        />
                    );
                } }
            />
        );
    }
}

EmailContainer.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    slug: PropTypes.string.isRequired,
};

export default EmailContainer;
