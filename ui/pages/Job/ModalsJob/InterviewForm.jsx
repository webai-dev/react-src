import React, { Component }                 from 'react';
import { Form, Input, Label, FormFeedback } from '../../../components/Form';
import DateInputComponent                   from '../../../components/Form/DateInputComponent';
import TimeInputComponent                   from '../../../components/Form/TimeInputComponent';
import { Button }                           from '../../../components/Button';
import { Row, Col }                         from 'reactstrap';
import styles                               from './styles.scss';

class InterviewForm extends Component {
    constructor(props) {
        super(props);
        const date = new Date();
        date.setMinutes(0);
        date.setHours(12);
        date.setDate(date.getDate() + 1);
        this.state = {
            interview: {
                preferredDate: date,
                interviewDuration: 3600,
                timezone: 'Australia/Sydney',
                additionalAvailability: '',
                location: '',
                specialInstructions: '',
                attendees: [ { email: '', jobTitle: '', name: '' } ]
            },
            submitting: false,
            calendarError: undefined
        };
    }

    onChangeField = e => {
        const { name, value } = e.target;
        this.setState(state => {
            return { interview: { ...state.interview, [ name ]: value } };
        });
    };
    onSelectSlot = (date) => {
        let newDate = this.state.interview.preferredDate;
        let oldHours = newDate.getHours();
        let oldMinutes = newDate.getMinutes();
        let calendarError = null;
        if (typeof date === 'string') {
            const [ hours, minutes ] = date.split(':');
            newDate.setHours(+hours);
            newDate.setMinutes(+minutes);
        } else {
            newDate = date;
            newDate.setHours(+oldHours);
            newDate.setMinutes(+oldMinutes);
        }
        if (newDate < new Date()) {
            calendarError = 'Your start date must be in the future';
        }

        this.setState({
            interview: {
                ...this.state.interview,
                preferredDate: newDate,
            },
            calendarError
        });

    };

    render() {
        const { onSelectSlot } = this;
        const { onInterviewRequested } = this.props;
        const { submitting, interview } = this.state;
        return (
            <Form
                onSubmit={ e => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.setState({ submitting: true });
                    onInterviewRequested({ id: this.props.applicationId }, this.state.interview);
                } }
            >
                <Row className="mb-4 calendar-input-selector">
                    <Col
                        xs={ 6 }
                    >
                        <Label>Preferred Date</Label>
                        <DateInputComponent
                            name="date"
                            value={ interview.preferredDate }
                            setValue={ onSelectSlot }
                        />
                    </Col>
                    <Col
                        xs={ 6 }
                    >
                        <Label>Preferred Date</Label>
                        <TimeInputComponent
                            value={ interview.preferredDate }
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
                        <Label>Additional Availability</Label>
                        <Input
                            disabled={ submitting }
                            type="textarea"
                            onChange={ this.onChangeField }
                            name="additionalAvailability"
                            value={ this.state.interview.additionalAvailability }
                        />
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <Label>Location*</Label>
                        <Input
                            disabled={ submitting }
                            type="textarea"
                            onChange={ this.onChangeField }
                            name="location"
                            value={ this.state.interview.location }
                        />
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <Label>Who else will attend the interview*</Label>

                        { this.state.interview.attendees.map((it, index) => {
                            const onChange = e => {
                                const { name, value } = e.target;
                                this.setState(({ interview }) => {
                                    const attendees = interview.attendees;
                                    attendees[ index ][ name ] = value;
                                    return {
                                        interview: { ...interview, attendees: attendees }
                                    };
                                });
                            };
                            return (
                                <Row
                                    className="mb-2"
                                    key={ index }
                                >
                                    <Col xs={ 4 }>
                                        <Label>Name*</Label>
                                        <Input
                                            disabled={ submitting }
                                            onChange={ onChange }
                                            name="name"
                                            value={ it.name }
                                        />
                                    </Col>
                                    <Col xs={ 3 }>
                                        <Label>Job Title*</Label>
                                        <Input
                                            disabled={ submitting }
                                            onChange={ onChange }
                                            name="jobTitle"
                                            value={ it.jobTitle }
                                        />
                                    </Col>
                                    <Col xs={ 4 }>
                                        <Label>Email*</Label>
                                        <Input
                                            disabled={ submitting }
                                            onChange={ onChange }
                                            name="email"
                                            value={ it.email }
                                        />
                                    </Col>
                                    <Col
                                        xs={ 1 }
                                        className={ styles.buttonColl }
                                    >
                                        <Label>&nbsp;</Label>

                                        { index === this.state.interview.attendees.length - 1 && (
                                            <Button
                                                color="blue"
                                                style={ { marginTop: 3 } }
                                                onClick={ () => {
                                                    this.setState(({ interview }) => {
                                                        return {
                                                            interview: {
                                                                ...interview,
                                                                attendees: [
                                                                    ...interview.attendees,
                                                                    {}
                                                                ]
                                                            }
                                                        };
                                                    });
                                                } }
                                            >
                                                +
                                            </Button>
                                        ) }
                                        { index < this.state.interview.attendees.length - 1 && (
                                            <Button
                                                color="red"
                                                style={ { marginTop: 3 } }
                                                onClick={ () => {
                                                    this.setState(({ interview }) => {
                                                        let newAttendees = interview.attendees;
                                                        newAttendees.splice(index, 1);
                                                        return {
                                                            interview: {
                                                                ...interview,
                                                                attendees: newAttendees
                                                            }
                                                        };
                                                    });
                                                } }
                                            >
                                                X
                                            </Button>
                                        ) }
                                    </Col>
                                </Row>
                            );
                        }) }
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <Label>Special Instructions</Label>
                        <Input
                            disabled={ submitting }
                            type="textarea"
                            onChange={ this.onChangeField }
                            name="specialInstructions"
                            value={ this.state.interview.specialInstructions }
                        />
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col align="center">
                        <Button
                            disabled={ this.state.calendarError || submitting }
                            type="submit"
                        >
                            Schedule
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default InterviewForm;
