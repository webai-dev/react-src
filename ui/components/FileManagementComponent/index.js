import React, { Fragment, PureComponent }            from 'react';
import PropTypes                                     from 'prop-types';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../ButtonComponent';
import FileDropZoneComponent                         from '../Form/FileDropZoneComponent';
import classNames                                    from 'classnames';
import SelectComponent                               from '../SelectComponent';
import FormsyHiddenInputComponent                    from '../formsy/FormsyHiddenInputComponent';
import styles                                        from './styles.scss';

class FileManagementComponent extends PureComponent {
    state = {
        matchValues: {},
    };

    /**
     * Will match columns from csv with built in keys
     *
     * @param {string} builtInKey
     * @param {number} csvIndex
     */
    handleSelectValue = (builtInKey, csvIndex) => {
        const newMatchValues = {};
        for (let oldBuiltInKey in this.state.matchValues) {
            if (this.state.matchValues[ oldBuiltInKey ] !== csvIndex) {
                newMatchValues[ oldBuiltInKey ] = this.state.matchValues[ oldBuiltInKey ];
            }
        }
        newMatchValues[ builtInKey ] = csvIndex;
        this.setState({
            matchValues: newMatchValues
        });
    };

    render() {
        const { handleSelectValue } = this;
        const { matchValues } = this.state;
        const { handleReadCsvFile, csvColumns, file, readingCsvFieldsError, formsyName, isAddMore } = this.props;

        const builtInValues = [
            {
                key: 'firstName',
                label: 'First Name',
                required: true,
            },
            {
                key: 'lastName',
                label: 'Last Name',
                required: true,
            },
            {
                key: 'recruiterEmail',
                label: 'Recruiter Email',
                required: true,
            },
            {
                key: 'email',
                label: 'Recipient Email',
                required: true,
            },
            {
                key: 'jobCategory',
                label: 'Job Category',
                required: false,
            },
        ];

        const selectedValues = [];
        for (let key in matchValues) {
            selectedValues.push(key);
        }
        const notSelectedValues = [];
        builtInValues.forEach(({ key, label, required }) => {
            if (required && !selectedValues.includes(key)) {
                notSelectedValues.push(label);
            }
        });
        const rows = [
            [ 'First Name', 'Last Name', 'Recruiter Email', 'Recipient Email', 'Job Category' ],
            [ 'john', 'doe', 'recruiter@agency.com', 'john.doe@recipient.com', 'Technology' ]
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(','))
            .join('\n');
        const encodedUri = encodeURI(csvContent);

        return (
            <Fragment>
                <div className={ classNames(styles.row, styles.marginBottom) }>
                    <div className={ styles.marginBottom }>
                        Please upload a list of recipients for the campaign. You can also <ButtonComponent
                        download="nps_data_template.csv"
                        forceHref
                        to={ encodedUri }
                        type="button"
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                    >download our csv template setup</ButtonComponent> for your convenience.
                    </div>
                    <FileDropZoneComponent
                        accept=".csv"
                        value={ file }
                        setValue={ handleReadCsvFile }
                        name="recipientList"
                        validExtensions={ [ 'csv' ] }
                        label="Recipient list (.CSV files only)"
                        processError={ readingCsvFieldsError }
                        required
                        maxFileSize={ 10000000 }
                    >
                        Upload recipient List
                    </FileDropZoneComponent>
                    { !csvColumns && <FormsyHiddenInputComponent
                        showErrorMessage
                        name={ formsyName }
                        required
                    /> }
                </div>
                { csvColumns && <div className={ classNames(styles.row, styles.marginBottom) }>
                    <div className={ styles.marginBottom }>
                        Please select the appropriate data match between the columns in your CSV and our built-in data
                        options below:
                    </div>
                    <div className={ styles.columnBox }>
                        <div className={ styles.column }>
                            <div className={ styles.columnTitle }>
                                Our built-in data options
                            </div>
                            { builtInValues.map(({ label, key, required }) => (<div
                                    key={ key }
                                    className={ styles.acceptItem }
                                >
                                    <span>
                                        { label }
                                        { required && <span className={ styles.required }>*</span> }
                                    </span>
                                </div>)
                            ) }

                        </div>
                        <div className={ styles.column }>
                            <div className={ styles.columnTitle }>
                                Column from your CSV file
                            </div>
                            { builtInValues.map(({ key }, index) => {
                                return (
                                    <div
                                        className={ styles.matchBox }
                                        key={ index }
                                    >
                                        <SelectComponent
                                            values={ csvColumns }
                                            setValue={ (csvIndex) => {handleSelectValue(key, csvIndex);} }
                                            value={ matchValues[ key ] }
                                        />
                                        { key === 'email' && matchValues[ key ] && !isAddMore &&
                                        <span className={ styles.hint }>
                                            Please check this is correct as this is who will receive the NPS survey
                                        </span>
                                        }
                                    </div>

                                );
                            }) }
                        </div>
                    </div>
                    { formsyName && <FormsyHiddenInputComponent
                        showErrorMessage
                        value={ matchValues }
                        name={ formsyName }
                        required
                        validations={ {
                            isMatchFull: function (values, value) {
                                let valueLength = 0;
                                for (let key in value) {
                                    valueLength = valueLength + 1;
                                }
                                return !notSelectedValues.length;
                            }
                        } }
                        validationErrors={ {
                            isMatchFull: `Please match all required values. Not matched: ${ notSelectedValues.join(', ') } `
                        } }
                    /> }
                </div> }
            </Fragment>
        );
    }
}

FileManagementComponent.propTypes = {
    file: PropTypes.object,
    handleReadCsvFile: PropTypes.func.isRequired,
    readingCsvFieldsError: PropTypes.string,
    csvColumns: PropTypes.arrayOf(PropTypes.object),
    formsyName: PropTypes.string,
    isAddMore: PropTypes.bool,
};

export default FileManagementComponent;
