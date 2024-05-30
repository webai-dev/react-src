import React, { Component }    from 'react';
import PropTypes               from 'prop-types';
import { Form, Label }         from '../../../components/Form';
import { Button }              from '../../../components/Button';
import { Row, Col }            from 'reactstrap';
import DateInputComponent      from '../../../components/Form/DateInputComponent';
import TimeInputComponent      from '../../../components/Form/TimeInputComponent';
import getDateObjectFromString from '../../../../util/getDateObjectFromString';

class RescheduleInterviewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            interview: {
                preferredDate: getDateObjectFromString(props.interview.date),
                interviewDuration: this.props.interview.interviewDuration,
                timezone: this.props.interview.timezone
            },
            isSubmitting: false
        };
    }

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
        this.setState({
            interview: {
                ...this.state.interview,
                preferredDate: newDate,
            },
            calendarError
        });

    };

    render() {
        const { interview } = this.state;
        const { onSelectSlot } = this;
        const { onRescheduleSubmitted } = this.props;
        return (
            <Form
                onSubmit={ (event) => {
                    event.preventDefault();
                    this.setState({ isSubmitting: true });
                    onRescheduleSubmitted({ id: this.props.interview.id }, this.state.interview);
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
                </Row>
                <Row className="mb-4">
                    <Col align="center">
                        <Button
                            type="submit"
                            disabled={ this.state.isSubmitting }
                        >
                            Reschedule
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

RescheduleInterviewForm.propTypes = {
    interview: PropTypes.object.isRequired
};

export default RescheduleInterviewForm;
