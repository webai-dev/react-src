import React, { Component }                          from 'react';
import { Media, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Modal }                                     from '../Modal';
import { Button }                                    from '../Button';
import ProfileSnippet                                from '../User/ProfileSnippet';
import { environment }                               from '../../../api';
import AddMessageToThreadMutation                    from '../../../mutations/AddMessageToThreadMutation';
import getFullDateFromDateString                     from '../../../util/getFullDateFromDateString';
import { QueryRenderer, graphql }                    from 'react-relay';
import MarkdownComponent                             from '../MarkdownComponent';
import classNames                                    from 'classnames';
import './Thread.scss';

export class Message extends Component {
    render() {
        const { message, activeUser } = this.props;
        const { content, postedBy, created } = message || {};
        const userPostedBy = postedBy || { firstName: 'No information', id: null };
        const currentUserPosted = userPostedBy.id === activeUser;
        const userAvatar = (
            <Media
                className="thread-message--profile-snippet"
            >
                <ProfileSnippet
                    withName={ false }
                    type={ userPostedBy && userPostedBy.agency ? 'recruiter' : 'user' }
                    profile={ userPostedBy }
                />
            </Media>
        );
        return (
            <Media
                className={ classNames('thread-message', {
                    'thread-message__my-message': currentUserPosted,
                    'thread-message__other-message': currentUserPosted
                }) }
                tag="li"
            >
                { userAvatar }
                <Media
                    body
                    className="thread-message--content"
                >
                    <Media
                        heading
                        className="thread-message--posted-by"
                    >
                        { currentUserPosted && 'Me' }
                        { !currentUserPosted && `${ userPostedBy.firstName } ${ userPostedBy.lastName }` }
                    </Media>
                    <Media body>
                        <MarkdownComponent source={ content } />
                    </Media>
                    <div>
                        { getFullDateFromDateString(created) }
                    </div>
                </Media>
            </Media>
        );
    }
}

export class ThreadMessages extends Component {
    state = {
        content: ''
    };
    static defaultProps = {
        onMessagePosted: () => {}
    };
    saveMessage = e => {
        AddMessageToThreadMutation.commit(environment, this.props.threadId, this.state)
            .then(() => {
                this.setState({ content: '' });
                this.props.onMessagePosted();
            });
    };

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.el.scrollTo({ behavior: 'smooth', top: this.el.scrollHeight });
    }

    render() {
        const { thread, activeUser, disabled } = this.props;
        const { messages } = thread;
        return (
            <div className="message-thread">
                <ul
                    ref={ el => {
                        this.el = el;
                    } }
                    className="media-list message-thread--list"
                >
                    { messages.map(it => (
                        <Message
                            activeUser={ activeUser }
                            key={ it.id }
                            message={ it }
                        />
                    )) }
                </ul>
                <div className="message-thread--new">
                    <textarea
                        placeholder="Write a message"
                        value={ this.state.content }
                        onChange={ e => this.setState({ content: e.target.value }) }
                    />
                    <Button
                        color="pink"
                        type="submit"
                        onClick={ disabled ? () => {} : this.saveMessage }
                        disabled={ disabled }
                    >
                        Send
                    </Button>
                </div>
            </div>
        );
    }
}

export const Thread = (props) => {
    const { threadId, title = undefined, toggle, ...otherProps } = props;
    return (
        <QueryRenderer
            query={ graphql`
            query ThreadQuery($threadId: ID!) {
                viewer {
                    user {
                        ... on Recruiter {
                            id
                        }
                        ... on User {
                            id
                        }
                    }
                    thread(id: $threadId) {
                        id
                        participants {
                            ... on User {
                                id
                                firstName
                                lastName
                                company {
                                    name
                                }
                                profilePhoto {
                                    url
                                }
                            }
                            ... on Recruiter {
                                id
                                firstName
                                lastName
                                aboutMe
                                placementHistory
                                profilePhoto {
                                    url
                                }
                                agency {
                                    name
                                    agencyRelationship {
                                        id
                                        isPsa
                                        psaDocument {
                                            id
                                            name
                                            url
                                        }
                                    }
                                }
                                recruiterRelationship {
                                    isFavourite
                                }
                            }
                        }
                        subject {
                            ... on RecruiterApplication {
                                id
                                status
                                job {
                                    deleted
                                }
                            }
                            ... on JobApplication {
                                id
                                status
                                job {
                                    deleted
                                }
                            }
                        }
                        messages {
                            id
                            content
                            created
                            postedBy {
                                ... on Recruiter {
                                    id
                                    firstName
                                    lastName
                                    profilePhoto {
                                        url
                                    }
                                    agency {
                                        id
                                        agencyRelationship {
                                            id
                                            isPsa
                                            psaDocument {
                                                id
                                                name
                                                url
                                            }
                                        }
                                    }
                                    recruiterRelationship {
                                        id
                                        isFavourite
                                    }
                                }
                                ... on User {
                                    id
                                    firstName
                                    profilePhoto {
                                        url
                                    }
                                    lastName
                                }
                            }
                        }
                    }
                }
            }
        ` }
            variables={ { threadId: threadId } }
            environment={ environment }
            render={ ({ props, error, retry }) => {
                if (error) {
                    return <div>Error loding thread</div>;
                }

                if (props) {
                    const { thread, user } = props.viewer;
                    const disabled = !(thread && thread.subject && thread.subject.job && !thread.subject.job.deleted);
                    return (
                        <Row>
                            <Col
                                xs={ 12 }
                                md={ 8 }
                            >
                                <h4>Messages</h4>
                                { disabled && <strong>Job doesn't exist anymore</strong> }
                                <ThreadMessages
                                    disabled={ disabled }
                                    { ...otherProps }
                                    threadId={ threadId }
                                    activeUser={ user.id }
                                    thread={ thread }
                                    onMessagePosted={ () => {
                                        if (!thread.messages || thread.messages.length === 0) {
                                            retry();
                                        }
                                    } }
                                />
                            </Col>
                            <Col
                                xs={ false }
                                md={ 4 }
                            >
                                <h4>Participants</h4>
                                <ListGroup>
                                    { (thread ? thread.participants : []).map(it => (
                                        <ListGroupItem key={ it.id }>
                                            <ProfileSnippet
                                                profile={ it }
                                                withFullName={
                                                    it.agency
                                                        ? true
                                                        : !(
                                                            [ 'pending', 'submitted' ].indexOf(
                                                                thread.subject.status
                                                            ) >= 0
                                                        )
                                                }
                                                type={ it.agency ? 'recruiter' : 'user' }
                                            />
                                        </ListGroupItem>
                                    )) }
                                </ListGroup>
                            </Col>
                        </Row>
                    );
                }

                return <div>Loading thread...</div>;
            } }
        />
    );
};

export default (props) => {
    const { toggle = () => {}, title = '', onCloseRequested, ...otherProps } = props;
    return (
        <Modal
            isOpen={ true }
            title={ title || 'Message' }
            toggle={ onCloseRequested || toggle }
        >
            <Thread { ...otherProps } />
        </Modal>
    );
};
