import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import Checkbox from './Checkbox';
import Form from './Form';
import TextInput from './TextInput';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState('');
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // do validation
    if (password !== confirmPassword) {
      return setError("Password don't match!");
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password, username);
      navigate('/');
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError('Failed to create an account!');
    }
  }

  return (
    <Form
      style={{
        height: '500px',
      }}
      onSubmit={handleSubmit}
    >
      <TextInput
        type="text"
        placeholder="Enter name"
        icon="person"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <TextInput
        type="text"
        required
        placeholder="Enter email"
        icon="alternate_email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <TextInput
        type="password"
        required
        placeholder="Enter password"
        icon="lock"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <TextInput
        type="password"
        required
        placeholder="Confirm password"
        icon="lock_clock"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <Checkbox
        required
        text="I agree to the Terms &amp; Conditions"
        value={agree}
        onChange={e => setAgree(e.target.value)}
      />
      <Button disabled={loading} type="submit">
        <span>Submit now</span>
      </Button>{' '}
      {/* there 'disabled' is to stop multiple presses on button */}
      {error && <p className="error">{error}</p>}
      <div className="info">
        Don't have an account? <Link to="/login">Signup</Link> instead.
      </div>
    </Form>
  );
}
