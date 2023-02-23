import React, { Component, useState } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default class ChatRooms extends Component {
    state = {
        show: false
    };

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

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
                        <Form>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicEmail"
                            >
                                <Form.Label>방 이름</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter a chat room name"
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
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
