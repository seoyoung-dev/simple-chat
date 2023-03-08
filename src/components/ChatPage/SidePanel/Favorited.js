import { useEffect, useState } from 'react';
import { FaRegSmileBeam } from 'react-icons/fa';
import { database } from '../../../firebase';
import {
    child,
    off,
    onChildAdded,
    onChildRemoved,
    ref
} from '@firebase/database';
import { useDispatch, useSelector } from 'react-redux';
import {
    setCurrentChatRoom,
    setPrivateChatRoom
} from '../../../redux/actions/chatRoom_action';

function Favorited() {
    const usersRef = ref(database, 'users');
    const user = useSelector((state) => state.user.currentUser);
    const [favoritedChatRooms, setFavoritedChatRooms] = useState([]);
    const [activeChatRoomId, setActiveChatRoomId] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            addListners(user.uid);
            console.log('heyyyy', favoritedChatRooms);
        }
        // unmount 시 listener 제거
        return () => {
            if (user) {
                removeListeners(user.uid);
            }
            console.log('listener removed!');
        };
    }, []);

    const addListners = (userUid) => {
        onChildAdded(child(usersRef, `${userUid}/favorited`), (data) => {
            setFavoritedChatRooms((prev) => [
                ...prev,
                { id: data.key, ...data.val() }
            ]);
        });

        onChildRemoved(child(usersRef, `${userUid}/favorited`), (data) => {
            setFavoritedChatRooms((prev) =>
                prev.filter((chatRoom) => chatRoom.id !== data.key)
            );
        });
    };

    const removeListeners = (userId) => {
        off(child(usersRef, `${userId}/favorited`));
    };

    const renderFavoritedChatRooms = (favoritedChatRooms) =>
        favoritedChatRooms &&
        favoritedChatRooms.map((chatRoom) => (
            <li
                key={chatRoom.id}
                onClick={() => {
                    changeChatRoom(chatRoom);
                }}
                style={{
                    backgroundColor:
                        chatRoom.id === activeChatRoomId && '#ffffff45'
                }}
            >
                # {chatRoom.name}
            </li>
        ));

    const changeChatRoom = (room) => {
        dispatch(setCurrentChatRoom(room));
        setActiveChatRoomId(room.id);
        dispatch(setPrivateChatRoom(false));
    };

    return (
        <div>
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaRegSmileBeam style={{ marginRight: '3px' }} />
                FAVORITED (1)
            </span>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {renderFavoritedChatRooms(favoritedChatRooms)}
            </ul>
        </div>
    );
}

export default Favorited;
