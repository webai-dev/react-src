import React, {
    PureComponent,
    Fragment,
}                              from 'react';
import PropTypes               from 'prop-types';
import { generatePath }        from 'react-router-dom';
import RowItemComponent        from '../../../components/RowItemComponent';
import {
    ROUTES,
    PARAM_SLUG,
}                              from '../../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                              from '../../../components/ButtonComponent';
import RecruiterModalComponent from '../../../components/RecruiterModalComponent';
import RequiresPermission      from '../../../components/User/RequiresPermission';
import PayModalComponent       from '../PayModalComponent';
import RequestModalComponent   from '../RequestModalComponent';
import styles                  from './styles.scss';

class MemberComponent extends PureComponent {
    state = {
        showModal: false,
        showPayModal: false,
        showRequestModal: false,
    };

    /**
     * Will open modal to send email
     */
    handleOpenRequestModal = () => {
        this.setState({ showRequestModal: true });
    };
    /**
     * Will close modal to send email
     */
    handleCloseRequestModal = () => {
        this.setState({ showRequestModal: false });
    };

    /**
     * Will open modal to display recruiter
     */
    handleOpenModal = () => {
        this.setState({ showModal: true });
    };
    /**
     * Will close modal to display recruiter
     */
    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    /**
     * Will open modal to display info modal about extra pay
     */
    handleOpenPayModal = () => {
        this.setState({ showPayModal: true });
    };
    /**
     * Will close modal to display info modal about extra pay
     */
    handleClosePayModal = () => {
        this.setState({ showPayModal: false });
    };

    render() {
        const {
            member,
            isCompany,
            myId,
            handleSendVerification,
            handleToggle,
            handleRemove,
            isLoadingVerification,
            isLoadingToggle,
            handleToggleAdmin,
            isLoadingToggleAdmin,
            isLoadingRemove,
            subscriptionEstimate,
        } = this.props;
        const { showModal, showPayModal, showRequestModal } = this.state;
        const {
            handleCloseModal,
            handleOpenModal,
            handleOpenPayModal,
            handleClosePayModal,
            handleOpenRequestModal,
            handleCloseRequestModal,
        } = this;
        const isMe = myId === member.id;
        const roles = member.roles || [];
        const isAdmin = roles.includes('ROLE_RECRUITER_ADMIN') || roles.includes('ROLE_USER_ADMIN');
        const enableUser = () => {handleToggle(member.id);};

        const header = isCompany ? (
            <span>
                { member.firstName } { member.lastName }{ isAdmin && ' - Admin' }{ isMe && ' (Me)' }
            </span>
        ) : (
            <ButtonComponent
                onClick={ handleOpenModal }
                btnType={ BUTTON_TYPE.LINK_ACCENT }
                size={ BUTTON_SIZE.SMALL }
            >
                { member.firstName } { member.lastName }{ isMe && ' (Me)' }
            </ButtonComponent>
        );

        const statusText = !isCompany && member.specialisations && (
            <div>
                { member.specialisations.map(it => it.name)
                    .join(', ') }
                <div className={ styles.label }>Specialisations</div>
            </div>
        );
        const actions = <Fragment>
            { !(member.verified || isMe) && !member.email &&
            <ButtonComponent
                main
                className={ styles.buttons }
                btnType={ BUTTON_TYPE.ACCENT }
                size={ BUTTON_SIZE.SMALL }
                onClick={ handleOpenRequestModal }
                disabled={ isLoadingVerification }
            >
                Send request
            </ButtonComponent> }
            { !(member.verified || isMe) && member.email &&
            <ButtonComponent
                main
                className={ styles.buttons }
                btnType={ BUTTON_TYPE.ACCENT }
                size={ BUTTON_SIZE.SMALL }
                onClick={ () => {handleSendVerification(member.id);} }
                disabled={ isLoadingVerification }
            >
                Resend verification
            </ButtonComponent> }
            <RequiresPermission roles={ [ 'user' ] }>
                { !isMe &&
                <ButtonComponent
                    main
                    className={ styles.buttons }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.SMALL }
                    onClick={ () => {handleToggle(member.id);} }
                    disabled={ isLoadingToggle }
                >
                    { member.approved ? 'Disable' : 'Enable' }
                </ButtonComponent> }
            </RequiresPermission>
            <RequiresPermission roles={ [ 'recruiter', 'team_subscription' ] }>
                { !member.approved && <Fragment>{ !subscriptionEstimate ?
                    <ButtonComponent
                        main
                        className={ styles.buttons }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                        onClick={ enableUser }
                        disabled={ isLoadingToggle }
                    >
                        Enable
                    </ButtonComponent> :
                    <ButtonComponent
                        main
                        className={ styles.buttons }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                        onClick={ handleOpenPayModal }
                        disabled={ isLoadingToggle }
                    >
                        Enable
                    </ButtonComponent> }
                </Fragment> }
            </RequiresPermission>

            <RequiresPermission roles={ [ { include: [ 'recruiter' ], exclude: [ 'team_subscription' ] } ] }>
                { !member.approved &&
                <ButtonComponent
                    main
                    className={ styles.buttons }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.SMALL }
                    onClick={ enableUser }
                    disabled={ isLoadingToggle }
                >
                    Enable
                </ButtonComponent>
                }
            </RequiresPermission>

            <RequiresPermission roles={ [ 'recruiter' ] }>
                { !isMe && <ButtonComponent
                    main
                    className={ styles.buttons }
                    btnType={ BUTTON_TYPE.ACCENT }
                    size={ BUTTON_SIZE.SMALL }
                    onClick={ () => {handleRemove(member.id);} }
                    disabled={ isLoadingRemove }
                >
                    Remove
                </ButtonComponent> }
            </RequiresPermission>

            { !isMe &&
            <ButtonComponent
                main
                className={ styles.buttons }
                btnType={ BUTTON_TYPE.ACCENT }
                size={ BUTTON_SIZE.SMALL }
                onClick={ () => {handleToggleAdmin(member.id);} }
                disabled={ isLoadingToggleAdmin }
            >
                { isAdmin ? 'Remove admin' : 'Set as admin' }
            </ButtonComponent> }
            { (member.verified || isMe) &&
            <ButtonComponent
                main
                className={ styles.buttons }
                btnType={ BUTTON_TYPE.ACCENT }
                size={ BUTTON_SIZE.SMALL }
                disabled
            >
                Verified
            </ButtonComponent> }
        </Fragment>;
        const infoText = isCompany ?
            `${ member.jobTitle || '' }${ member.company ? ' @ ' : '' }${ member.company && member.company.name }` :
            (
                <span>
                { member.jobTitle }{ ' ' }@{ ' ' }
                    <ButtonComponent
                        className={ styles.button }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                        to={ generatePath(
                            ROUTES.AGENCY_PROFILE,
                            { [ PARAM_SLUG ]: member.agency.slug },
                        ) }
                    >
                    { member.agency.name }
                </ButtonComponent>
            </span>
            );

        return (
            <Fragment>
                { showModal &&
                <RecruiterModalComponent
                    recruiterId={ member.id }
                    toggle={ handleCloseModal }
                />
                }
                { showPayModal && <PayModalComponent
                    handleCloseModal={ handleClosePayModal }
                    enableUser={ enableUser }
                /> }
                { showRequestModal && <RequestModalComponent
                    handleCloseModal={ handleCloseRequestModal }
                    handleSendVerification={ handleSendVerification }
                    member={ member }
                /> }
                <RowItemComponent
                    id={ member.id }
                    alt={ `${ member.firstName } ${ member.lastName } avatar` }
                    avatarUrl={ member.profilePhoto && member.profilePhoto.url }
                    header={ header }
                    infoText={ infoText }
                    statusText={ statusText }
                    actions={ actions }
                    classNameStart={ styles.start }
                    classNameMiddle={ styles.middle }
                />
            </Fragment>
        );
    }
}

MemberComponent.propTypes = {
    member: PropTypes.object.isRequired,
    isCompany: PropTypes.bool,
    currentTab: PropTypes.string.isRequired,
    myId: PropTypes.string.isRequired,
    handleSendVerification: PropTypes.func.isRequired,
    handleToggle: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    handleToggleAdmin: PropTypes.func.isRequired,
    isLoadingVerification: PropTypes.bool,
    isLoadingToggle: PropTypes.bool,
    isLoadingToggleAdmin: PropTypes.bool,
    isLoadingRemove: PropTypes.bool,
    subscriptionEstimate: PropTypes.number,
};

export default MemberComponent;
