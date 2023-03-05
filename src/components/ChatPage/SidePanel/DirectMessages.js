import { useEffect, useState } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { database } from '../../../firebase';
import { ref, onChildAdded } from 'firebase/database';
import { useSelector, useDispatch } from 'react-redux';
import {
    setCurrentChatRoom,
    setPrivateChatRoom
} from '../../../redux/actions/chatRoom_action';

function DirectMessages() {
    const [users, setUsers] = useState([]);
    const [activeChatRoom, setActiveChatRoom] = useState('');
    const userRef = ref(database, 'users');
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser) {
            addUserListeners(currentUser.uid);
        }
    }, []);

    const addUserListeners = (currentUserId) => {
        const usersArray = [];
        onChildAdded(userRef, (data) => {
            if (currentUserId !== data.key) {
                const userInfo = data.val();
                userInfo['uid'] = data.key;
                userInfo['status'] = 'offline';
                usersArray.push(userInfo);
                setUsers([...usersArray]);
            }
        });
    };

    const getChatRoomId = (userId) => {
        const currentUserId = currentUser.uid;
        return userId > currentUserId
            ? `${userId}/${currentUserId}`
            : `${currentUserId}/${userId}`;
    };

    const changeChatRoom = (userInfo) => {
        const chatRoomId = getChatRoomId(userInfo.uid);
        const chatRoomData = {
            id: chatRoomId,
            name: userInfo.name
        };
        dispatch(setCurrentChatRoom(chatRoomData));
        dispatch(setPrivateChatRoom(true));
        setActiveChatRoom(userInfo.uid);
    };

    const renderDirectMessages = (users) =>
        users &&
        users.map((user) => (
            <li
                onClick={() => {
                    changeChatRoom(user);
                }}
                key={user.uid}
                style={{
                    backgroundColor: activeChatRoom === user.uid && '#ffffff45'
                }}
            >
                # {user.name}
            </li>
        ));

    return (
        <div>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaRegSmile style={{ marginRight: '3px' }} />
                DIRECT MESSAGES(1)
            </span>
            <ul
                style={{ listStyleType: 'none', padding: 0, cursor: 'pointer' }}
            >
                {renderDirectMessages(users)}
            </ul>
        </div>
    );
}

export default DirectMessages;
