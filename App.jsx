import React, { useState, useEffect } from "react";

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);
  const [apostas, setApostas] = useState([]);
  const [usuarioParaRenomear, setUsuarioParaRenomear] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  // ---------- Usuários ----------
  useEffect(() => {
    const dados = localStorage.getItem("usuarios");
    if (dados) setUsuarios(JSON.parse(dados));
  }, []);

  const salvarUsuarios = (lista) => {
    localStorage.setItem("usuarios", JSON.stringify(lista));
  };

  const criarConta = () => {
    if (!novoUsuario.trim()) {
      alert("Digite um nome.");
      return;
    }
    if (usuarios.includes(novoUsuario)) {
      alert("Esse usuário já existe.");
      return;
    }
    const lista = [...usuarios, novoUsuario];
    setUsuarios(lista);
    salvarUsuarios(lista);
    setNovoUsuario("");
  };

  const excluirConta = (usuario) => {
    if (!window.confirm(`Excluir a conta "${usuario}" e todas as apostas dela?`)) return;
    const novaLista = usuarios.filter((u) => u !== usuario);
    setUsuarios(novaLista);
    salvarUsuarios(novaLista);
    localStorage.removeItem(`apostas_${usuario}`);
  };

  const abrirRenomear = (usuario) => {
    setUsuarioParaRenomear(usuario);
    setNovoNome("");
    setMostrarModal(true);
  };

  const renomearConta = () => {
    if (!novoNome.trim()) {
      alert("Digite um novo nome.");
      return;
    }
    if (usuarios.includes(novoNome)) {
      alert("Esse nome já existe.");
      return;
    }

    const apostasAntigas = localStorage.getItem(`apostas_${usuarioParaRenomear}`);
    if (apostasAntigas) {
      localStorage.setItem(`apostas_${novoNome}`, apostasAntigas);
      localStorage.removeItem(`apostas_${usuarioParaRenomear}`);
    }

    const novaLista = usuarios.map((u) => (u === usuarioParaRenomear ? novoNome : u));
    setUsuarios(novaLista);
    salvarUsuarios(novaLista);

    setMostrarModal(false);
    setUsuarioParaRenomear(null);
  };

  // ---------- Apostas ----------
  useEffect(() => {
    if (usuarioId) {
      const dados = localStorage.getItem(`apostas_${usuarioId}`);
      if (dados) setApostas(JSON.parse(dados));
      else setApostas([]);
    }
  }, [usuarioId]);

  const salvarApostas = (novas) => {
    localStorage.setItem(`apostas_${usuarioId}`, JSON.stringify(novas));
  };

  const adicionarAposta = () => {
    const nova = { id: Date.now().toString(), titulo: `Aposta ${apostas.length + 1}` };
    const novas = [...apostas, nova];
    setApostas(novas);
    salvarApostas(novas);
  };

  const excluirAposta = (id) => {
    if (!window.confirm("Excluir esta aposta?")) return;
    const novas = apostas.filter((item) => item.id !== id);
    setApostas(novas);
    salvarApostas(novas);
  };

  const sair = () => {
    setUsuarioId(null);
    setApostas([]);
  };

  // ---------- Telas ----------
  if (!usuarioId) {
    return (
      <div style={styles.container}>
        <h2>Contas</h2>

        {usuarios.map((user) => (
          <div key={user} style={styles.card}>
            <button style={styles.botaoLogin} onClick={() => setUsuarioId(user)}>Entrar</button>
            <button style={styles.botaoRenomear} onClick={() => abrirRenomear(user)}>Renomear</button>
            <button style={styles.botaoExcluir} onClick={() => excluirConta(user)}>Excluir</button>
          </div>
        ))}

        <input
          style={styles.input}
          placeholder="Novo usuário"
          value={novoUsuario}
          onChange={(e) => setNovoUsuario(e.target.value)}
        />
        <button style={styles.botaoAdicionar} onClick={criarConta}>Criar Conta</button>

        {mostrarModal && (
          <div style={styles.modalFundo}>
            <div style={styles.modalBox}>
              <h3>Renomear Conta</h3>
              <input
                style={styles.input}
                placeholder="Novo nome"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
              <button style={styles.botaoAdicionar} onClick={renomearConta}>Confirmar</button>
              <button style={styles.botaoSair} onClick={() => setMostrarModal(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Minhas Apostas ({usuarioId})</h2>

      {apostas.map((item) => (
        <div key={item.id} style={styles.card}>
          <span>{item.titulo}</span>
          <button style={styles.botaoExcluir} onClick={() => excluirAposta(item.id)}>Excluir</button>
        </div>
      ))}

      <button style={styles.botaoAdicionar} onClick={adicionarAposta}>Adicionar Aposta</button>
      <button style={styles.botaoSair} onClick={sair}>Sair</button>
    </div>
  );
}

const styles = {
  container: { padding: 20, fontFamily: "Arial" },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  botaoLogin: { background: "#007bff", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 6 },
  botaoRenomear: { background: "orange", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 6 },
  botaoExcluir: { background: "red", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 6 },
  botaoAdicionar: { background: "green", color: "#fff", padding: "10px 14px", border: "none", borderRadius: 6, marginTop: 10 },
  botaoSair: { background: "gray", color: "#fff", padding: "10px 14px", border: "none", borderRadius: 6, marginTop: 10 },
  input: { padding: 8, marginBottom: 10, border: "1px solid #ccc", borderRadius: 6, width: "100%" },
  modalFundo: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
  },
  modalBox: { background: "#fff", padding: 20, borderRadius: 8, minWidth: "300px" },
};