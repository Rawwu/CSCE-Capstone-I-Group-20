import React, { useState } from 'react';

// Add registration functionality here
const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
 
    const handleRegister = async (e) => {
        e.preventDefault();

        //Validating input
        try
        {
            if(!username || !password)
            {
                setError('Username and password are requried for registration');
                return;
            }

        let request;
        try
        {
        //sending the request to the server side 
            const request = await fetch('/register', {
            method: 'POST',
            headers: 
            {
                 'Content-Type': 'application/json',
            },
            body: JSON.stringify({username,password})
        });
        }

        catch (error)
        {
            console.error('Error sending request', error);
            setError('Unexpected error occured');
            return;
        }

         //checking if the request was successful
        if(request.ok)
        {
            console.log('Registration successful');
        }

        //sending errors if request comes back unsuccessful
        else
        {
            const data = await request.json();
            setError(data.message || 'Registration unsuccessful')
        }

        }
         catch (error)
        {
            console.error('Registering error', error);
            setError('Unexpected error occurred');
        }
    }

  return (
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;