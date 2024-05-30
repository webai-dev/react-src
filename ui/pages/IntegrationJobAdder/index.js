import React, { Component }             from 'react';
import PropTypes                        from 'prop-types';
import { graphql }                      from 'react-relay';
import {
    withRouter,
    generatePath,
}                                       from 'react-router-dom';
import {
    commitMutation,
    environment,
}                                       from '../../../api';
import LoaderComponent                  from '../../components/LoaderComponent';
import getQueryParams                   from '../../../util/getQueryParams';
import { PARAM_PLACEMENT_TYPE, ROUTES } from '../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                       from '../../components/ButtonComponent';
import styles                           from './styles.scss';

const mutation = graphql`
    mutation IntegrationJobAdderStoreTokenMutation($type: String, $code: String)  {
        mutator {
            connectAccount(type: $type, code: $code) {
                success
                message
            }
        }
    }`;

const CONNECTION_TYPE = {
    JOBADDER: 'jobadder',
    GOOGLE: 'google',
};

class IntegrationJobAdderView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            success: undefined,
            type: props.match.path === ROUTES.JOBADDER ? CONNECTION_TYPE.JOBADDER : CONNECTION_TYPE.GOOGLE
        };
    }

    componentWillMount() {
        const { location } = this.props;
        const parsed = getQueryParams(location.search);

        commitMutation(
            environment,
            {
                mutation: mutation,
                variables: {
                    type: this.state.type,
                    code: parsed.code,
                },
            },
        )
            .then((data) => {
                const { message, success } = data.mutator.connectAccount;
                if (!success) {
                    throw new Error(message);
                }
                this.setState({
                    isLoading: false,
                    success: true,
                });
            })
            .catch(() => {
                this.setState({
                    isLoading: false,
                    success: false,
                });
            });
    }

    render() {
        const { isLoading, success, type } = this.state;
        const messageLoading = {
            [ CONNECTION_TYPE.JOBADDER ]: 'Please wait while we connect your JobAdder account',
            [ CONNECTION_TYPE.GOOGLE ]: 'Please wait while we connect your Google account',
        };
        const messageSuccess = {
            [ CONNECTION_TYPE.JOBADDER ]: 'Your JobAdder integration was configured successfully, placements will be imported' +
            ' in the next 24 hours',
            [ CONNECTION_TYPE.GOOGLE ]: 'Your Google integration was configured successfully',
        };
        const messageFail = {
            [ CONNECTION_TYPE.JOBADDER ]: 'Your JobAdder integration failed to connect',
            [ CONNECTION_TYPE.GOOGLE ]: 'Your Google integration failed to connect',
        };

        const message = isLoading ? messageLoading[ type ] : success ? messageSuccess[ type ] : messageFail[ type ];

        const backButton = (
            <ButtonComponent
                className={ styles.button }
                to={ type === CONNECTION_TYPE.JOBADDER ?
                    generatePath(ROUTES.PLACEMENTS, { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }) :
                    ROUTES.DASHBOARD_REVIEWS
                }
                btnType={ BUTTON_TYPE.WHITE }
                size={ BUTTON_SIZE.BIG }
            >
                { type === CONNECTION_TYPE.JOBADDER ? 'Back to placements' : 'Back to dashboard' }
            </ButtonComponent>
        );

        return <div>
            <div className={ styles.box }>
                <h3>{ message }{ ' ' }</h3>
                { isLoading && <LoaderComponent small /> }
            </div>
            { !isLoading && success && <div className={ styles.buttonBox }>{ backButton }</div> }

            { !isLoading && !success && <div className={ styles.buttonBox }>
                <ButtonComponent
                    className={ styles.button }
                    to={ type === CONNECTION_TYPE.JOBADDER ? ROUTES.JOBADDER_LOGIN : ROUTES.GOOGLE }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.BIG }
                    forceHref
                >
                    Retry
                </ButtonComponent>
                { backButton }
            </div> }
        </div>;
    }
}

IntegrationJobAdderView.propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(IntegrationJobAdderView);
