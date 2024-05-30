import React, {
    PureComponent,
    Fragment,
}                           from 'react';
import PropTypes            from 'prop-types';
import FormsyInputComponent from '../../../components/formsy/FormsyInputComponent';
import DropDownComponent    from '../../../components/DropDownComponent';
import getNumberFromString  from '../../../../util/getNumberFromString';
import getSalaryRange       from '../../../../util/getSalaryRange';
import classNames           from 'classnames';
import styles               from './styles.scss';

class SpecialInputForSalaryComponent extends PureComponent {
    state = {
        currentValue: this.props.value,
    };

    /**
     * Save currentValue - will be used to display popover about salary range for user
     * @param {number} [currentValue]
     */
    handleSaveCurrentValue = (currentValue = 0) => {
        this.setState({ currentValue });
    };

    render() {
        const { handleSaveCurrentValue } = this;
        const { value, className } = this.props;
        const { currentValue } = this.state;

        return (
            <DropDownComponent
                className={ classNames(styles.container, className) }
                labelClassName={ styles.salaryLabel }
                isLabelFocusable
                label={
                    <FormsyInputComponent
                        className={ styles.input }
                        value={ value }
                        onChange={ handleSaveCurrentValue }
                        required
                        placeholder="Salary package"
                        label="Salary - only visible to you"
                        name="salary"
                        modifyValueOnChange={ (salary) => getNumberFromString(salary, 0) }
                        pre="$"
                        post=".00"
                    />
                }
                selectClassName={ styles.salarySelect }
                selectVisibleClassName={ currentValue ? styles.salarySelectVisible : null }
                select={
                    <Fragment>
                        This will only be displayed as{ ' ' }{ getSalaryRange(currentValue) }
                    </Fragment>
                }
            />
        );
    }
}

SpecialInputForSalaryComponent.propTypes = {
    value: PropTypes.number,
    className: PropTypes.string,
};

export default SpecialInputForSalaryComponent;
