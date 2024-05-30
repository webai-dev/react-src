import React                    from 'react';
import PropTypes                from 'prop-types';
import styles                   from './styles.scss';

const ErrorComponent = props => {
    const { error, retry, onlyMessage } = props;
    if (onlyMessage) {
        return <div>
            <div className={ styles.error }>{ error.stack }</div>
            <div className={ styles.error }>{ JSON.stringify(error, null, 4) }</div>
        </div>;
    }
    return (
        <div>
            <span>
                There was an error
                { retry && (
                    <span>
                        &nbsp;,&nbsp;
                        <button onClick={ () => window.location.reload() }>click to retry</button>
                    </span>
                ) }
            </span>
            <div>Please screenshot the following and report it as a bug</div>
            <div className={ styles.error }>{ error.stack }</div>
            <div className={ styles.error }>{ JSON.stringify(error, null, 4) }</div>
        </div>
    );
};

ErrorComponent.propTypes = {
    error: PropTypes.object.isRequired,
    retry: PropTypes.func,
    onlyMessage: PropTypes.bool,
};

export default ErrorComponent;
