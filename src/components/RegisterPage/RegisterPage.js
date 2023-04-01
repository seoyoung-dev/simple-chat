import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { auth, database } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import md5 from 'md5';

function RegisterPage() {
    const [errorFromSubmit, setErrorFromSubmit] = useState();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            let createdUser = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            await updateProfile(auth.currentUser, {
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(
                    createdUser.user.email
                )}?d=identicon`
            });

            await set(ref(database, `users/${createdUser.user.uid}`), {
                name: createdUser.user.displayName,
                image: createdUser.user.photoURL
            });

            setLoading(false);
        } catch (error) {
            setErrorFromSubmit(error.message);
            setLoading(false);
            setTimeout(() => {
                setErrorFromSubmit('');
            }, 5000);
        }
    };

    const password = useRef();
    password.current = watch('password');

    //

    return (
        <div className="auth-wrapper">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 className="page-header">REGISTER</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    type="email"
                    {...register('email', {
                        required: true,
                        pattern: /^\S+@\S+$/i,
                        maxLength: 20
                    })}
                />
                {errors.email && errors.email.type === 'required' && (
                    <span>필수 입력 사항입니다</span>
                )}
                {errors.email && errors.email.type === 'pattern' && (
                    <span>잘못된 패턴입니다</span>
                )}
                {errors.email && errors.email.type === 'maxLength' && (
                    <span>최대 20자를 초과할 수 없습니다</span>
                )}

                <label>Name</label>
                <input
                    {...register('name', { required: true, maxLength: 10 })}
                />
                {errors.name && errors.name.type === 'required' && (
                    <span>필수 입력 사항입니다</span>
                )}
                {errors.name && errors.name.type === 'maxLength' && (
                    <span>최대 10자를 초과할 수 없습니다</span>
                )}

                <label>Password</label>
                <input
                    type="password"
                    {...register('password', {
                        required: true,
                        minLength: 6
                    })}
                />
                {errors.password && errors.password.type === 'required' && (
                    <span>필수 입력 사항입니다</span>
                )}
                {errors.password && errors.password.type === 'minLength' && (
                    <span>비밀번호는 최소 6자 이상이어야 합니다</span>
                )}

                <label>Password Confirm</label>
                <input
                    type="password"
                    {...register('password_confirm', {
                        required: true,
                        validate: (value) => value === password.current
                    })}
                />
                {errors.password_confirm &&
                    errors.password_confirm.type === 'required' && (
                        <span>필수 입력 사항입니다</span>
                    )}
                {errors.password_confirm &&
                    errors.password_confirm.type === 'validate' && (
                        <span>비밀번호가 일치하지 않습니다</span>
                    )}
                {errorFromSubmit && <p>{errorFromSubmit}</p>}

                <input type="submit" disabled={loading} name="로그인" />
            </form>
            <Link to={'/login'} id="link">
                이미 아이디가 있나요?
            </Link>
        </div>
    );
}

export default RegisterPage;
