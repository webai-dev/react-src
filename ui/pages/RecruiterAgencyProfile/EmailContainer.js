import React, { PureComponent }              from 'react';
import { withRouter }                        from 'react-router-dom';
import PropTypes                             from 'prop-types';
import { PARAM_SLUG, PROFILE_MODAL, ROUTES } from '../../../constants';
import EmailComponent                        from './EmailComponent';
import { toast }                             from 'react-toastify';
import { generatePath }                      from 'react-router-dom';
import {
    graphql,
}                                            from 'react-relay';
import {
    commitMutation,
    environment,
}                                            from '../../../api';

const mutationUpdateReview = graphql`
    mutation EmailContainerMutation($input: ContactUserInput!) {
        contact(input: $input) {
            success
        }
    }
`;


class EmailContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null,
    };
    /**
     * Commit send sendReminder mutation
     *
     * @param {Object} input - object from formsy
     */
    commitSendReminder = input => {
        const variables = {
            input: {
                id: this.props.id,
                ...input
            }
        };

        return commitMutation(
            environment,
            {
                mutation: mutationUpdateReview,
                variables,
            },
        );
    };

    /**
     * Handle placement creation  and loading and error state
     *
     * @param {Object} input - object from formsy
     */
    handleSubmit = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitSendReminder(input)
            .then(() => {
                this.setState({ isLoading: false });
                this.props.history.push(generatePath(
                    this.props.isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
                    { [ PARAM_SLUG ]: this.props.slug }
                ));
                toast.success('Message was sent successfully');
            });
    };

    render() {
        const { name, isAgency, slug, match: { params } } = this.props;
        const { handleSubmit } = this;
        const showModal = params[ PROFILE_MODAL._NAME ] === PROFILE_MODAL.CONTACT;
        const routeToRecruiterProfile = generatePath(
            isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
            { [ PARAM_SLUG ]: slug }
        );
        const routeToRecruiterContactModal = generatePath(
            isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
            {
                [ PARAM_SLUG ]: slug,
                [ PROFILE_MODAL._NAME ]: PROFILE_MODAL.CONTACT,
            }
        );
        return (
            <EmailComponent
                showModal={ showModal }
                handleSendEmail={ handleSubmit }
                name={ name }
                routeToRecruiterContactModal={ routeToRecruiterContactModal }
                routeToRecruiterProfile={ routeToRecruiterProfile }
            />
        );
    }
}

EmailContainer.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    isAgency: PropTypes.bool,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(EmailContainer);
