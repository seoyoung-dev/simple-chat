import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { database } from '../../../firebase';
import { child, ref, remove, update } from '@firebase/database';

function MessageHeader({ handleSearchChange }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
    const user = useSelector((state) => state.user.currentUser);
    const isPrivateChatRoom = useSelector(
        (state) => state.chatRoom.isPrivateChatRoom
    );
    const usersRef = ref(database, 'users');

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

    // 수정 필요
    const CustomToggle = ({ children, eventKey }) => {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally custom!')
        );

        return (
            <button
                type="button"
                style={{ backgroundColor: 'pink' }}
                onClick={decoratedOnClick}
            >
                {children}
            </button>
        );
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
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <p>
                        <Image />
                    </p>
                </div>
                <Row>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: '0 1rem' }}>
                                    <CustomToggle eventKey="0">
                                        Descprio
                                    </CustomToggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: '0 1rem' }}>
                                    <CustomToggle eventKey="0">
                                        Click me!
                                    </CustomToggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default MessageHeader;
