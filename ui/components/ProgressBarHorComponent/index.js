import React      from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';
import styles     from './styles.scss';

const ProgressBarHorComponent = (props) => {
    const { className, progressText, progress = 0, label, backgroundColor } = props;
    const customColor = backgroundColor ? { backgroundColor } : {};
    return (
        <div className={ styles.box }>
            <div className={ styles.label }>{ label }</div>
            <div className={ classNames(styles.progressBox, className) }>
                <div
                    className={ styles.progress }
                    style={ { width: `${ 100 * progress.toFixed(2) }%`, ...customColor } }
                >
                    <div className={ styles.progressText }>
                        { progressText }
                    </div>
                </div>
            </div>
        </div>

    );
};

ProgressBarHorComponent.propTypes = {
    progressText: PropTypes.string,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    backgroundColor: PropTypes.string,
    progress: PropTypes.number
};

export default ProgressBarHorComponent;
