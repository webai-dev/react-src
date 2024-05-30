# Formsy

- [Why formsy?](#markdown-header-why-formsy)
- [How use formsy to create form?](#markdown-header-how-use-formsy-to-create-form)
- [How create new formsy component?](#markdown-header-how-create-new-formsy-component)
- [How pass additional fields to formsy?](#markdown-header-how-pass-additional-fields-to-formsy)
- [I want more!](#markdown-header-i-want-more)

## Why formsy?
Formsy allow to decouple custom form and inputs, so you don't need to pass all props and handlers. All will be done automatically.
## How use formsy to create form?
Key moments:
- each `Formsy...Component` has required field `name` it is key that will be used to compose final object that will be passed to `onValidSubmit`
- `FormsySubmitComponent` and `FormsyComponent` are decoupled so you can place submit button where you want. But for that you have to pass same `formId` for both components
- `required` param tells formsy which field is required. If one of such fields is empty `onValidSubmit` will not work

Here is simple code snippet:
```javascript
import React, { Fragment, } from 'react';
import FormsyComponent from '../../components/formsy/FormsyComponent';
import FormsySubmitComponent from '../../components/formsy/FormsySubmitComponent';
import FormsyInputComponent from '../../components/formsy/FormsyInputComponent';
import FormsySelectComponent from '../../components/formsy/FormsySelectComponent';
import FormsyMonthInputComponent from '../../components/formsy/FormsyMonthInputComponent';

const MyFormComponent = () => {
    // formParams - is an object with keys === name
    // in that case formParams will be {jobTitle: '', category: [], placementDate: ''}
    const handleSubmit = (formParams) => {console.log(formParams)};
    const formId = 'idToSyncFormAndSubmitButton';
    return (
        <div>
            <FormsySubmitComponent formId={formId}>
                Submit button
            </FormsySubmitComponent>

            <FormsyComponent
                onValidSubmit={handleSubmit}
                formId={formId}
            >
                <FormsyInputComponent
                    name="jobTitle"
                    required
                    placeholder="Enter job title"
                    label="Job title"
                />
                <FormsySelectComponent
                    name="category"
                    required
                    values={[ {key: '1', label: '1'},{key: '2', label: '2'},{key: '3', label: '3'} ]}
                    label="Job Category"
                />
                <FormsyMonthInputComponent
                    name="placementDate"
                    required
                    placeholder="Enter Date"
                    minDate={new Date()}
                    label="Placement date"
                />
            </FormsyComponent>
        </div>
    );
};
```

Now you are ready to use `Forms...Component`'s
## How pass additional fields to formsy?
Some time you need to pass additional fields to `onValidSubmit` handler in that case just add `FormsyHiddenInputComponent` anywhere inside `FormsyComponent` (or inside nested components).
```javascript
<FormsyHiddenInputComponent value={ 'Harry' } name="firstName"/>
```
## How pass errors for some fields returned by backend?
`FormsyComponent` has `onValidSubmit` function third argument allows to set error message to any field:
```javascript

import getErrorMessage from '../../../util/getErrorMessage';
import {toast} from 'react-toastify';

...

handleSubmit = (input, resetForm, invalidateForm) => {
        this.setState({
            isLoading: true,
            errors: null,
        });
        this.commitPlacementsCreate({ placement: input }).then(result => {
            this.setState({ isLoading: false });
            // do success logic
        })
        .catch((error) => {
            const errorParsed = getErrorMessage(error);
            toast.error(errorParsed.title);
            this.setState({
                isLoading: false,
                errors: errorParsed.message,
            });
        });
}

...

// And pass that handler to `FormsyComponent`
<FormsyComponent onValidSubmit={this.handleSubmit} errorMessage={this.state.errors}/>


```
## How pass error message for form in general?
Just pass errorMessage prop - it hast to be string
```javascript
<FormsyComponent errorMessage={'Some error'}>
```
## How create new formsy component?
Here is simple code snippet:
Key moments:
- You have pass `name` value to `FormsyOneTwoComponent` (you also may want to reuse that value inside `OneTwoComponent`)
- You need to use setValue from `withFormsy` wrapper to change value. That will tell formsy what value that field with that name should have
- In order to receive formsy value you need to get it with `const value = getValue();`
- You may path value to `<FormsyOneTwoComponent {...props} value={1}/>` it will be used as initial value and will be set automatically.

```javascript
import { withFormsy } from 'formsy-react';
import React from 'react';
import PropTypes from 'prop-types';

const OneTwoComponent = (props) => {
    const {setValue, value, errorMessage } = props;
    return (
        <div>
            current value: {value}
            <button onClick={() => {setValue(1)}}>
                1
            </button>
            <button onClick={() => {setValue(2)}}>
                2
            </button>
            {errorMessage && <span>some error</span>}
        </div>
    )
};

const FormsyOneTwoComponent = (props) => {
    const { getValue, getErrorMessage, setValue, } = props;
    const value = getValue();
    const errorMessage = getErrorMessage();
    return (
        <OneTwoComponent
            value={value}
            setValue={setValue}
            errorMessage={errorMessage}
        />
    );
};

FormsyOneTwoComponent.propTypes = {
    setValue: PropTypes.func.isRequired, // from withFormsy
    getValue: PropTypes.func.isRequired, // from withFormsy
    getErrorMessage: PropTypes.func.isRequired, // from withFormsy
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
};

export default withFormsy(FormsyOneTwoComponent);

```
## I want more!

Here is some links from formsy git repository:

- [Formsy git repo](https://github.com/formsy/formsy-react/)
- [Formsy api](https://github.com/formsy/formsy-react/blob/master/API.md)
