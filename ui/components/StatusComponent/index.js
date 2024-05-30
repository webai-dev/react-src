import classNames      from 'classnames';
import React           from 'react';
import PropTypes       from 'prop-types';
import styles          from './styles.scss';

const StatusComponent = (props) => {
    const { status, big } = props;
    return (
        <div
            className={ classNames(
                styles.status,
                {
                    [ styles.statusBig ]: big,
                    [ styles.statusSuccess ]: status === StatusComponent.STATUS.SUCCESS,
                    [ styles.statusWarning ]: status === StatusComponent.STATUS.WARNING,
                    [ styles.statusDanger ]: status === StatusComponent.STATUS.DANGER,
                    [ styles.statusHighlight ]: status === StatusComponent.STATUS.HIGHLIGHT,
                },
            ) }
        />
    );
};


StatusComponent.STATUS = {
    NOT_ACTIVE: 'notActive',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
    HIGHLIGHT: 'highlight',
};

StatusComponent.propTypes = {
    big: PropTypes.bool,
    status: PropTypes.oneOf([
        StatusComponent.STATUS.NOT_ACTIVE,
        StatusComponent.STATUS.SUCCESS,
        StatusComponent.STATUS.WARNING,
        StatusComponent.STATUS.DANGER,
        StatusComponent.STATUS.HIGHLIGHT,
    ]),
};

export default StatusComponent;
