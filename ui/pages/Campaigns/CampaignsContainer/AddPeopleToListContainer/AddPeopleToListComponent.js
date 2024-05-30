import classNames                 from 'classnames';
import React, { Fragment }        from 'react';
import PropTypes                  from 'prop-types';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                 from '../../../../components/ButtonComponent';
import Cross2Icon                 from '../../../../../assets/icons/Cross2Icon';
import CountersComponent          from '../../../../components/CountersComponent';
import FileManagementComponent    from '../../../../components/FileManagementComponent';
import FormsyDateFromToComponent  from '../../../../components/formsy/FormsyDateFromToComponent';
import FormsyHiddenInputComponent from '../../../../components/formsy/FormsyHiddenInputComponent';
import FormsySelectComponent      from '../../../../components/formsy/FormsySelectComponent';
import ModalComponent             from '../../../../components/ModalComponent';
import FormsyComponent            from '../../../../components/formsy/FormsyComponent';
import FormsySubmitComponent      from '../../../../components/formsy/FormsySubmitComponent';
import styles                     from './styles.scss';

const AddPeopleToListComponent = (props) => {
    const {
        handleOpenModal,
        handleCloseModal,
        handleSubmit,
        showModal,
        handleReadCsvFile,
        csvColumns,
        file,
        readingCsvFieldsError,
        campaignId,
        csvWarnings,
    } = props;
    const formId = 'SendCodeToEmail';

    return (
        <Fragment>
            <button
                type="button"
                className={ classNames(styles.item) }
                onClick={ handleOpenModal }
            >
                Add people to List
            </button>

            { // MODAL
                showModal &&
                <ModalComponent handleClose={ handleCloseModal }>
                    <ButtonComponent
                        ariaLabel="close modal"
                        btnType={ BUTTON_TYPE.LINK }
                        className={ styles.close }
                        onClick={ handleCloseModal }
                    >
                        <Cross2Icon />
                    </ButtonComponent>
                    { !csvWarnings ? <FormsyComponent
                        onValidSubmit={ handleSubmit }
                        className={ styles.form }
                        formId={ formId }
                    >
                        <h2 className={ styles.title }>
                            Add People to List
                        </h2>

                        <FileManagementComponent
                            isAddMore
                            file={ file }
                            handleReadCsvFile={ handleReadCsvFile }
                            csvColumns={ csvColumns }
                            readingCsvFieldsError={ readingCsvFieldsError }
                            formsyName="matchValues"
                        />
                        <FormsyHiddenInputComponent
                            name="id"
                            value={ campaignId }
                            required
                        />
                        <div className={ styles.inputBox }>
                            <FormsySelectComponent
                                className={ styles.input }
                                name="sendReminder"
                                values={ [
                                    {
                                        key: 1,
                                        label: 'After 1 day',
                                    },
                                    {
                                        key: 2,
                                        label: 'After 2 day',
                                    },
                                    {
                                        key: 3,
                                        label: 'After 3 day',
                                    },
                                    {
                                        key: 7,
                                        label: 'After 1 Week',
                                    },
                                ] }
                                label="Send reminder"
                                notSelectedLabel="No reminder"
                            />
                            <FormsyDateFromToComponent
                                startName="startDate"
                                startLabel="Start date"
                                startRequired
                                endName="endDate"
                                endLabel="End date"
                                helpText="Stagger surveys requests over time to create a steady
                                stream of surveys and prevent survey fatigue."
                                endRequired
                            />
                        </div>
                        <FormsySubmitComponent
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                        >
                            Submit
                        </FormsySubmitComponent>
                    </FormsyComponent> : <div className={ styles.form }>
                        <h2 className={ styles.title }>
                            Campaign Uploaded
                        </h2>
                        <CountersComponent
                            counters={ [
                                { value: csvWarnings.newRecipients, label: 'Successful' },
                                { value: csvWarnings.recipientsDuplicated, label: 'Duplicates' },
                                { value: csvWarnings.recipientsInvalidRecruiter, label: 'Failed' },
                            ] }
                        />
                    </div> }
                </ModalComponent>
            }
        </Fragment>
    );
};

AddPeopleToListComponent.propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    showModal: PropTypes.bool,
    handleReadCsvFile: PropTypes.func.isRequired,
    campaignId: PropTypes.string.isRequired,
    csvColumns: PropTypes.arrayOf(PropTypes.object),
    file: PropTypes.object,
    readingCsvFieldsError: PropTypes.string,
    isLoading: PropTypes.bool,
    csvWarnings: PropTypes.object,
};

export default AddPeopleToListComponent;
