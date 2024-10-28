import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmResetPassword } from 'aws-amplify/auth';

function ConfirmResetPassword() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleConfirmResetPassword = async (event) => {
    event.preventDefault();
    if (!email) {
      setError('Email is missing. Please start the reset process again.');
      return;
    }

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      setMessage('Password reset successfully. You can now log in.');
      navigate('/login');
    } catch (error) {
      setError('Failed to reset password: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Confirm Reset Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleConfirmResetPassword}>
        <div className="form-group">
          <label>Confirmation Code:</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Confirm Reset</button>
      </form>
    </div>
  );
}

export default ConfirmResetPassword;