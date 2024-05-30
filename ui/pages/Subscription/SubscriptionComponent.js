import PropTypes                from 'prop-types';
import React, { Fragment }      from 'react';
import { FormattedDate }        from 'react-intl';
import CheckIcon                from '../../../assets/icons/CheckIcon';
import getDateObjectFromString  from '../../../util/getDateObjectFromString';
import individualSrc            from './individual.svg';
import teamSrc                  from './team.svg';
import HeaderRowComponent       from '../../components/HeaderRowComponent';
import HeaderRowButtonComponent from '../../components/HeaderRowButtonComponent';
import { ROUTES }               from '../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE
}                               from '../../components/ButtonComponent';
import styles                   from './styles.scss';

const SubscriptionComponent = (props) => {
    const {
        individual,
        individualAnnual,
        team,
        teamAnnual,
        isTeamSubscription,
        isIndividualSubscription,
        subscription,
        // TODO delete after 01.01.2020
        // handleCancelSubscription,
        // isLoading,
        // isAgencyAdmin,
        isFreelancer,
    } = props;
    const expires = subscription && (subscription.scheduledCancellation || subscription.trialEnd);
    // const cancelSubscription = (subscription && !subscription.scheduledCancellation) && (
    //     (subscription.plan === 'team---annual' || subscription.plan === 'team2') ? isAgencyAdmin : true
    // );

    return (
        <Fragment>
            <HeaderRowComponent
                tabs={
                    <HeaderRowButtonComponent
                        url={ ROUTES.SUBSCRIPTION }
                        label="Subscription"
                        isActive
                    />
                }
            />
            <div className={ styles.infoBox }>
                <div className={ styles.titleInfo }>Current subscription</div>
                <h2 className={ styles.infoBlock }>
                    { isTeamSubscription ? 'Sourcr Pro - Team' : isIndividualSubscription ? 'Sourcr Pro' : 'Free' }
                    <div>
                        { subscription ? subscription.plan.includes('annual') ? 'Annual' : 'Monthly' : '' }
                    </div>
                </h2>
                <div className={ styles.infoBlock }>
                    Next billing date: <b>{ expires ?
                    (<Fragment>
                        <FormattedDate
                            value={ getDateObjectFromString(expires) }
                            day="2-digit"
                        />{ ' ' }
                        <FormattedDate
                            value={ getDateObjectFromString(expires) }
                            month="long"
                        />{ ' ' }
                        <FormattedDate
                            value={ getDateObjectFromString(expires) }
                            year="numeric"
                        />{ ' ' }
                    </Fragment>) : 'Never '
                }</b>
                    {
                        // https://trello.com/c/4I1YiRQr/1091-subscriptions-page-remove-cancel-subscription-link
                        // TODO delete after 01.01.2020
                        // cancelSubscription && <ButtonComponent
                        //     className={ styles.cancel }
                        //     btnType={ BUTTON_TYPE.LINK_ACCENT }
                        //     onClick={ handleCancelSubscription }
                        //     size={ BUTTON_SIZE.SMALL }
                        //     disabled={ isLoading }
                        // >
                        //     Cancel subscription
                        // </ButtonComponent>
                    }
                </div>
            </div>
            <div className={ styles.box }>
                <div className={ styles.subscriptionBox }>
                    <img
                        className={ styles.subscriptionIcon }
                        src={ individualSrc }
                        alt="individual subscription icon"
                    />
                    <h2 className={ styles.title }>
                        Indiv – Sourcr Pro
                        <div className={ styles.titlePrice }>
                            $49 per mo.
                        </div>
                    </h2>
                    <span className={ styles.additional }>
                        Additional features:
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Enhanced profile branding
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />NPS collection and insights
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Customisable review invitations
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Customisable social sharing
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Advanced widget library
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Customisable capability statement
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Insights & reporting
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Google connected
                    </span>

                    <div className={ styles.buttonBox }>
                        <ButtonComponent
                            className={ styles.button }
                            btnType={ BUTTON_TYPE.ACCENT }
                            to={ individual }
                            main
                            size={ BUTTON_SIZE.BIG }
                        >
                            Monthly Plan
                        </ButtonComponent>
                        <ButtonComponent
                            className={ styles.button }
                            btnType={ BUTTON_TYPE.ACCENT }
                            to={ individualAnnual }
                            size={ BUTTON_SIZE.BIG }
                        >
                            Annual Plan
                        </ButtonComponent>
                        <span className={ styles.additional }>
                            20% discount
                        </span>
                    </div>
                </div>
                { !isFreelancer && <div className={ styles.subscriptionBox }>
                    <img
                        className={ styles.subscriptionIcon }
                        src={ teamSrc }
                        alt="individual subscription icon"
                    />
                    <h2 className={ styles.title }>
                        Sourcr Team – Pro
                        <div className={ styles.titlePrice }>
                            $100 + $39/user per mo.
                        </div>
                    </h2>
                    <span className={ styles.additional }>
                        Additional features:
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Enhanced profile branding
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />NPS collection and insights
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Customisable review invitations
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Customisable social sharing
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Advanced widget library
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Customisable capability statement
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Advanced team management & reporting
                    </span>
                    <span className={ styles.feature }>
                        <CheckIcon />Google connected
                    </span>
                    <div className={ styles.buttonBox }>
                        <ButtonComponent
                            className={ styles.button }
                            btnType={ BUTTON_TYPE.ACCENT }
                            to={ team }
                            main
                            size={ BUTTON_SIZE.BIG }
                        >
                            Monthly Plan
                        </ButtonComponent>
                        <ButtonComponent
                            className={ styles.button }
                            btnType={ BUTTON_TYPE.ACCENT }
                            to={ teamAnnual }
                            size={ BUTTON_SIZE.BIG }
                        >
                            Annual Plan
                        </ButtonComponent>
                        <span className={ styles.additional }>
                            20% discount
                        </span>
                    </div>
                </div> }
            </div>

        </Fragment>
    );
};

SubscriptionComponent.propTypes = {
    history: PropTypes.object.isRequired,
    individual: PropTypes.string.isRequired,
    individualAnnual: PropTypes.string.isRequired,
    team: PropTypes.string.isRequired,
    teamAnnual: PropTypes.string.isRequired,
    isTeamSubscription: PropTypes.bool,
    isIndividualSubscription: PropTypes.bool,
    subscription: PropTypes.object,
    handleCancelSubscription: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    isAgencyAdmin: PropTypes.bool,
    isFreelancer: PropTypes.bool,
};

export default SubscriptionComponent;
