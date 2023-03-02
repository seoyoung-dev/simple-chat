import React, { Component } from 'react';
import Message from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import { database } from '../../../firebase';
import { onChildAdded, ref, child } from 'firebase/database';
import { connect } from 'react-redux';

class MainPanel extends React.Component {
    state = {
        messages: [],
        messagesRef: ref(database, 'messages'),
        messagesLoading: true
    };
    // 리스너 등록
    componentDidMount() {
        const { chatRoom } = this.props;
        if (chatRoom) {
            this.addMessagesListeners(chatRoom.id);
        }
    }

    addMessagesListeners = (chatRoomId) => {
        const messagesArray = [];
        onChildAdded(child(this.state.messagesRef, chatRoomId), (data) => {
            messagesArray.push(data.val());
            this.setState({ messages: messagesArray, messagesLoading: false });
        });
    };

    renderMessages = (messages) => {
        messages > 0 &&
            messages.map((message) => {
                return <p>{message.user.name}</p>;
            });
    };

    render() {
        const { messages } = this.state;
        return (
            <div style={{ padding: '2rem 2rem 0 2rem' }}>
                <MessageHeader />

                <div
                    style={{
                        width: '100%',
                        height: '450px',
                        border: '.2rem solid #ececec',
                        borderRadius: '4px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        overflowY: 'auto'
                    }}
                >
                    {messages &&
                        messages.map((message) => {
                            return (
                                <Message
                                    key={message.timestamp}
                                    message={message}
                                    user={this.props.user}
                                />
                            );
                        })}
                </div>
                <button
                    onClick={() => {
                        console.log(this.state);
                    }}
                >
                    state
                </button>

                <MessageForm />
            </div>
        );
    }
}

// 클래스 컴포넌트에서 리덕스를 사용하기 위한 코드
const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    };
};

export default connect(mapStateToProps)(MainPanel);
