import React                            from 'react';
import PropTypes                        from 'prop-types';
import ButtonComponent, { BUTTON_TYPE } from '../../components/ButtonComponent';
import Cross2Icon                       from '../../../assets/icons/Cross2Icon';
import ModalComponent                   from '../../components/ModalComponent';
import { RecruiterView }                from '../../pages/Loadable';
import styles                           from './styles.scss';

const RecruiterModalComponent = (props) => {
    const { recruiterId, toggle } = props;
    return (
        <ModalComponent
            handleClose={ toggle }
            classNameOuter={ styles.modal }
            classNameInner={ styles.modalInner }
        >
            <div className={ styles.closeBox }>
                <ButtonComponent
                    ariaLabel="close modal"
                    btnType={ BUTTON_TYPE.LINK }
                    onClick={ toggle }
                >
                    <Cross2Icon />
                </ButtonComponent>
            </div>
            <RecruiterView
                showBackButton={ false }
                recruiterId={ recruiterId }
            />
        </ModalComponent>
    );
};

RecruiterModalComponent.propTypes = {
    // job: PropTypes.object.isRequired,
    recruiterId: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired,
    // rootProps: PropTypes.object.isRequired,
};

export default RecruiterModalComponent;
