import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/login', { email, password: senha });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setErro('Credenciais inválidas');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Entrar
        </button>
        <p onClick={() => navigate('/reset-password')} className="text-[11px] underline text-right cursor-pointer mt-4">
            Esqueci minha senha
        </p>
        {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}

        <div className="flex justify-center">
  <div className="mt-6 text-sm text-center">
    <p>
      Ainda não tem conta?{' '}
      <button onClick={() => navigate('/register')} className="text-white-500 underline">
        Cadastre-se
      </button>
    </p>
  </div>
</div>

      </div>
    </div>
  );
};

export default Login;
