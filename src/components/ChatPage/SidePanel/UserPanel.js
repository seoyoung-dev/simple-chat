import React, { useRef } from 'react';
import { RiChatSmile2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector } from 'react-redux';
import { setPhotoURL } from '../../../redux/actions/user_action';
import { auth, storage, database } from '../../../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { ref as strRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref, child, push, update } from 'firebase/database';

function UserPanel() {
    const user = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();
    const inputOpenImageRef = useRef();
    const dispatch = useDispatch();

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click();
    };
    const handleLogOut = () => {
        signOut(auth);
        navigate('/login');
        window.location.reload();
        console.log('logout success!');
    };

    const handleUploadImage = async (e) => {
        try {
            const file = e.target.files[0];
            const metadata = { contentType: file.type };
            const storageRef = strRef(storage, `user+image/${user.uid})`);
            await uploadBytes(storageRef, file, metadata);

            // 스토리지에 올린 파일을 URL 형식으로 다운로드 함
            let downloadURL = await getDownloadURL(storageRef);

            // 프로필 이미지 수정
            await updateProfile(auth.currentUser, {
                photoURL: downloadURL
            });

            // redux 수정
            dispatch(setPhotoURL(downloadURL));

            // database 수정
            update(ref(database, `users/${user.uid}`), { image: downloadURL });
        } catch (error) {
            alert(error);
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
