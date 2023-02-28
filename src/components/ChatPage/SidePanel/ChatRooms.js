import React, { Component, useState } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { database } from '../../../firebase';
import { ref, push, set, update, child } from 'firebase/database';

class ChatRooms extends Component {
    state = {
        show: false,
        name: '',
        description: '',
        chatRoomsRef: ref(database, 'chatRooms')
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
        user: state.user.currentUser
    };
};

export default connect(mapStateToProps)(ChatRooms);
