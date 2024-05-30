import React, { PureComponent }                                   from 'react';
import PropTypes                                                  from 'prop-types';
import getErrorMessage                                            from '../../../util/getErrorMessage';
import ClaimComponent                                             from './ClaimComponent';
import { toast }                                                  from 'react-toastify';
import {
    withRouter,
    generatePath,
}                                                                 from 'react-router-dom';
import { ROUTES, PARAM_SLUG, PARAM_LINKEDIN_SLUG, PROFILE_MODAL } from '../../../constants';
import gtmPush, { GTM_ACTIONS, GTM_EVENTS }                       from '../../../util/gtmPush';
import {
    graphql,
}                                                                 from 'react-relay';
import {
    commitMutation,
    environment,
}                                                                 from '../../../api';

const mutation = graphql`
    mutation ClaimContainerMutation($input: AgencyClaimInput!) {
        agencyClaim(input: $input) {
            success
        }
    }
`;

class ClaimContainer extends PureComponent {
    state = {
        isLoading: false,
        errors: null
    };

    /**
     * Commit send claimAgency mutation
     *
     * @param {Object} input - object from formsy
     */
    commitClaimAgency = input => {
        const variables = {
            input
        };

        return commitMutation(
            environment,
            {
                mutation,
                variables,
                errorPath: 'mutator.claimAgency.errors',
            },
        );
    };

    /**
     * Handle agency claim precess and loading and error state
     *
     * @param {Object} input - object from formsy
     */
    handleSubmitAgency = input => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        gtmPush({
            event: GTM_EVENTS.CLAIM_PROFILE,
            label: this.props.id
        });
        const routeToRecruiterProfile = generatePath(
            this.props.isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
            { [ PARAM_SLUG ]: this.props.slug }
        );
        this.commitClaimAgency(input)
            .then(() => {
                this.setState({ isLoading: false });
                this.props.history.push(routeToRecruiterProfile);
                toast.success('One of the team will review your request and be in touch shortly');
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
     * Handle recruiter claim
     *
     * @param {Object} input - object from formsy
     */
    handleSubmitRecruiter = input => {
        window.open(generatePath(
            ROUTES.RECRUITER_PROFILE_CLAIM,
            {
                [ PARAM_SLUG ]: this.props.slug,
                [ PARAM_LINKEDIN_SLUG ]: input.linkedinUrl
                    .toLowerCase()
                    .replace(/^((https|http):\/\/)?(www.)?linkedin.com\/in\//, '')
                    .replace(/\/?$/, ''),
            },
        ));
        gtmPush({
            event: GTM_EVENTS.CLAIM_PROFILE,
            action: GTM_ACTIONS.CLAIM_RECRUITER,
            label: this.props.id,
        });
    };

    render() {
        const { isAgency, id, slug, match: { params } } = this.props;
        const { handleSubmitAgency, handleSubmitRecruiter } = this;
        const { errors, isLoading } = this.state;
        const showModal = params[ PROFILE_MODAL._NAME ] === PROFILE_MODAL.CLAIM;
        const routeToRecruiterProfile = generatePath(
            isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
            { [ PARAM_SLUG ]: slug }
        );
        const routeToRecruiterClaimModal = generatePath(
            isAgency ? ROUTES.AGENCY_PROFILE : ROUTES.RECRUITER_PROFILE,
            {
                [ PARAM_SLUG ]: slug,
                [ PROFILE_MODAL._NAME ]: PROFILE_MODAL.CLAIM,
            }
        );
        return (
            <ClaimComponent
                id={ id }
                isLoading={ isLoading }
                errors={ errors }
                isAgency={ isAgency }
                showModal={ showModal }
                handleSubmitAgency={ isAgency ? handleSubmitAgency : null }
                handleSubmitRecruiter={ isAgency ? null : handleSubmitRecruiter }
                routeToRecruiterProfile={ routeToRecruiterProfile }
                routeToRecruiterClaimModal={ routeToRecruiterClaimModal }
            />
        );
    }
}

ClaimContainer.propTypes = {
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    isAgency: PropTypes.bool,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(ClaimContainer);
