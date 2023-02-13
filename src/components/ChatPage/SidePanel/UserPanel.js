import React, { useRef } from 'react';
import { RiChatSmile2Line } from 'react-icons/ri';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { storage } from '../../../firebase';
import { ref, uploadBytes } from 'firebase/storage';

function UserPanel() {
    const user = useSelector((state) => state.user.currentUser);
    const inputOpenImageRef = useRef();

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    };
    const handleLogOut = () => {
        signOut(auth);
        console.log('logout success!');
    };

    const handleUploadImage = (e) => {
        try {
            const file = e.target.files[0];
            const metadata = { contentType: file.type };
            const storageRef = ref(storage, `user+image/${user.uid})`);
            const uploadTask = uploadBytes(storageRef, file, metadata);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
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
                        <Dropdown.Item onClick={handleOpenImageRef}>
                            프로필 사진 변경
                        </Dropdown.Item>
                        <Dropdown.Item href="#/action-2" onClick={handleLogOut}>
                            로그아웃
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <input
                accept="image/png, image/jpeg, image/jpg"
                style={{ display: 'none' }}
                type="file"
                ref={inputOpenImageRef}
                onChange={handleUploadImage}
            />
        </div>
    );
}

export default UserPanel;
