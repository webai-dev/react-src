import React                  from 'react';
import PropTypes              from 'prop-types';
import { withFormsy }         from 'formsy-react';
import ImageDropZoneComponent from '../../Form/ImageDropZoneComponent';

const FormsyImageDropZoneComponent = (props) => {
    const {
        getValue,
        getErrorMessage,
        setValue,
        required,
        className,
        children,
        cropperProps,
        tip,
        name,
        onClick,
        isRemovable,
        dropZoneClassName,
        borderRadius,
    } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();

    return (
        <ImageDropZoneComponent
            onClick={ onClick }
            name={ name }
            value={ value }
            setValue={ setValue }
            className={ className }
            dropZoneClassName={ dropZoneClassName }
            errorMessage={ errorMessage }
            required={ required }
            cropperProps={ cropperProps }
            tip={ tip }
            isRemovable={ isRemovable }
            borderRadius={ borderRadius }
        >
            { children }
        </ImageDropZoneComponent>
    );
};

FormsyImageDropZoneComponent.propTypes = {
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    isRemovable: PropTypes.bool,
    className: PropTypes.string,
    dropZoneClassName: PropTypes.string,
    tip: PropTypes.string,
    children: PropTypes.node.isRequired,
    cropperProps: PropTypes.object,
    borderRadius: PropTypes.number,
};

export default withFormsy(FormsyImageDropZoneComponent);
