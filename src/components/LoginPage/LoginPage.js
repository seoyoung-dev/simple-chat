import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginPage() {
    const [errorFromSubmit, setErrorFromSubmit] = useState();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
        } catch (error) {
            alert('이메일과 비밀번호가 일치하지 않습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="auth-wrapper">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3>Login</h3>
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

                {errorFromSubmit && <p>{errorFromSubmit}</p>}

                <input type="submit" disabled={loading} />
            </form>
            <Link to="/register" id="link">
                아직 아이디가 없나요?
            </Link>
        </div>
    );
}

export default LoginPage;
