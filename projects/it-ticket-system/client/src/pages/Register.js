import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
}).required();

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Sign up to get started with our ticket system</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      placeholder="John"
                      {...register('firstName')}
                      disabled={loading}
                    />
                  </div>
                  {errors.firstName && (
                    <div className="form-text error">{errors.firstName.message}</div>
                  )}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <div className="input-with-icon">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      placeholder="Doe"
                      {...register('lastName')}
                      disabled={loading}
                    />
                  </div>
                  {errors.lastName && (
                    <div className="form-text error">{errors.lastName.message}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="john@example.com"
                  {...register('email')}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <div className="form-text error">{errors.email.message}</div>
              )}
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="••••••"
                      {...register('password')}
                      disabled={loading}
                    />
                  </div>
                  {errors.password && (
                    <div className="form-text error">{errors.password.message}</div>
                  )}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="••••••"
                      {...register('confirmPassword')}
                      disabled={loading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="form-text error">{errors.confirmPassword.message}</div>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spin" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;