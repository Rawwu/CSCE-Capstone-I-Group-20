import React, { useState } from 'react';
import { signUp } from 'aws-amplify/auth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [step, setStep] = useState(1);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username, 
        password,
        options: {
          userAttributes: {
            email,
            phone_number: phoneNumber  // Optional
          }
        }
      });
      console.log('Sign up complete:', isSignUpComplete);
      setStep(2);  // Move to confirmation step
    } catch (error) {
      setError(error.message);
      console.error('Error registering:', error);
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      await confirmSignUp(username, confirmationCode);
      alert('User confirmed!');
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
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Enter confirmation code"
          />
          <button onClick={handleConfirmSignUp}>Confirm</button>
        </div>
      )}
    </div>
  );
};

export default Register;
