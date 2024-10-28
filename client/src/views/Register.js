import React, { useState } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');  // This is for custom preferred username
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');  // Email is used as Cognito username
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Form validation
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
  
    try {
      const { user } = await signUp({
        username: email,  // Using email as the Cognito username
        password,
        attributes: {
          email,  // Cognito required attribute
          phone_number: phoneNumber,  // Optional attribute
          'custom:display_username': username  // Custom attribute
        },
      });
  
      console.log('Sign up complete:', user);
      setStep(2);  // Move to the confirmation step
      setError(null);  // Reset the error
    } catch (error) {
      setError(error.message);
      console.error('Error registering:', error);
    }
  };
  
  

  const handleConfirmSignUp = async () => {
    // Basic validation for confirmation code
    if (!confirmationCode) {
      setError('Please enter the confirmation code');
      return;
    }
  
    try {
      // Use email (which is the Cognito username) to confirm sign-up
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,  // Using email as the Cognito username
        confirmationCode
      });
  
      alert('User confirmed!');
      setError(null);  // Reset the error
  
      // Redirect to login or user profile page
      navigate('/login');
    } catch (error) {
      setError(error.message);
      console.error('Error confirming sign-up:', error);
    }
  };
  

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number (optional):</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button type="submit">Register</button>
          </form>
          {error && <p>{error}</p>}
        </div>
      )}

      {step === 2 && (
        <div>
            <h2>Confirm Registration</h2>
            <div>
            <label htmlFor="emailConfirmation">Email:</label>
            <input
                type="text"
                id="emailConfirmation"
                value={email}  // Pre-populate with email
                disabled
            />
            </div>
            <div>
            <label htmlFor="confirmationCode">Confirmation Code:</label>
            <input
                type="text"
                id="confirmationCode"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Enter confirmation code"
            />
            </div>
            <button 
                onClick={handleConfirmSignUp} 
                disabled={!confirmationCode}  // Disable button if no confirmation code is entered
            >
                Confirm
            </button>
            {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Register;