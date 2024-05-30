import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../../../components/ButtonComponent';
import styles                                        from './styles.scss';

const AgencyResultComponent = (props) => {
    const { agencies, agencyId, handleOpenConfirmModal, isLoading } = props;
    return (
        agencies.slice(0, 5)
            .map(({ result: agency }) => (
                <div
                    className={ styles.agency }
                    key={ agency.id }
                >
                    <span>
                        { agency.name }
                    </span>
                    { agencyId === agency.id ? <div>Your agency</div> : <ButtonComponent
                        onClick={ () => {handleOpenConfirmModal(agency.id);} }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                        disabled={ isLoading }
                    >
                        Select
                    </ButtonComponent> }
                </div>
            ))
    );
};

AgencyResultComponent.propTypes = {
    agencyId: PropTypes.string,
    handleOpenConfirmModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    agencies: PropTypes.array.isRequired,
};

export default AgencyResultComponent;
