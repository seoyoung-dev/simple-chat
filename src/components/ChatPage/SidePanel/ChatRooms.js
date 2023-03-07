import React, { Component, useState } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { connect } from 'react-redux';
import { database } from '../../../firebase';
import {
    ref,
    push,
    update,
    child,
    onChildAdded,
    off,
    onValue
} from 'firebase/database';
import {
    setCurrentChatRoom,
    setPrivateChatRoom
} from '../../../redux/actions/chatRoom_action';

class ChatRooms extends Component {
    state = {
        show: false,
        name: '',
        description: '',
        messagesRef: ref(database, 'messages'),
        chatRoomsRef: ref(database, 'chatRooms'),
        chatRooms: [],
        firstLoad: true,
        activeChatRoomId: '',
        notifications: []
    };

    componentDidMount() {
        this.addChatRoomsListeners();
    }

    componentWillUnmount() {
        off(this.state.chatRoomsRef);
        this.state.chatRooms.forEach((chatRoom) => {
            off(chatRoom);
        });
    }

    setFirstChatRoom = () => {
        const firstChatRoom = this.state.chatRooms[0];
        if (this.state.firstLoad && this.state.chatRooms.length > 0) {
            this.props.dispatch(setCurrentChatRoom(firstChatRoom));
            this.setState({ activeChatRoomId: firstChatRoom.id });
        }
        this.setState({ firstLoad: false });
    };

    addChatRoomsListeners = () => {
        let chatRoomsArray = [];
        onChildAdded(this.state.chatRoomsRef, (data) => {
            chatRoomsArray.push(data.val());
            this.setState({ chatRooms: chatRoomsArray }, () => {
                this.setFirstChatRoom();
            });
            // addNotificationListener 함수가 모든 방에 대해서 실행됨
            this.addNotificationListener(data.key);
        });
    };

    addNotificationListener = (chatRoomId) => {
        onValue(child(this.state.messagesRef, chatRoomId), (snapshot) => {
            if (this.props.chatRoom) {
                this.handleNotification(
                    chatRoomId,
                    this.props.chatRoom.id,
                    this.state.notifications,
                    snapshot
                );
            }
        });
    };

    handleNotification = (
        chatRoomId,
        currentChatRoomId,
        notifications,
        snapshot
    ) => {
        // 목표는 방 하나하나에 맞는 알림 정보를 notification state에 넣어주기
        // numChildrend은 firebase에서 제공하는 메서드. 자식이 몇개인지 확인할 수 있음.
        let index = notifications.findIndex(
            (notification) => notification.id === chatRoomId
        );
        if (index === -1) {
            notifications.push({
                id: chatRoomId,
                total: snapshot.size,
                lastKnownTotal: snapshot.size,
                count: 0
            });
        } else {
            if (chatRoomId !== currentChatRoomId) {
                const lastTotal = notifications[index].lastKnownTotal;
                if (snapshot.size - lastTotal > 0) {
                    notifications[index].count = snapshot.size - lastTotal;
                }
            }
            notifications[index].total = snapshot.size;
        }
        this.setState({ notifications });
    };

    handleClose = () => this.setState({ show: false });

    handleShow = () => this.setState({ show: true });

    isFormValid = (name, description) => name && description;

    handleSubmit = (e) => {
        e.preventDefault();
        const { name, description } = this.state;

        if (this.isFormValid(name, description)) {
            this.addChatRoom();
        } else {
            alert('내용을 입력하세요.');
        }
    };

    addChatRoom = async () => {
        const key = push(this.state.chatRoomsRef).key;
        const { name, description } = this.state;
        const { user } = this.props;
        const newChatRoom = {
            id: key,
            name: name,
            description: description,
            createdBy: {
                name: user.displayName,
                image: user.photoURL
            }
        };

        try {
            await update(child(this.state.chatRoomsRef, key), newChatRoom);
            this.setState({
                name: '',
                description: '',
                show: false
            });
        } catch (error) {
            alert(error);
        }
    };

    clearNotifications = () => {
        // nofitication 배열 속 room 넘버랑 맞는 정보 찾기
        let index = this.state.notifications.findIndex(
            (notification) => notification.id === this.props.chatRoom.id
        );

        if (index !== 1) {
            let updatedNotification = [...this.state.notifications];
            updatedNotification[index].lastKnownTotal =
                this.state.notifications[index].total;
            updatedNotification[index].count = 0;
            this.setState({ notifications: updatedNotification });
        }
    };

    changeChatRoom = (room) => {
        this.props.dispatch(setCurrentChatRoom(room));
        this.setState({ activeChatRoomId: room.id });
        this.props.dispatch(setPrivateChatRoom(false));
        this.clearNotifications();
    };

    getNotificationCount = (room) => {
        let count = 0;
        this.state.notifications.forEach((notification) => {
            if (notification.id === room.id) {
                count = notification.count;
            }
        });

        if (count > 0) return count;
    };

    render() {
        return (
            <div>
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <FaRegSmileWink style={{ marginRight: '3px' }} />
                    CHAT ROOMS
                    <FaPlus
                        onClick={this.handleShow}
                        style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: 0
                        }}
                    />
                </div>
                <ul
                    style={{
                        listStyleType: 'none',
                        padding: 0,
                        cursor: 'pointer'
                    }}
                >
                    {this.state.chatRooms &&
                        this.state.chatRooms.map((room) => {
                            return (
                                <li
                                    key={room.id}
                                    style={{
                                        backgroundColor:
                                            room.id ===
                                                this.state.activeChatRoomId &&
                                            '#ffffff45'
                                    }}
                                    onClick={() => {
                                        this.changeChatRoom(room);
                                    }}
                                >
                                    # {room.name}{' '}
                                    <Badge
                                        style={{ float: 'right' }}
                                        bg="danger"
                                    >
                                        {this.getNotificationCount(room)}
                                    </Badge>
                                </li>
                            );
                        })}
                </ul>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>채팅방 생성</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicEmail"
                            >
                                <Form.Label>방 이름</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter a chat room name"
                                    onChange={(e) =>
                                        this.setState({ name: e.target.value })
                                    }
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                            >
                                <Form.Label>방 설명</Form.Label>
                                <Form.Control
                                    type="description"
                                    placeholder="Enter a chat room description"
                                    onChange={(e) =>
                                        this.setState({
                                            description: e.target.value
                                        })
                                    }
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            닫기
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            방 생성
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    };
};

export default connect(mapStateToProps)(ChatRooms);
