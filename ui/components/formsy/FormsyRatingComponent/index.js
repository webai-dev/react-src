import React           from 'react';
import PropTypes       from 'prop-types';
import { withFormsy }  from 'formsy-react';
import RatingComponent from '../../Form/RatingComponent';

const FormsyRatingComponent = (props) => {
    const {
        getValue,
        setValue,
        rateLevel,
        small,
        className,
        isFormSubmitted,
        required,
        dataTest,
        label,
        name,
        getErrorMessage,
    } = props;
    const value = getValue();

    const errorMessage = getErrorMessage();
    return (
        <RatingComponent
            required={ required }
            label={ label }
            isError={ isFormSubmitted() && required && !value }
            className={ className }
            rating={ value }
            onRateSelect={ setValue }
            rateLevel={ rateLevel }
            errorMessage={ errorMessage }
            small={ small }
            dataTest={ dataTest }
            name={ name }
        />
    );
};

FormsyRatingComponent.propTypes = {
    isFormSubmitted: PropTypes.func.isRequired, // from withFormsy
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired, // from withFormsy
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    className: PropTypes.string,
    dataTest: PropTypes.string,
    label: PropTypes.string,
    rateLevel: PropTypes.number,
    small: PropTypes.bool,
};

export default withFormsy(FormsyRatingComponent);
