import React     from 'react';
import PropTypes from 'prop-types';
import ButtonComponent, {
    BUTTON_SIZE,
    BUTTON_TYPE,
} from '../../../../components/ButtonComponent';
import styles     from './styles.scss';

const FooterButtonComponent = (props) => {
    const { children, to } = props;
    return (
        <ButtonComponent
            className={ styles.link }
            btnType={ BUTTON_TYPE.LINK_ACCENT }
            size={ BUTTON_SIZE.SMALL }
            to={ to }
        >
            { children }
        </ButtonComponent>
    );
};

FooterButtonComponent.propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
};

export default FooterButtonComponent;
