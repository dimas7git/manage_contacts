import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await api.post('/reset-password', {
        email,
        newPassword: novaSenha
      });
      setMensagem('Senha redefinida com sucesso!');
      setErro('');
    } catch (err) {
      setErro('Erro ao redefinir senha');
      setMensagem('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Redefinir Senha</h2>
        <input
          type="email"
          placeholder="Email cadastrado"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nova Senha"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={novaSenha}
          onChange={e => setNovaSenha(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Redefinir Senha
        </button>

        {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
        {mensagem && <p className="text-green-500 text-sm mt-2">{mensagem}</p>}

        <p className="mt-4 text-sm text-center">
          <button onClick={() => navigate('/login')} className="text-blue-500 underline">
            Voltar ao login
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
