import { inject, observer }                          from 'mobx-react';
import React, { Component }                          from 'react';
import PropTypes                                     from 'prop-types';
import { generatePath }                              from 'react-router-dom';
import CheckIcon                                     from '../../../assets/icons/CheckIcon';
import {
    INTEGRATIONS,
    PARAM_SLUG,
    ROUTES,
    PLACEMENTS_MODALS, PARAM_PLACEMENT_TYPE,
}                                                    from '../../../constants';
import getQueryString                                from '../../../util/getQueryString';
import getPermissions                                from '../../../util/getPermissions';
import HelpComponent                                 from '../HelpComponent';
import ProgressBarRadialComponent                    from '../ProgressBarRadialComponent';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../ButtonComponent';
import LoaderComponent                               from '../LoaderComponent';
import classNames                                    from 'classnames';
import styles                                        from './styles.scss';

class ProgressComponent extends Component {
    render() {
        const { isLoading, viewer, reviewsCount, history, isAgencyAdmin, store } = this.props;
        const hasActiveSubscription = getPermissions(store, [ 'individual_subscription' ]);
        const REVIEWS_COUNT_REQUIRED = 10;
        let progressItems = [];
        if (viewer) {

            const isFreelancer = !viewer.user.agency;

            progressItems = [
                {
                    checked: true,
                    label: 'Claimed profile',
                    link: null,
                },
                {
                    checked: !!viewer.user.placements && !!viewer.user.placements.length,
                    label: 'Send your first review request',
                    handleNavigateTo: () => {history.push(ROUTES.PLACEMENTS_NEW);}
                },
                {
                    checked: !!viewer.user.profilePhoto,
                    label: 'Add a profile photo',
                    handleNavigateTo: () => {
                        history.push(ROUTES.RECRUITER_PROFILE_EDIT + '#profilePhoto');
                    }
                },
                {
                    checked: !viewer.user.agency || !!viewer.user.agency.claimed,
                    label: 'Claim agency profile',
                    handleNavigateTo: () => {
                        window.open(generatePath(
                            ROUTES.AGENCY_PROFILE_CLAIM,
                            { [ PARAM_SLUG ]: viewer.user.agency.slug },
                        ), '_blank');
                    }
                },
                {
                    checked: viewer.profileComplete,
                    label: 'Complete your profile information',
                    handleNavigateTo: () => {
                        history.push(ROUTES.RECRUITER_PROFILE_EDIT + '#profilePhoto');
                    }
                },
                {
                    checked: reviewsCount >= REVIEWS_COUNT_REQUIRED,
                    label: `Receive ${ REVIEWS_COUNT_REQUIRED } reviews!`,
                    handleNavigateTo: () => {
                        history.push(ROUTES.PLACEMENTS_NEW);
                    }
                },
                ...(hasActiveSubscription ? [ {
                    checked: !!viewer.user.backgroundImage,
                    label: 'Boost your brand by adding a background photo',
                    handleNavigateTo: () => {
                        history.push(ROUTES.RECRUITER_PROFILE_EDIT + '#backgroundImage');
                    }
                } ] : []),
                {
                    checked: (
                        isFreelancer &&
                        viewer.user.integrations &&
                        viewer.user.integrations.includes(INTEGRATIONS.JOBADDER)
                    ) || (
                        !isFreelancer &&
                        viewer.user.agency.integrations &&
                        viewer.user.agency.integrations.includes(INTEGRATIONS.JOBADDER)
                    ),
                    label: 'Connect to JobAdder',
                    helpText: (!isAgencyAdmin && !isFreelancer) ? 'Only an agency admin can connect to jobadder' : null,
                    handleNavigateTo: (isAgencyAdmin || isFreelancer) ? () => {
                        history.push(
                            generatePath(ROUTES.PLACEMENTS, { [ PARAM_PLACEMENT_TYPE._NAME ]: PARAM_PLACEMENT_TYPE.VISIBLE }) +
                            getQueryString({ [ PLACEMENTS_MODALS._NAME ]: PLACEMENTS_MODALS.JOBADDER }));
                    } : null
                },
            ];
        }

        const goals = [];
        let progress = 0;
        progressItems.forEach((item, index) => {
            progress = index === 0 ? ProgressComponent.PROGRESS_DEFAULT :
                progress + (item.checked ? ProgressComponent.PROGRESS_STEP : 0);
            goals.push(
                (item.checked || !item.helpText) ?
                    <ButtonComponent
                        key={ index }
                        className={ classNames(styles.goal, { [ styles.goalChecked ]: item.checked }) }
                        onClick={ item.checked ? () => {} : item.handleNavigateTo }
                        size={ BUTTON_SIZE.SMALL }
                        btnType={ BUTTON_TYPE.LINK }
                        disabled={ item.checked }
                    >
                        { item.checked && <span className={ styles.iconBox }><CheckIcon /></span> }{ item.label }
                    </ButtonComponent> :
                    <HelpComponent
                        key={ index }
                        className={ styles.help }
                        text={ item.helpText }
                    >
                        <ButtonComponent
                            className={ classNames(styles.goal) }
                            size={ BUTTON_SIZE.SMALL }
                            btnType={ BUTTON_TYPE.LINK }
                            disabled={ item.checked }
                        >
                            { item.label }
                        </ButtonComponent>
                    </HelpComponent>
            );
        });
        return (
            <div className={ styles.box }>
                <div className={ styles.mainInfo }>
                    <h2>
                        Complete your profile
                    </h2>
                    <div className={ styles.goalsBox }>
                        { goals }
                    </div>
                </div>
                <div className={ styles.progressBox }>
                    { !isLoading ? <ProgressBarRadialComponent
                        progress={ progress }
                        big
                    /> : <LoaderComponent row /> }
                </div>
            </div>
        );
    }
}

ProgressComponent.PROGRESS_DEFAULT = 30;
ProgressComponent.PROGRESS_STEP = 10;

ProgressComponent.propTypes = {
    isLoading: PropTypes.bool,
    isAgencyAdmin: PropTypes.bool,
    viewer: PropTypes.object,
    reviewsCount: PropTypes.number,
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};

export default inject('store')(
    observer(ProgressComponent),
);
