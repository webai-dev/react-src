import React                            from 'react';
import PropTypes                        from 'prop-types';
import TrashIcon                        from '../../../../assets/icons/TrashIcon';
import ButtonComponent, { BUTTON_TYPE } from '../../ButtonComponent';
import styles                           from './styles.scss';

const DeleteActionComponent = (props) => {
    const { onClick, isLoading } = props;
    return (
        <ButtonComponent
            className={ styles.actionBox }
            onClick={ onClick }
            btnType={ BUTTON_TYPE.ICON }
            main
            disabled={ isLoading }
        >
            <TrashIcon />
        </ButtonComponent>
    );
};

DeleteActionComponent.propTypes = {
    onClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default DeleteActionComponent;
