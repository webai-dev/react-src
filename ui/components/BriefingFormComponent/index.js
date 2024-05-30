import React, { Component }       from 'react';
import PropTypes                  from 'prop-types';
import { Form, Input, Label }     from '../Form';
import { Button }                 from '../Button';
import { Row, Col, FormFeedback } from 'reactstrap';
import DateInputComponent         from '../Form/DateInputComponent';
import CheckBoxComponent          from '../CheckBoxComponent';
import TimeInputComponent         from '../Form/TimeInputComponent';
import styles                     from './styles.scss';

const whoWillCallMap = {
    recruiter: [ 'Recruiter', 'Hiring Manager' ],
    'hiring-manager': [ 'Hiring Manager', 'Recruiter' ]
};
const WhoWillCall = (props) => {
    const { type, onChangeField, onFocus, briefing, enabledType } = props;
    return (
        <Col
            className={ `who-will-call ${ type === briefing.whoWillCall
                ? 'who-will-call__active'
                : '' }` }
        >
            <div className={ styles.callBox }>
                <Label
                    className={ styles.callLabel }
                    htmlFor={ `${ type }-will-call` }
                    style={ type === 'hiring-manager' ? { marginBottom: 6 } : {} }
                >
                    { whoWillCallMap[ type ][ 0 ] } to call { whoWillCallMap[ type ][ 1 ] }?
                </Label>

                <CheckBoxComponent
                    name={ `${ type }-will-call` }
                    className={ styles.checkBox }
                    value={ type === briefing.whoWillCall }
                    checked={ briefing.whoWillCall === type }
                    onChange={ () => {onChangeField({ target: { name: 'whoWillCall', value: type } });} }
                />
                { type !== 'hiring-manager' && (
                    <Input
                        type="number"
                        name={
                            type === 'hiring-manager'
                                ? 'recruiterNumberToCall'
                                : 'managerNumberToCall'
                        }
                        onChange={ onChangeField }
                        onClick={ () => onFocus(type) }
                        readOnly={ type === enabledType }
                        value={
                            type === 'hiring-manager'
                                ? briefing.recruiterNumberToCall
                                : briefing.managerNumberToCall
                        }
                        className={ styles.input }
                    />
                ) }
                { type === 'hiring-manager' && (
                    <h3 style={ { color: 'black', paddingTop: 6 } }>
                        { type === 'hiring-manager'
                            ? briefing.recruiterNumberToCall
                            : briefing.managerNumberToCall }
                    </h3>
                ) }
            </div>
        </Col>
    );
};

WhoWillCall.propTypes = {
    type: PropTypes.string.isRequired,
    onChangeField: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    briefing: PropTypes.object.isRequired,
    enabledType: PropTypes.string
};

const expandExisting = (briefing, contactNumber, recruiter) => ({
    ...briefing,
    managerNumberToCall: contactNumber || '',
    recruiterNumberToCall: recruiter.contactNumber || recruiter.agency.contactNumber || '',
    [ briefing.whoWillCall === 'hiring-manager'
        ? 'recruiterNumberToCall'
        : 'managerNumberToCall' ]: briefing.numberToCall,
    dateTime: briefing.dateTime,
    endDate: briefing.endDate
});

class BriefingForm extends Component {
    constructor(props) {
        super(props);
        const startDate = new Date();
        startDate.setMinutes(0);
        startDate.setHours(12);
        const endDate = new Date();
        endDate.setMinutes(0);
        endDate.setHours(13);
        this.state = {
            briefing: {
                ...{
                    dateTime: startDate,
                    endDate: endDate,
                    notes: '',
                    whoWillCall: 'recruiter',
                    managerNumberToCall: this.props.contactNumber || '',
                    recruiterNumberToCall:
                        this.props.recruiter.contactNumber ||
                        this.props.recruiter.agency.contactNumber ||
                        ''
                },
                ...(this.props.briefing
                    ? expandExisting(this.props.briefing, this.props.contactNumber, this.props.recruiter)
                    : {})
            },
            calOpen: false
        };
    }

    onChangeField = e => {
        const { name, value } = e.target;
        this.setState(state => {
            return { briefing: { ...state.briefing, [ name ]: value } };
        });
    };

    onSelectSlot = (date) => {
        let newDate = this.state.briefing.dateTime;
        let newHours = newDate.getHours();
        let newMinutes = newDate.getMinutes();
        let calendarError = null;
        if (typeof date === 'string') {
            const [ hours, minutes ] = date.split(':');
            newHours = hours;
            newMinutes = minutes;
        } else {
            newDate = date;
        }
        newDate.setHours(+newHours);
        newDate.setMinutes(+newMinutes);
        const endDate = new Date(newDate);
        endDate.setHours(+newHours + 1);

        this.setState({
            briefing: {
                ...this.state.briefing,
                dateTime: newDate,
                endDate: endDate
            },
            calendarError
        });
    };

    onFocus = type => {
        this.setState(({ briefing }) => {
            return {
                briefing: { ...briefing, whoWillCall: type }
            };
        });
    };

    render() {
        const {
            application,
            onBriefingRequested = () => {},
            isEdit,
            onCancel,
            enabledType = 'hiring-manager'
        } = this.props;
        const { onSelectSlot } = this;
        return (
            <Form
                className="briefing-form"
                onSubmit={ e => {
                    const briefing = this.state.briefing;
                    e.preventDefault();
                    e.stopPropagation();
                    onBriefingRequested(
                        { id: application.id },
                        {
                            id: briefing.id || undefined,
                            notes: briefing.notes || '',
                            dateTime: briefing.dateTime,
                            endDate: briefing.endDate,
                            whoWillCall: briefing.whoWillCall,
                            numberToCall:
                                (briefing.whoWillCall === 'recruiter'
                                    ? briefing.managerNumberToCall
                                    : briefing.recruiterNumberToCall) || briefing.numberToCall
                        }
                    );
                } }
            >
                <Row>
                    <Col>
                        <p>Select the time slot for the interview</p>
                    </Col>
                </Row>
                <Row className="mb-4 calendar-input-selector">
                    <Col
                        xs={ 6 }
                    >
                        <Label>Preferred Date</Label>
                        <DateInputComponent
                            name="date"
                            value={ this.state.briefing.dateTime }
                            setValue={ onSelectSlot }
                        />
                    </Col>
                    <Col
                        xs={ 6 }
                    >
                        <Label>Preferred Date</Label>
                        <TimeInputComponent
                            value={ this.state.briefing.dateTime }
                            name="time"
                            setValue={ onSelectSlot }
                        />
                    </Col>
                    <Col
                        xs={ 12 }
                    >
                        { this.state.calendarError && (
                            <FormFeedback style={ { display: 'block' } }>
                                { this.state.calendarError }
                            </FormFeedback>
                        ) }
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <Label>Additional Availability &amp; notes</Label>
                        <Input
                            type="textarea"
                            onChange={ this.onChangeField }
                            name="notes"
                            value={ this.state.briefing.notes }
                        />
                    </Col>
                </Row>
                <Row className="mb-4">
                    <WhoWillCall
                        enabledType={ enabledType }
                        type="hiring-manager"
                        onFocus={ this.onFocus }
                        onChangeField={ this.onChangeField }
                        briefing={ this.state.briefing }
                    />
                    <WhoWillCall
                        enabledType={ enabledType }
                        type="recruiter"
                        onFocus={ this.onFocus }
                        onChangeField={ this.onChangeField }
                        briefing={ this.state.briefing }
                    />
                </Row>
                <Row className="mb-4">
                    { isEdit && (
                        <Col align="center">
                            <Button
                                onClick={ onCancel }
                                color="danger"
                            >
                                Cancel
                            </Button>
                        </Col>
                    ) }
                    <Col align="center">
                        <Button type="submit">Book briefing</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

BriefingForm.propTypes = {
    contactNumber: PropTypes.string,
    recruiter: PropTypes.object.isRequired,
    briefing: PropTypes.object,
    application: PropTypes.object.isRequired,
    onBriefingRequested: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    onCancel: PropTypes.func,
    enabledType: PropTypes.string.isRequired
};

export default BriefingForm;
