import { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { database, storage } from '../../../firebase';
import { child, ref, set, push, remove } from 'firebase/database';
import {
    ref as strRef,
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage';
import { useSelector } from 'react-redux';

function MessageForm() {
    const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
    const user = useSelector((state) => state.user.currentUser);
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const messageRef = ref(database, 'messages');
    const inputOpenImageRef = useRef();
    const isPrivateChatRoom = useSelector(
        (state) => state.chatRoom.isPrivateChatRoom
    );
    const typingRef = ref(database, 'typing');

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
            await remove(child(typingRef, `${chatRoom.id}/${user.uid}`));
        } catch (error) {
            setErrors((prev) => prev.concat(error.message));
            setLoading(false);
            setTimeout(() => {
                setErrors([]);
            }, 5000);
        }
    };

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    };

    const getPath = () => {
        if (isPrivateChatRoom) {
            return `message/private/${chatRoom.id}`;
        } else {
            return `message/public/${chatRoom.id}`;
        }
    };

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        const filePath = `${getPath()}/${file.name}`;
        const metadata = { contentType: file.type };
        const storageRef = strRef(storage, filePath);
        setLoading(true);
        try {
            // 파일을 먼저 스토리지에 저장
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const percentage =
                        Math.round(
                            snapshot.bytesTransferred / snapshot.totalBytes
                        ) * 100;
                    setPercentage(percentage);
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthoirized':
                            break;
                        case 'storage/canceled':
                            break;
                        case 'storage/unknown':
                            break;
                    }
                    setLoading(false);
                },
                // Handle successful uploads on complete
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            set(
                                push(child(messageRef, chatRoom.id)),
                                createMessage(downloadURL)
                            );
                            setLoading(false);
                        }
                    );
                }
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.keyCode === 13) {
            handleSubmit();
        }
        if (content) {
            set(child(typingRef, chatRoom.id), {
                [user.uid]: user.displayName
            });
        } else {
            remove(child(typingRef, `${chatRoom.id}/${user.uid}`));
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
                        onKeyDown={handleKeyDown}
                        value={content}
                        onChange={handleChange}
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>
            </Form>

            <ProgressBar
                variant="warning"
                label={`${percentage}%`}
                now={percentage}
            />
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
                        disabled={loading ? true : false}
                    >
                        전송
                    </button>
                </Col>
                <Col>
                    <button
                        className="message-form-button"
                        onSubmit={handleSubmit}
                        onClick={handleOpenImageRef}
                        disabled={loading ? true : false}
                    >
                        업로드
                    </button>
                </Col>
            </Row>
            <input
                accept="image/jpeg, image/png"
                type="file"
                ref={inputOpenImageRef}
                style={{ display: 'none' }}
                onChange={handleUploadImage}
            />
        </div>
    );
}

export default MessageForm;
