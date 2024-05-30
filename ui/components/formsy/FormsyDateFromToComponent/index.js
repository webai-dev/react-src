import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import FormsyDateInputComponent           from '../FormsyDateInputComponent';
import HelpComponent                      from '../../HelpComponent';
import styles                             from './styles.scss';

class FormsyDateFromToComponent extends PureComponent {
    state = {
        startDate: null,
        endDate: null
    };

    /**
     * Set Start date. Will not allow end date input select date before start date
     *
     * @param {Date} value
     */
    handleDateStartSelect = (value) => {
        this.setState({ startDate: new Date(value.setHours(0, 0, 0, 0)) });
    };

    /**
     * Set End date. Will not allow start date input select date after end date
     *
     * @param {Date} value
     */
    handleDateEndSelect = (value) => {
        this.setState({ endDate: new Date(value.setHours(23, 0, 0, 0)) });
    };

    render() {
        const {
            startDate,
            endDate,
        } = this.state;
        const {

            handleDateStartSelect,
            handleDateEndSelect,
        } = this;
        const {
            startValue,
            startClassName,
            startName,
            startLabel,
            startRequired,
            endClassName,
            endValue,
            endName,
            endLabel,
            endRequired,
            helpText,
        } = this.props;
        return (
            <Fragment>
                <FormsyDateInputComponent
                    className={ startClassName }
                    name={ startName }
                    value={ startValue }
                    required={ startRequired }
                    label={ !helpText ? startLabel : <div className={ styles.label }>
                        { startLabel }{ ' ' }<HelpComponent
                        text={ helpText }
                        className={ styles.help }
                    />
                    </div> }
                    maxDate={ endDate }
                    minDate={ new Date() }
                    onChange={ handleDateStartSelect }
                />
                <FormsyDateInputComponent
                    className={ endClassName }
                    value={ endValue }
                    name={ endName }
                    required={ endRequired }
                    label={ endLabel }
                    minDate={ startDate > new Date() ? startDate : new Date() }
                    onChange={ handleDateEndSelect }
                />
            </Fragment>
        );
    }
}

FormsyDateFromToComponent.propTypes = {
    startValue: PropTypes.string,
    startClassName: PropTypes.string,
    startName: PropTypes.string.isRequired,
    startLabel: PropTypes.string,
    startRequired: PropTypes.bool,
    endValue: PropTypes.string,
    endClassName: PropTypes.string,
    endName: PropTypes.string.isRequired,
    endLabel: PropTypes.string,
    helpText: PropTypes.string,
    endRequired: PropTypes.bool
};

export default FormsyDateFromToComponent;
