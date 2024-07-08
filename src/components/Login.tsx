import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      console.log("Log in!");
      navigate('/admin');
    }
  };
  
  return (
    <div className="fade-in">
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input className="big-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          <input className="big-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          <button className="button" type="submit">Log in</button>
        </form>
      </div>
    </div>
  )
}

export default Login
