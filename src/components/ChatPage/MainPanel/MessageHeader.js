import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';
import { database } from '../../../firebase';
import { child, ref, remove, update, onValue } from '@firebase/database';

function MessageHeader({ handleSearchChange }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
    const user = useSelector((state) => state.user.currentUser);
    const userPosts = useSelector((state) => state.chatRoom.userPosts);
    const isPrivateChatRoom = useSelector(
        (state) => state.chatRoom.isPrivateChatRoom
    );
    const usersRef = ref(database, 'users');

    useEffect(() => {
        if (chatRoom && user) {
            addFavoriteListener(chatRoom.id, user.uid);
        }
    }, []);

    const addFavoriteListener = (chatRoomId, userId) => {
        onValue(
            child(usersRef, `${userId}/favorited`),
            (snapshot) => {
                const chatRoomIds = snapshot.val();
                const isAlreadyFavorited =
                    Object.keys(chatRoomIds).includes(chatRoomId);
                setIsFavorited(isAlreadyFavorited);
            },
            { onlyOnce: true }
        );
    };

    const handleFavorite = () => {
        // 즐겨찾기 취소
        if (isFavorited) {
            remove(child(usersRef, `${user.uid}/favorited/${chatRoom.id}`));
            setIsFavorited((prev) => !prev);
        } else {
            update(child(usersRef, `${user.uid}/favorited`), {
                [chatRoom.id]: {
                    name: chatRoom.name,
                    description: chatRoom.description,
                    createdBy: {
                        name: chatRoom.createdBy.name,
                        image: chatRoom.createdBy.image
                    }
                }
            });
            setIsFavorited((prev) => !prev);
        }
    };

    const renderUserPosts = (userPosts) => {
        return Object.entries(userPosts)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([key, val], i) => (
                <div key={i} style={{ display: 'flex', marginTop: '20px' }}>
                    <img
                        src={val.image}
                        alt={key}
                        style={{
                            borderRadius: '10px',
                            width: '48px',
                            height: '48px',
                            marginRight: '10px'
                        }}
                    />
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <h5>{key}</h5>
                        <p>{val.count} 개</p>
                    </div>
                </div>
            ));
    };

    return (
        <div
            style={{
                width: '100%',
                height: '170px',
                border: '.2rem solid #ececec',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '1rem'
            }}
        >
            <Container>
                <Row>
                    <Col>
                        <h2>
                            {isPrivateChatRoom ? <FaLock /> : <FaLockOpen />}{' '}
                            {chatRoom && chatRoom.name}
                            {!isPrivateChatRoom && (
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleFavorite}
                                >
                                    {isFavorited ? (
                                        <MdFavorite
                                            style={{ alignItems: 'center' }}
                                        />
                                    ) : (
                                        <MdFavoriteBorder
                                            style={{ alignItems: 'center' }}
                                        />
                                    )}
                                </span>
                            )}
                        </h2>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">
                                <AiOutlineSearch />
                            </InputGroup.Text>
                            <Form.Control
                                onChange={handleSearchChange}
                                placeholder="Search Messages"
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                </Row>
                {!isPrivateChatRoom && (
                    <Row>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginBottom: '10px'
                            }}
                        >
                            <div style={{ display: 'flex' }}>
                                <img
                                    className="mr-3"
                                    src={chatRoom && chatRoom.createdBy.image}
                                    alt={chatRoom && chatRoom.createdBy.name}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        marginRight: '10px',
                                        border: 'none',
                                        borderRadius: '50%'
                                    }}
                                />
                                {chatRoom && <h5>{chatRoom.createdBy.name}</h5>}
                            </div>
                        </div>
                    </Row>
                )}

                <Row>
                    <Col>
                        <Card>
                            <Accordion>
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            Description
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {chatRoom && chatRoom.description}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Accordion>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Accordion>
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            Posts Count
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {userPosts &&
                                                renderUserPosts(userPosts)}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Accordion>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default MessageHeader;
