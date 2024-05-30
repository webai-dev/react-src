import React, { PureComponent }     from 'react';
import PropTypes                    from 'prop-types';
import ButtonComponent,
{
    BUTTON_SIZE,
    BUTTON_TYPE
}                                   from '../../../components/ButtonComponent';
import FormsyComponent              from '../../../components/formsy/FormsyComponent';
import FormsyReachTextAreaComponent from '../../../components/formsy/FormsyReachTextAreaComponent';
import FormsySubmitComponent        from '../../../components/formsy/FormsySubmitComponent';
import classNames                   from 'classnames';
import styles                       from './styles.scss';

class EmailSettingsComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            resetCandidateForm: null,
            resetEmployerForm: null,
            employerMessage: props.employerTemplate || props.defaultEmployerTemplate,
            candidateMessage: props.candidateTemplate || props.defaultCandidateTemplate,
        };
    }

    /**
     * will reset candidate text area to default value
     *
     * @param {string} [resetCandidateForm]
     */
    handleResetCandidateForm = (resetCandidateForm) => {
        this.setState({ resetCandidateForm });
    };

    /**
     * will reset candidate text area to default value
     *
     * @param {string} [resetEmployerForm]
     */
    handleResetEmployerForm = (resetEmployerForm) => {
        this.setState({ resetEmployerForm });
    };

    handleFormChange = (isEmployer, form) => {
        if (isEmployer) {
            this.handleResetEmployerForm(null);
            this.setState({
                employerMessage: form.sourceEmployer
            });
        } else {
            this.handleResetCandidateForm(null);
            this.setState({
                candidateMessage: form.sourceCandidate
            });
        }
    };

    render() {
        const { handleResetCandidateForm, handleResetEmployerForm, handleFormChange } = this;
        const { resetCandidateForm, resetEmployerForm, employerMessage, candidateMessage } = this.state;
        const {
            isLoadingCandidate,
            errorsCandidate,
            isLoadingEmployer,
            errorsEmployer,
            handleSaveEmail,
            candidateTemplate,
            employerTemplate,
            defaultEmployerTemplate,
            defaultCandidateTemplate,
            handleTestEmail,
            email,
        } = this.props;
        const formEmployerId = 'updateEmployerTemplate';
        const formCandidateId = 'updateCandidateTemplate';

        return (
            <div className={ styles.box }>
                <div className={ classNames(styles.vars, styles.marginBottom) }>
                    <b>Available dynamic tags</b>:{ ' ' }{ [
                    'Recipient name',
                    'Recruiter name',
                    'Review invite link',
                    'Agency name',
                    'Employer\'s company name'
                ].map(item => `[[${ item }]]`)
                    .join(', ') }
                </div>
                <FormsyComponent
                    className={ styles.column }
                    formId={ formCandidateId }
                    onValidSubmit={ ({ sourceCandidate }) => {
                        handleSaveEmail({
                            source: sourceCandidate,
                            name: 'placement-request-candidate-review',
                            reset: sourceCandidate.replace(/[^A-Za-z0-9]/g, '') === defaultCandidateTemplate.replace(/[^A-Za-z0-9]/g, '')
                        });
                    } }
                    onChange={ (form) => {
                        handleFormChange(false, form);
                    } }
                    errorMessage={ errorsCandidate }
                >
                    <h2>Candidate Email</h2>
                    <FormsyReachTextAreaComponent
                        forceValue={ resetCandidateForm }
                        value={ candidateTemplate || defaultCandidateTemplate }
                        placeholder="Your statement"
                        className={ styles.marginBottom }
                        name="sourceCandidate"
                        required
                    />
                    <div className={ classNames(styles.itemsBox, styles.submitButtons) }>
                        <ButtonComponent
                            className={ styles.button }
                            btnType={ BUTTON_TYPE.BORDER }
                            size={ BUTTON_SIZE.BIG }
                            onClick={ () => {handleResetCandidateForm(defaultCandidateTemplate);} }
                        >
                            Reset
                        </ButtonComponent>
                        <ButtonComponent
                            main
                            className={ styles.button }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                            onClick={ () => {
                                handleTestEmail({
                                    source: candidateMessage,
                                    name: 'placement-request-candidate-review'
                                },email);
                            } }
                        >
                            Test
                        </ButtonComponent>
                        <FormsySubmitComponent
                            main
                            size={ BUTTON_SIZE.BIG }
                            disabled={ isLoadingCandidate }
                            formId={ formCandidateId }
                        >
                            Save changes
                        </FormsySubmitComponent>
                    </div>
                </FormsyComponent>
                <FormsyComponent
                    className={ styles.column }
                    formId={ formEmployerId }
                    onValidSubmit={ ({ sourceEmployer }) => {
                        handleSaveEmail({
                            source: sourceEmployer,
                            name: 'placement-request-employer-review',
                            reset: sourceEmployer.replace(/[^A-Za-z0-9]/g, '') === defaultEmployerTemplate.replace(/[^A-Za-z0-9]/g, '')
                        });
                    } }
                    onChange={ (form) => {
                        handleFormChange(true, form);
                    } }
                    errorMessage={ errorsEmployer }
                >
                    <h2>Employer Email</h2>
                    <FormsyReachTextAreaComponent
                        forceValue={ resetEmployerForm }
                        value={ employerTemplate || defaultEmployerTemplate }
                        placeholder="Your template"
                        className={ styles.marginBottom }
                        name="sourceEmployer"
                        required
                    />
                    <div className={ classNames(styles.itemsBox, styles.submitButtons) }>
                        <ButtonComponent
                            className={ styles.button }
                            btnType={ BUTTON_TYPE.BORDER }
                            size={ BUTTON_SIZE.BIG }
                            onClick={ () => {handleResetEmployerForm(defaultEmployerTemplate);} }
                        >
                            Reset
                        </ButtonComponent>
                        <ButtonComponent
                            main
                            className={ styles.button }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                            onClick={ () => {
                                handleTestEmail({
                                    source: employerMessage,
                                    name: 'placement-request-employer-review'
                                },email);
                            } }
                        >
                            Test
                        </ButtonComponent>
                        <FormsySubmitComponent
                            main
                            size={ BUTTON_SIZE.BIG }
                            disabled={ isLoadingEmployer }
                            formId={ formEmployerId }
                        >
                            Save changes
                        </FormsySubmitComponent>
                    </div>
                </FormsyComponent>
            </div>
        );
    }
}

EmailSettingsComponent.propTypes = {
    isLoadingCandidate: PropTypes.bool,
    errorsCandidate: PropTypes.string,
    email: PropTypes.string,
    isLoadingEmployer: PropTypes.bool,
    errorsEmployer: PropTypes.string,
    handleSaveEmail: PropTypes.func.isRequired,
    handleTestEmail: PropTypes.func.isRequired,
    candidateTemplate: PropTypes.string,
    employerTemplate: PropTypes.string,
    defaultEmployerTemplate: PropTypes.string,
    defaultCandidateTemplate: PropTypes.string,
};

export default EmailSettingsComponent;
