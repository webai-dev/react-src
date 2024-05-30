import React           from 'react';
import PropTypes       from 'prop-types';
import SelectComponent from '../SelectComponent';

const SelectRecruiterFromAgencyId = (props) => {
    const {
        agencyRecruiters,
        className,
        selectClassName,
        selectedRecruiterId,
        handleSelectRecruiter,
        recruiterId,
    } = props;

    let recruiterSelectValues = [];
    if (agencyRecruiters) {
        recruiterSelectValues = agencyRecruiters.reduce((recruiters, agencyRecruiter) => {
            return (agencyRecruiter.claimed && agencyRecruiter.id !== recruiterId) ?
                [
                    ...recruiters,
                    {
                        key: agencyRecruiter.id,
                        label: [ agencyRecruiter.firstName, agencyRecruiter.lastName ].join(' ')
                    }
                ] :
                recruiters;
        }, []);
        recruiterSelectValues = [
            {
                key: null,
                label: 'Agency'
            },
            {
                key: recruiterId,
                label: 'Me'
            },
            ...recruiterSelectValues
        ];
    }
    return (
        <SelectComponent
            className={ className }
            selectClassName={ selectClassName }
            isWhite
            value={ selectedRecruiterId }
            setValue={ handleSelectRecruiter }
            values={ recruiterSelectValues }
        />
    );
};

SelectRecruiterFromAgencyId.propTypes = {
    agencyRecruiters: PropTypes.array.isRequired,
    className: PropTypes.string,
    selectClassName: PropTypes.string,
    selectedRecruiterId: PropTypes.string,
    handleSelectRecruiter: PropTypes.func.isRequired,
    recruiterId: PropTypes.string.isRequired,
};

export default SelectRecruiterFromAgencyId;
