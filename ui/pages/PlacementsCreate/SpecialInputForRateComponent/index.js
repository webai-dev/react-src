import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import FormsyInputComponent     from '../../../components/formsy/FormsyInputComponent';
import FormsySelectComponent    from '../../../components/formsy/FormsySelectComponent';
import getNumberFromString      from '../../../../util/getNumberFromString';
import classNames               from 'classnames';
import styles                   from './styles.scss';

class SpecialInputForRateComponent extends PureComponent {
    render() {
        const { rate, rateType, dataTest, className } = this.props;

        return (
            <div className={ classNames(styles.inputsBox, className) }>
                <FormsySelectComponent
                    dataTest={ dataTest }
                    className={ styles.input }
                    value={ rateType }
                    name="rateType"
                    values={ [
                        {
                            key: 'hourly',
                            label: 'Hourly',
                        },
                        {
                            key: 'daily',
                            label: 'Daily',
                        },
                    ] }
                    label="Rate type"
                    required
                />
                <FormsyInputComponent
                    className={ styles.input }
                    value={ rate }
                    name="rate"
                    required
                    placeholder="Rate"
                    modifyValueOnChange={ (rateValue) => getNumberFromString(rateValue, 2) }
                    pre="$"
                    label="Rate"
                />
            </div>
        );
    }
}

SpecialInputForRateComponent.propTypes = {
    rate: PropTypes.number,
    rateType: PropTypes.string,
    dataTest: PropTypes.string,
    className: PropTypes.string,
};

export default SpecialInputForRateComponent;
