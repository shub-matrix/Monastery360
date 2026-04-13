import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const baseURL = "https://form-backend-gold.vercel.app/api";

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
      setIsUserLoading(false);
    } else {
      const timer = setTimeout(() => {
        if (!user) {
          navigate('/login');
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const updateData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      };

      if (form.password && form.password.trim() !== '') {
        updateData.password = form.password;
      }

      console.log("Updating profile with data:", updateData);
      console.log("User object:", user);
      console.log("User ID:", user?._id);
      console.log("User email:", user?.email);

      let response;
      
      try {
        response = await axios.patch(
          `${baseURL}/users/profile`, 
          updateData, 
          getAuthHeaders()
        );
      } catch (firstErr) {
        console.log("First endpoint failed, trying admin endpoint with user ID...");
        
        if (user?._id) {
          response = await axios.patch(
            `${baseURL}/admin/users/${user._id}`, 
            updateData, 
            getAuthHeaders()
          );
        } else if (user?.id) {
          response = await axios.patch(
            `${baseURL}/admin/users/${user.id}`, 
            updateData, 
            getAuthHeaders()
          );
        } else {
          response = await axios.patch(
            `${baseURL}/users/update`, 
            { ...updateData, currentEmail: user?.email }, 
            getAuthHeaders()
          );
        }
      }

      console.log("Profile update response:", response.data);

      const updatedUser = {
        ...user,
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
      };

      login(updatedUser);

      setForm({
        ...form,
        password: '',
        confirmPassword: '',
      });

      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error("Profile update error:", err);
      console.error("Profile update error response:", err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="profile-wrapper">
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>Profile</h2>
        <form onSubmit={handleUpdate}>
          <div>
            <label>First Name:</label>
            <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update'}
          </button>
        </form>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="logout-btn"
          style={{ marginTop: '1rem' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
