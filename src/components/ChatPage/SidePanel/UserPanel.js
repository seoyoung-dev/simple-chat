import React from 'react';
import { RiChatSmile2Line } from 'react-icons/ri';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

function UserPanel() {
    const user = useSelector((state) => state.user.currentUser);

    const handleLogOut = () => {
        signOut(auth);
        console.log('logout success!');
    };

    return (
        <div>
            <h3 style={{ color: 'white' }}>
                {' '}
                <RiChatSmile2Line />
                Simple Chat
            </h3>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                <Image
                    src={user && user.photoURL}
                    roundedCircle
                    style={{ width: '30px', height: '30px', marginTop: '3px' }}
                />
                <Dropdown>
                    <Dropdown.Toggle
                        id="dropdown-basic"
                        style={{ background: 'transparent', border: '0px' }}
                    >
                        {user && user.displayName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">
                            프로필 사진 변경
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2" onClick={handleLogOut}>
                            로그아웃
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
}

export default UserPanel;
