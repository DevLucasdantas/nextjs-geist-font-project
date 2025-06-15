"use client"
import React, { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type Status = "Pendente" | "Em andamento" | "Concluído";

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: "Baixa" | "Média" | "Alta";
  prazo: string; // ISO date string
  status: Status;
  categoria: string;
}

const categorias = [
  "Projetos",
  "Estudo",
  "Marketing",
  "Shopee",
  "Amazon",
  "TikTok",
];

const Tarefas: React.FC = () => {
  const [tarefas, setTarefas] = useLocalStorage<Tarefa[]>("tarefas", []);
  const [form, setForm] = useState<Omit<Tarefa, "id">>({
    titulo: "",
    descricao: "",
    prioridade: "Média",
    prazo: "",
    status: "Pendente",
    categoria: categorias[0],
  });
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;

    if (editandoId) {
      setTarefas(
        tarefas.map((t) =>
          t.id === editandoId ? { ...t, ...form, id: editandoId } : t
        )
      );
      setEditandoId(null);
    } else {
      setTarefas([
        ...tarefas,
        { ...form, id: crypto.randomUUID() },
      ]);
    }
    setForm({
      titulo: "",
      descricao: "",
      prioridade: "Média",
      prazo: "",
      status: "Pendente",
      categoria: categorias[0],
    });
  };

  const handleEditar = (id: string) => {
    const tarefa = tarefas.find((t) => t.id === id);
    if (tarefa) {
      setForm({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        prioridade: tarefa.prioridade,
        prazo: tarefa.prazo,
        status: tarefa.status,
        categoria: tarefa.categoria,
      });
      setEditandoId(id);
    }
  };

  const handleRemover = (id: string) => {
    setTarefas(tarefas.filter((t) => t.id !== id));
  };

  const handleConcluir = (id: string) => {
    setTarefas(
      tarefas.map((t) =>
        t.id === id ? { ...t, status: "Concluído" } : t
      )
    );
  };

  return (
    <div className="p-4 bg-surface rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Gestão de Tarefas</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          className="w-full p-2 rounded bg-background text-textPrimary border border-gray-600"
          required
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          className="w-full p-2 rounded bg-background text-textPrimary border border-gray-600"
          rows={3}
        />
        <div className="flex space-x-4">
          <select
            name="prioridade"
            value={form.prioridade}
            onChange={handleChange}
            className="p-2 rounded bg-background text-textPrimary border border-gray-600 flex-1"
          >
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
          </select>
          <input
            type="date"
            name="prazo"
            value={form.prazo}
            onChange={handleChange}
            className="p-2 rounded bg-background text-textPrimary border border-gray-600 flex-1"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="p-2 rounded bg-background text-textPrimary border border-gray-600 flex-1"
          >
            <option>Pendente</option>
            <option>Em andamento</option>
            <option>Concluído</option>
          </select>
        </div>
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="p-2 rounded bg-background text-textPrimary border border-gray-600 w-full"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-primary hover:bg-secondary text-background font-semibold py-2 px-4 rounded transition-colors"
        >
          {editandoId ? "Salvar Alterações" : "Adicionar Tarefa"}
        </button>
      </form>

      <div>
        {tarefas.length === 0 ? (
          <p>Nenhuma tarefa cadastrada.</p>
        ) : (
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-700 p-2">Título</th>
                <th className="border border-gray-700 p-2">Prioridade</th>
                <th className="border border-gray-700 p-2">Prazo</th>
                <th className="border border-gray-700 p-2">Status</th>
                <th className="border border-gray-700 p-2">Categoria</th>
                <th className="border border-gray-700 p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tarefas.map((tarefa) => (
                <tr key={tarefa.id} className="hover:bg-surface">
                  <td className="border border-gray-700 p-2">{tarefa.titulo}</td>
                  <td className="border border-gray-700 p-2">{tarefa.prioridade}</td>
                  <td className="border border-gray-700 p-2">{tarefa.prazo}</td>
                  <td className="border border-gray-700 p-2">{tarefa.status}</td>
                  <td className="border border-gray-700 p-2">{tarefa.categoria}</td>
                  <td className="border border-gray-700 p-2 space-x-2">
                    <button
                      onClick={() => handleEditar(tarefa.id)}
                      className="bg-secondary text-background px-2 py-1 rounded hover:bg-primary transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleConcluir(tarefa.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                    >
                      Concluir
                    </button>
                    <button
                      onClick={() => handleRemover(tarefa.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Tarefas;
