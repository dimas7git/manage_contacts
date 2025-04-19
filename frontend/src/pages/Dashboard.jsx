import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [contatos, setContatos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [dataCriacaoDe, setDataCriacaoDe] = useState("");
  const [dataCriacaoAte, setDataCriacaoAte] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [novoContato, setNovoContato] = useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    status: "ativo",
  });
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const carregarContatos = async () => {
    try {
      const params = new URLSearchParams();
      if (busca) params.append("q", busca);
      if (filtroStatus) params.append("status", filtroStatus);
      if (dataCriacaoDe) params.append("created_from", dataCriacaoDe);
      if (dataCriacaoAte) params.append("created_to", dataCriacaoAte);

      const res = await api.get(`/contacts?${params.toString()}`);
      setContatos(res.data);
    } catch (err) {
      console.error("Erro ao carregar contatos:", err);
    }
  };

  const buscarEnderecoPorCep = async (cep) => {
    try {
      const cepLimpo = cep.replace(/\D/g, "");

      if (cepLimpo.length !== 8) return;

      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        setErro("CEP não encontrado.");
        return;
      }

      setNovoContato((prev) => ({
        ...prev,
        address: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));
      setErro("");
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
      setErro("Erro ao buscar endereço pelo CEP.");
    }
  };
  const exportarCSV = async () => {
    try {
      const response = await api.get("/contacts/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contatos.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erro ao exportar CSV:", err);
    }
  };

  const salvarContato = async () => {
    if (editandoId) {
      try {
        await api.put(`/contacts/${editandoId}`, novoContato);
        setMensagem("Contato atualizado com sucesso!");
        setErro("");
        setEditandoId(null);
        setNovoContato({
          name: "",
          email: "",
          phone: "",
          status: "ativo",
          cep: "",
          address: "",
          neighborhood: "",
          city: "",
          state: "",
        });
        carregarContatos();
      } catch (err) {
        setErro("Erro ao atualizar contato.");
        setMensagem("");
        console.error("Erro ao atualizar contato:", err);
      }
    } else {
      try {
        await api.post("/contacts", novoContato);
        setMensagem("Contato criado com sucesso!");
        setErro("");
        setNovoContato({
          name: "",
          email: "",
          phone: "",
          status: "ativo",
          cep: "",
          address: "",
          neighborhood: "",
          city: "",
          state: "",
        });
        carregarContatos();
      } catch (err) {
        setErro("Erro ao criar contato.");
        setMensagem("");
        console.error("Erro ao criar contato:", err);
      }
    }
  };

  const iniciarEdicao = (contato) => {
    setNovoContato({
      name: contato.name,
      email: contato.email,
      phone: contato.phone,
      status: contato.status,
      cep: contato.cep,
      address: contato.address,
      neighborhood: contato.neighborhood,
      city: contato.city,
      state: contato.state,
    });
    setEditandoId(contato.id);
  };

  const excluirContato = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      setMensagem("Contato excluído com sucesso!");
      setErro("");
      carregarContatos();
    } catch (err) {
      setErro("Erro ao excluir contato.");
      setMensagem("");
      console.error("Erro ao excluir:", err);
    }
  };

  useEffect(() => {
    carregarContatos();
  }, [busca, filtroStatus, dataCriacaoDe, dataCriacaoAte]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
          Gerenciador de Contatos
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editandoId ? "Editar Contato" : "Novo Contato"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-lg shadow-inner">
            <input
              type="text"
              placeholder="Nome"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={novoContato.name}
              onChange={(e) =>
                setNovoContato({ ...novoContato, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={novoContato.email}
              onChange={(e) =>
                setNovoContato({ ...novoContato, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Telefone"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={novoContato.phone}
              onChange={(e) =>
                setNovoContato({ ...novoContato, phone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="CEP"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={novoContato.cep}
              onChange={(e) => {
                const novoCep = e.target.value;
                setNovoContato({ ...novoContato, cep: novoCep });

                if (novoCep.length === 8) {
                  buscarEnderecoPorCep(novoCep);
                }
              }}
            />

            <input
              type="text"
              placeholder="Rua"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={novoContato.address}
              onChange={(e) =>
                setNovoContato({ ...novoContato, address: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Bairro"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={novoContato.neighborhood}
              onChange={(e) =>
                setNovoContato({ ...novoContato, neighborhood: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Cidade"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={novoContato.city}
              onChange={(e) =>
                setNovoContato({ ...novoContato, city: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="UF"
              maxLength={2}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={novoContato.state}
              onChange={(e) =>
                setNovoContato({
                  ...novoContato,
                  state: e.target.value.toUpperCase(),
                })
              }
            />
            <div className="flex items-center gap-14">
              <select
                className="p-2 border border-gray-300 rounded h-auto"
                value={novoContato.status}
                onChange={(e) =>
                  setNovoContato({ ...novoContato, status: e.target.value })
                }
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>

              <button
                onClick={salvarContato}
                className={`p-3 text-white rounded-lg transition flex items-center justify-center h-auto w-auto ${
                  editandoId
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                title={editandoId ? "Atualizar" : "Salvar"}
              >
                {editandoId ? "Atualizar" : "Salvar"}
                <CheckIcon className="h-5 w-5 ml-4" />
              </button>
            </div>
          </div>

          {mensagem && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded">
              {mensagem}
            </div>
          )}

          {erro && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
              {erro}
            </div>
          )}
        </div>
        <div className="mb-6">
          {mostrarFiltros && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3 h-10"
                  >
                    <option value="">Todos</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Data de Criação (de)
                  </label>
                  <input
                    type="date"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-auto"
                    value={dataCriacaoDe}
                    onChange={(e) => setDataCriacaoDe(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Data de Criação (até)
                  </label>
                  <input
                    type="date"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-auto"
                    value={dataCriacaoAte}
                    onChange={(e) => setDataCriacaoAte(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 transition"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setMostrarFiltros((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow h-auto w-auto"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>

            <button
              onClick={exportarCSV}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow"
            >
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-800 uppercase text-sm tracking-wide">
                <th className="text-left p-3 border-b w-1/5">Nome</th>
                <th className="text-left p-3 border-b w-1/5">Email</th>
                <th className="text-left p-3 border-b w-1/5">Telefone</th>
                <th className="text-left p-3 border-b w-1/5">Status</th>
                <th className="text-left p-3 border-b w-1/5">Rua</th>
                <th className="text-center p-3 border-b w-1/5">Ações</th>
              </tr>
            </thead>

            <tbody>
              {contatos.map((c, i) => (
                <tr
                  key={c.id}
                  className={
                    i % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="p-3 border-b">{c.name}</td>
                  <td className="p-3 border-b">{c.email}</td>
                  <td className="p-3 border-b">{c.phone}</td>
                  <td className="p-3 border-b whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        c.status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 border-b">{c.address}</td>
                  <td className="p-3 border-b text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => iniciarEdicao(c)}
                        className="bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition w-[60px] flex items-center justify-center"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => excluirContato(c.id)}
                        className="bg-red-600 text-white text-sm rounded hover:bg-red-700 transition w-[60px] flex items-center justify-center"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {contatos.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    Nenhum contato encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
