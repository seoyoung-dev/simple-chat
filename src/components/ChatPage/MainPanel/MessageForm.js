import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { database } from '../../../firebase';
import { child, ref, set, push } from 'firebase/database';
import { useSelector } from 'react-redux';

function MessageForm() {
    const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
    const user = useSelector((state) => state.user.currentUser);

    const [content, setContent] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const messageRef = ref(database, 'messages');

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: new Date().getTime(),
            user: { id: user.uid, name: user.displayName, image: user.photoURL }
        };
        if (fileUrl) {
            message['image'] = fileUrl;
        } else {
            message['content'] = content;
        }
        return message;
    };

    const handleSubmit = async (e) => {
        if (!content) {
            setErrors((prev) => prev.concat('내용을 입력해주세요'));
            return;
        }
        setLoading(true);
        try {
            set(push(child(messageRef, chatRoom.id)), createMessage());
            setContent('');
            setLoading(false);
        } catch (error) {
            setErrors((prev) => prev.concat(error.message));
            setLoading(false);
            setTimeout(() => {
                setErrors([]);
            }, 5000);
        }
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                >
                    <Form.Control
                        value={content}
                        onChange={handleChange}
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>
            </Form>
            <ProgressBar variant="warning" now={60} />
            <div>
                {errors.map((errorMsg, i) => {
                    return (
                        <p style={{ color: 'red' }} key={i}>
                            {errorMsg}
                        </p>
                    );
                })}
            </div>
            <Row>
                <Col>
                    <button
                        className="message-form-button"
                        onClick={handleSubmit}
                    >
                        전송
                    </button>
                </Col>
                <Col>
                    <button
                        className="message-form-button"
                        onSubmit={handleSubmit}
                    >
                        업로드
                    </button>
                </Col>
            </Row>
        </div>
    );
}

export default MessageForm;
