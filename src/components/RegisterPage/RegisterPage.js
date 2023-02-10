import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

function RegisterPage() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();
    const onSubmit = (data) => {
        console.log(data);
    }; // your form submit function which will invoke after successful validation

    console.log(watch('example'));
    return (
        <div className="auth-wrapper">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h3>Register</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    type="email"
                    {...register('email', { required: true })}
                />
                <label>Name</label>
                <input {...register('name', { required: true })} />
                <label>Password</label>
                <input
                    type="password"
                    {...register('password', { required: true })}
                />
                <label>Password Confirm</label>
                <input
                    type="password"
                    {...register('password_confirm', { required: true })}
                />

                {errors.exampleRequired && <span>This field is required</span>}

                <input type="submit" />
            </form>
            <Link to={'/login'} id="link">
                이미 아이디가 있나요?
            </Link>
        </div>
    );
}

export default RegisterPage;
