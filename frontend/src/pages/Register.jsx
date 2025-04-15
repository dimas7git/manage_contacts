import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }

    try {
      await api.post('/register', {
        name: nome,
        email,
        password: senha
      });
      setMensagem('Usuário registrado com sucesso!');
      setErro('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao registrar usuário');
      setMensagem('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
        <input
          type="text"
          placeholder="Nome"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
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
          onClick={handleRegister}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Registrar
        </button>

        {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
        {mensagem && <p className="text-green-500 text-sm mt-2">{mensagem}</p>}

        <p className="mt-4 text-sm text-center">
          Já tem uma conta?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-500 underline">
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
