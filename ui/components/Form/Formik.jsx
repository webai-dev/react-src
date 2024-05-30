import React                                               from 'react';
import { FormGroup, Input, Label, FormFeedback, FormText } from 'reactstrap';
import { Field as BaseField, getIn }                       from 'formik';

export const FormikInput = ({ ...inputProps }) => {
    const {
        field, // { name, value, onChange, onBlur }
        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        children,
        label,
        helpText,
        innerComponent: InputComponent = Input,
        id,
        name,
        onChange,
        ignoreTouchedState = false,
        ...props
    } = inputProps;
    const newField = { ...field, value: field.value || '' };
    const isTouched = getIn(touched, field.name);
    const fieldError = getIn(errors, field.name);

    return (
        <FormGroup>
            { label && <Label for={ id || name }>{ label }</Label> }
            <InputComponent
                id={ id || name }
                name={ name || id }
                autoComplete="off"
                { ...props }
                { ...newField }
                onChange={ onChange || field.onChange }
                children={ children }
            />
            { helpText && <FormText color="muted">{ helpText }</FormText> }

            { (ignoreTouchedState === true || isTouched) &&
            fieldError &&
            fieldError.length > 0 && (
                <FormFeedback
                    style={ { display: 'block' } }
                    valid={ false }
                >
                    { fieldError }
                </FormFeedback>
            ) }
        </FormGroup>
    );
};

export const Field = (props) => {
    const {
        children,
        component = FormikInput,
        innerComponent = Input,
        id,
        name,
        ...restProps
    } = props;
    return (
        <BaseField
            component={ component }
            innerComponent={ innerComponent }
            { ...restProps }
            id={ id || name }
            name={ name || id }
        >
            { children }
        </BaseField>
    );
};
