import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../../ButtonComponent';
import styles                                        from './styles.scss';

const ButtonActionComponent = (props) => {
    const { onClick, text, to, dataTest, isLoading } = props;
    return (
        <ButtonComponent
            dataTest={ dataTest }
            to={ to }
            onClick={ onClick }
            btnType={ BUTTON_TYPE.ACCENT }
            main
            size={ BUTTON_SIZE.SMALL }
            className={ styles.button }
            disabled={ isLoading }
        >
            { text }
        </ButtonComponent>
    );
};

ButtonActionComponent.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string.isRequired,
    dataTest: PropTypes.string,
    to: PropTypes.string,
    isLoading: PropTypes.bool,
};

export default ButtonActionComponent;
