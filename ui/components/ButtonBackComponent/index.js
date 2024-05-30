import React                                         from 'react';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../ButtonComponent';
import ArrowLeftIcon                                 from '../../../assets/icons/ArrowLeftIcon';
import PropTypes                                     from 'prop-types';

const ButtonBackComponent = (props) => {
    const { url } = props;
    return (
        <ButtonComponent btnType={ BUTTON_TYPE.WHITE } size={ BUTTON_SIZE.BIG } to={ url }>
            <ArrowLeftIcon/>&nbsp;Back
        </ButtonComponent>
    );
};

ButtonBackComponent.propTypes = {
    url: PropTypes.string.isRequired,
};

export default ButtonBackComponent;
