import React, { Fragment }              from 'react';
import PropTypes                        from 'prop-types';
import StarIcon                         from '../../../assets/icons/StarIcon';
import RequiresPermission               from '../User/RequiresPermission';
import ButtonComponent, { BUTTON_TYPE } from '../ButtonComponent';
import ModalComponent                   from '../ModalComponent';
import FormsyComponent                  from '../formsy/FormsyComponent';
import FormsySubmitComponent            from '../formsy/FormsySubmitComponent';
import FormsyInputComponent             from '../formsy/FormsyInputComponent';
import styles                           from './styles.scss';
import classNames                       from 'classnames';

const AddToFavoriteComponent = (props) => {
    const {
        className,
        text,
        isLoading,
        active,
        showModal,
        handleOpenModal,
        handleCloseModal,
        handleSubmit,
        handleAddToFavorite,
        big,
        small,
    } = props;
    const starId = 'favorite';
    const formId = 'formToLogin';

    return ( // will show that component for users and not logged
        <Fragment>
            <RequiresPermission roles={ [ 'recruiter_favourite' ] }>
                <div className={ classNames(styles.box, className, {
                    [styles.bigBox]: big,
                    [styles.smallBox]: small,
                }) }>
                    <ButtonComponent
                        btnType={ BUTTON_TYPE.LINK }
                        onClick={ handleAddToFavorite }
                        className={ classNames(
                            styles.star,
                            {
                                [styles.starActive]: active,
                            },
                        ) }
                        id={ starId }
                        ariaLabel="Add to favorite"
                    >
                        <StarIcon />
                    </ButtonComponent>

                    { text && <label htmlFor={ starId } className={ styles.text }>
                        { text }
                    </label> }
                </div>
            </RequiresPermission>

            <RequiresPermission noUser>
                <Fragment>
                    <div className={ classNames(styles.box, className, {
                        [styles.bigBox]: big,
                        [styles.smallBox]: small,
                    }) }>
                        <ButtonComponent
                            btnType={ BUTTON_TYPE.LINK }
                            onClick={ handleOpenModal }
                            className={ classNames(
                                styles.star,
                                {
                                    [styles.starActive]: active,
                                },
                            ) }
                            id={ starId }
                            ariaLabel="Add to favorite"
                        >
                            <StarIcon />
                        </ButtonComponent>

                        { text && <label htmlFor={ starId } className={ styles.text }>
                            { text }
                        </label> }
                    </div>

                    { showModal &&
                    <ModalComponent handleClose={ handleCloseModal } classNameOuter={ styles.modal }>
                        <FormsyComponent onValidSubmit={ handleSubmit } className={ styles.form } formId={ formId }>
                            <FormsyInputComponent
                                required
                                small
                                placeholder="Your email"
                                name="email"
                                modifyValueOnChange={ value => value ? value.trim() : value }
                            />
                            <FormsyInputComponent
                                required
                                small
                                placeholder="Your password"
                                type="password"
                                name="password"
                            />
                            <FormsySubmitComponent
                                disabled={ isLoading }
                                className={ styles.submit }
                                formId={ formId }
                                btnType={ BUTTON_TYPE.ACCENT }
                            >
                                Log In
                            </FormsySubmitComponent>
                        </FormsyComponent>
                    </ModalComponent> }
                </Fragment>
            </RequiresPermission>
        </Fragment>
    );
};

AddToFavoriteComponent.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    active: PropTypes.bool,
    showModal: PropTypes.bool,
    isLoading: PropTypes.bool,
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleAddToFavorite: PropTypes.func.isRequired,
    big: PropTypes.bool,
    small: PropTypes.bool,
};

export default AddToFavoriteComponent;
