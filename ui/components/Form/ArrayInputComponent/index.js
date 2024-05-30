import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import CheckBoxComponent        from '../../CheckBoxComponent';
import styles                   from './styles.scss';

class ArrayInputComponent extends PureComponent {
    state = {
        arrayInput: this.props.value || [],
        indexToShowMessage: null,
    };
    TIMEOUT = null;

    /**
     * Will set state to display info message and hide it after some time
     *
     * @param {number} index - index of array item
     */
    handleShowPreventInputChangeMessage = (index) => {
        if (this.TIMEOUT) {
            clearTimeout(this.TIMEOUT);
        }

        this.setState({ indexToShowMessage: index });
        this.TIMEOUT = setTimeout(
            () => {
                this.setState({ indexToShowMessage: null });
            },
            styles.time,
        );
    };

    /**
     * Pass proper array of specialisations to formsy and prevent from it if there is already a max amount of values
     *
     * @param {Object} specialisation - id and name of specialisation
     * @param {number} index - index of array item
     */
    handleArrayInputChange = (specialisation, index) => {
        const deselect = this.state.arrayInput.some(item => specialisation.id === item.id);
        if (!deselect && this.props.maxValues && this.state.arrayInput.length === this.props.maxValues) {
            this.handleShowPreventInputChangeMessage(index);
            return;
        }

        const newArrayInput = deselect ?
            this.state.arrayInput.filter(item => specialisation.id !== item.id) :
            [
                ...this.state.arrayInput,
                specialisation,
            ];
        this.setState({
            arrayInput: newArrayInput,
        });
        this.props.setValue(newArrayInput);
    };

    render() {
        const { values, isInnerApp, maxValuesText, dataTest } = this.props;
        const { handleArrayInputChange } = this;
        const { arrayInput, indexToShowMessage } = this.state;

        let itemsToShow = [];
        values.forEach(({ id, name }, index) => {
            if (indexToShowMessage === index) {
                itemsToShow.push(
                    <div
                        className={ styles.messageBox }
                        key="maxValuesText"
                    >
                        <div
                            className={ styles.message }
                        >{ maxValuesText }</div>
                    </div>,
                );
            }
            itemsToShow.push(
                <CheckBoxComponent
                    dataTest={ `${ dataTest }-${ name }` }
                    key={ id }
                    name={ id }
                    label={ name }
                    onChange={ () => {
                        handleArrayInputChange(
                            {
                                id,
                                name,
                            },
                            index,
                        );
                    } }
                    value={ arrayInput.some(specialisation => specialisation.id === id) }
                    isInnerApp={ isInnerApp }
                />,
            );
        });

        return itemsToShow;
    }
}

ArrayInputComponent.propTypes = {
    setValue: PropTypes.func.isRequired, // from withFormsy
    values: PropTypes.array.isRequired,
    value: PropTypes.array,
    isInnerApp: PropTypes.bool,
    maxValues: PropTypes.number,
    maxValuesText: PropTypes.string,
    dataTest: PropTypes.string,
};

export default ArrayInputComponent;
