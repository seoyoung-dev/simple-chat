import React, { Component } from 'react';
import Message from './Message';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import { database } from '../../../firebase';
import { onChildAdded, ref, child, onChildRemoved } from 'firebase/database';
import { connect, dispatch } from 'react-redux';
import { setUserPosts } from '../../../redux/actions/chatRoom_action';

class MainPanel extends React.Component {
    state = {
        messages: [],
        messagesRef: ref(database, 'messages'),
        messagesLoading: true,
        searchTerm: '',
        searchResult: [],
        searchLoading: false,
        typingRef: ref(database, 'typing'),
        typingUsers: []
    };

    // 리스너 등록
    componentDidMount() {
        const { chatRoom } = this.props;
        if (chatRoom) {
            this.addMessagesListeners(chatRoom.id);
            this.addTypingListeners(chatRoom.id);
        }
    }

    addTypingListeners = (chatRoomId) => {
        let typingUsers = [];
        onChildAdded(child(this.state.typingRef, chatRoomId), (data) => {
            if (data.key !== this.props.user.uid) {
                typingUsers = typingUsers.concat({
                    id: data.key,
                    name: data.val()
                });
            }
            this.setState({ typingUsers });
            console.log('hey', typingUsers);
            console.log(this.state.typingUsers);
        });

        onChildRemoved(child(this.state.typingRef, chatRoomId), (data) => {
            // 지워진 child의 정보가 데이터로 들어옴
            const index = typingUsers.findIndex((user) => user.id === data.key);
            if (index !== -1) {
                typingUsers = typingUsers.filter(
                    (user) => user.id !== data.key
                );
            }
            this.setState({ typingUsers });
        });
    };

    handleSearchMessages = () => {
        const chatRoomMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResult = chatRoomMessages.reduce((acc, message) => {
            if (
                (message.content && message.content.match(regex)) ||
                message.user.name.match(regex)
            ) {
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({ searchResult });
    };

    handleSearchChange = (e) => {
        this.setState(
            { searchTerm: e.target.value, searchLoading: true },
            () => {
                this.handleSearchMessages();
            }
        );
    };

    addMessagesListeners = (chatRoomId) => {
        const messagesArray = [];
        onChildAdded(child(this.state.messagesRef, chatRoomId), (data) => {
            messagesArray.push(data.val());
            this.setState({ messages: messagesArray, messagesLoading: false });
            this.userPostsCount(messagesArray);
        });
    };

    userPostsCount = (messages) => {
        const userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    count: 1,
                    image: message.user.image
                };
            }
            return acc;
        }, {});
        this.props.dispatch(setUserPosts(userPosts));
    };

    renderMessages = (messages) =>
        messages.length > 0 &&
        messages.map((message) => {
            return (
                <Message
                    key={message.timestamp}
                    message={message}
                    user={this.props.user}
                />
            );
        });

    renderTypingUsers = (typingUsers) =>
        typingUsers.length &&
        typingUsers.map((user) => (
            <span>{user.name}님이 채팅을 입력하고 있습니다.</span>
        ));

    render() {
        const { messages, searchTerm, searchResult, typingUsers } = this.state;
        return (
            <div style={{ padding: '2rem 2rem 0 2rem' }}>
                <MessageHeader handleSearchChange={this.handleSearchChange} />

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
                    {searchTerm
                        ? this.renderMessages(searchResult)
                        : this.renderMessages(messages)}
                    {this.renderTypingUsers(typingUsers)}
                </div>

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
