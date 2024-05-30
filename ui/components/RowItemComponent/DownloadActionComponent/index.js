import React                            from 'react';
import PropTypes                        from 'prop-types';
import DownloadIcon                     from '../../../../assets/icons/DownloadIcon';
import ButtonComponent, { BUTTON_TYPE } from '../../ButtonComponent';
import styles                           from './styles.scss';

const DownloadActionComponent = (props) => {
    const { to, isLoading } = props;
    return (
        <ButtonComponent
            className={ styles.actionBox }
            to={ to }
            btnType={ BUTTON_TYPE.ICON }
            main
            disabled={ isLoading }
            target="_blank"
            rel="noopener noreferrer"
            download
        >
            <DownloadIcon/>
        </ButtonComponent>
    );
};

DownloadActionComponent.propTypes = {
    to: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
};

export default DownloadActionComponent;
