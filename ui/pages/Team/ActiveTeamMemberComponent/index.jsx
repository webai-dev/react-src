import React, { Fragment } from 'react';
import PropTypes           from 'prop-types';
import Cross2Icon          from '../../../../assets/icons/Cross2Icon';
import ModalComponent      from '../../../components/ModalComponent';
import LoaderComponent     from '../../../components/LoaderComponent';
import AvatarComponent     from '../../../components/AvatarComponent';
import FixedInputComponent from '../../../components/Form/FixedInputComponent';
import ButtonComponent, {
    BUTTON_TYPE,
}                          from '../../../components/ButtonComponent';
import styles              from './styles.scss';

const ActiveTeamMemberComponent = (props) => {
    const { handleCloseModal, isLoading, member } = props;

    return (
        <ModalComponent
            handleClose={ handleCloseModal }
            classNameOuter={ styles.modal }
            classNameInner={ styles.box }
        >
            <ButtonComponent
                ariaLabel="close modal"
                btnType={ BUTTON_TYPE.LINK }
                className={ styles.close }
                onClick={ handleCloseModal }
            >
                <Cross2Icon />
            </ButtonComponent>
            { isLoading && <LoaderComponent row /> }
            { !isLoading && !member && <Fragment>
                No such member
            </Fragment>
            }
            { !isLoading && member && <Fragment>
                <div className={ styles.avatarBox }>
                    <AvatarComponent
                        className={ styles.avatar }
                        url={ member.profilePhoto && member.profilePhoto.url }
                        alt={ `${ member.firstName } ${ member.lastName } avatar` }
                    />
                </div>


                <div className={ styles.row }>
                    <FixedInputComponent
                        className={ styles.infoBox }
                        value={ member.firstName }
                        label="First Name"
                    />
                    <FixedInputComponent
                        className={ styles.infoBox }
                        value={ member.lastName }
                        label="Last Name"
                    />
                    <FixedInputComponent
                        className={ styles.infoBox }
                        value={ member.email }
                        label="Email"
                    />
                </div>
                <div className={ styles.row }>
                    <FixedInputComponent
                        className={ styles.infoBox }
                        value={ member.userType || 'User' }
                        label="User Type"
                    />
                    <FixedInputComponent
                        className={ styles.infoBox }
                        value={ `${ member.city ? member.city : '' } ${ member.state ? member.state : '' }` }
                        label="Location"
                    />
                    <FixedInputComponent
                        className={ styles.infoBox }
                        value={ member.contactNumber }
                        label="Contact Number"
                    />
                </div>
            </Fragment> }
        </ModalComponent>
    );
};

ActiveTeamMemberComponent.propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    member: PropTypes.object,
    isLoading: PropTypes.bool,
};

export default ActiveTeamMemberComponent;
