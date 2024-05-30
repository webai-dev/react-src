import { inject, observer }             from 'mobx-react';
import React, { Fragment, Component }   from 'react';
import PropTypes                        from 'prop-types';
import { withRouter }                   from 'react-router-dom';
import Cross2Icon                       from '../../../assets/icons/Cross2Icon';
import LockIcon                         from '../../../assets/icons/LockIcon';
import { ROUTES }                       from '../../../constants';
import getPermissions                   from '../../../util/getPermissions';
import ModalComponent                   from '../../components/ModalComponent';
import ButtonComponent, { BUTTON_TYPE } from '../ButtonComponent';
import RequiresPermission               from '../User/RequiresPermission';
import styles                           from './styles.scss';

// NOTE When use be sure children can accept onClick as prop otherwise onClick won't work
class RequiresBillingContainer extends Component {
    state = {
        isShowModal: false
    };
    /**
     * Show modal with "go to subscription" button
     */
    handleOpen = () => {
        this.setState({ isShowModal: true });
    };
    /**
     * Hide modal with "go to subscription" button
     */
    handleClose = () => {
        this.setState({ isShowModal: false });
    };
    /**
     * Redirect to subscription page and close modal
     */
    handleGoToSubscription = () => {
        this.props.history.push(ROUTES.SUBSCRIPTION);
        this.handleClose();
    };

    render() {
        const { handleOpen, handleClose, handleGoToSubscription } = this;
        const { isShowModal } = this.state;
        const { children, store, isForTeam, capture } = this.props;
        const hasActiveSubscription = isForTeam ?
            getPermissions(store, [ 'team_subscription' ]) :
            getPermissions(store, [ 'individual_subscription' ]);

        if (hasActiveSubscription) {
            return children;
        }

        const onClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpen();
        };

        return <Fragment>
            { isShowModal && <ModalComponent
                handleClose={ handleClose }
                classNameOuter={ styles.modal }
            >
                <ButtonComponent
                    ariaLabel="close modal"
                    btnType={ BUTTON_TYPE.LINK }
                    className={ styles.close }
                    onClick={ handleClose }
                >
                    <Cross2Icon />
                </ButtonComponent>
                <div className={ styles.box }>
                    <h2 className={ styles.title }>
                        <LockIcon /> <RequiresPermission
                        roles={ [
                            { include: [ 'recruiter' ], exclude: [ 'individual_subscription' ] },
                        ] }
                    >This is a Pro feature</RequiresPermission>
                        <RequiresPermission
                            roles={ [
                                { include: [ 'recruiter','individual_subscription' ] },
                            ] }
                        >This is a Sourcr Team feature</RequiresPermission>
                    </h2>
                    <div className={ styles.buttonBox }>
                        <ButtonComponent
                            onClick={ handleGoToSubscription }
                            btnType={ BUTTON_TYPE.ACCENT }
                        >
                            <RequiresPermission
                                roles={ [
                                    { include: [ 'recruiter' ], exclude: [ 'individual_subscription' ] },
                                ] }
                            >Get Pro</RequiresPermission>
                            <RequiresPermission
                                roles={ [
                                    { include: [ 'recruiter','individual_subscription' ] },
                                ] }
                            >Upgrade</RequiresPermission>
                        </ButtonComponent>
                    </div>
                </div>
            </ModalComponent> }
            { React.Children.map(children, child =>
                React.cloneElement(child, capture ? { onClickCapture: onClick } : {
                    onClick,
                })
            ) }
        </Fragment>;
    }
}

RequiresBillingContainer.propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
    isForTeam: PropTypes.bool,
    capture: PropTypes.bool,
    history: PropTypes.object.isRequired,
};

export default withRouter(inject('store')(
    observer(RequiresBillingContainer),
));
