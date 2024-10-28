import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from 'aws-amplify/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      const output = await resetPassword({ username: email });
      handleResetPasswordNextSteps(output);
    } catch (error) {
      setError('Error sending reset password code: ' + error.message);
    }
  };

  const handleResetPasswordNextSteps = (output) => {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
        setMessage(
          `Confirmation code was sent to ${nextStep.codeDeliveryDetails.DeliveryMedium}. Check your email or SMS.`
        );
        // Navigate to confirm password page
        navigate('/confirm-reset-password', { state: { email } });
        break;
      case 'DONE':
        setMessage('Password reset successfully.');
        navigate('/login');
        break;
      default:
        setError('Unexpected reset password step.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Send Reset Code</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
