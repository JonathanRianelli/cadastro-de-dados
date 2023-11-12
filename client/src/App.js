import { useState, useEffect } from "react";
import Axios from "axios";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import "./App.scss";

function App() {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState({
    s_nome_cliente: "",
    s_sexo_cliente: "",
    d_data_cliente: "",
    s_cidade_cliente: "",
  });

  const [modoEdicao, setModoEdicao] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);

  const [resultadosAnalise, setResultadosAnalise] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Axios.get("http://localhost:3001/getCliente").then((response) => {
      const clientesFormatados = response.data.map((cliente) => ({
        ...cliente,
        d_data_cliente: format(new Date(cliente.d_data_cliente), "dd-MM-yyyy"),
        s_sexo_cliente:
          cliente.s_sexo_cliente === "F" ? "Feminino" : "Masculino",
      }));
      setClientes(clientesFormatados);
    });
  };

  const adicionar = () => {
    if (
      !formulario.s_nome_cliente ||
      !formulario.s_sexo_cliente ||
      !formulario.d_data_cliente ||
      !formulario.s_cidade_cliente
    ) {
      alert("Por favor, preencha todos os campos do formulário.");
      return;
    }

    Axios.post("http://localhost:3001/adicionar", {
      s_nome_cliente: formulario.s_nome_cliente,
      s_sexo_cliente: formulario.s_sexo_cliente,
      d_data_cliente: formulario.d_data_cliente,
      s_cidade_cliente: formulario.s_cidade_cliente,
    }).then((response) => {
      console.log(response);
      setFormulario({
        s_nome_cliente: "",
        s_sexo_cliente: "",
        d_data_cliente: "",
        s_cidade_cliente: "",
      });
      fetchData();
    });
  };

  const excluir = (id) => {
    Axios.delete(`http://localhost:3001/excluir/${id}`).then((response) => {
      console.log(response);
      fetchData();
    });
  };

  const editar = (cliente) => {
    setModoEdicao(true);
    setClienteEditar(cliente);

    const [dia, mes, ano] = cliente.d_data_cliente.split("-");
    const dataParaInputDate = `${ano}-${mes}-${dia}`;

    setFormulario({
      s_nome_cliente: cliente.s_nome_cliente,
      s_sexo_cliente: cliente.s_sexo_cliente === "Feminino" ? "F" : "M",
      d_data_cliente: dataParaInputDate,
      s_cidade_cliente: cliente.s_cidade_cliente,
    });
  };

  const salvarEdicao = () => {
    Axios.put(`http://localhost:3001/editar`, {
      i_codcontato_cliente: clienteEditar.i_codcontato_cliente,
      s_nome_cliente: formulario.s_nome_cliente,
      s_sexo_cliente: formulario.s_sexo_cliente,
      d_data_cliente: formulario.d_data_cliente,
      s_cidade_cliente: formulario.s_cidade_cliente,
    }).then((response) => {
      console.log(response);
      setModoEdicao(false);
      setClienteEditar(null);
      setFormulario({
        s_nome_cliente: "",
        s_sexo_cliente: "",
        d_data_cliente: "",
        s_cidade_cliente: "",
      });
      fetchData();
    });
  };
  const cancelarEdicao = () => {
    setModoEdicao(false);
    setClienteEditar(null);
    setFormulario({
      s_nome_cliente: "",
      s_sexo_cliente: "",
      d_data_cliente: "",
      s_cidade_cliente: "",
    });
  };

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const analisar = () => {
    const totalContatos = clientes.length;
    const homens = clientes.filter(
      (cliente) => cliente.s_sexo_cliente === "Masculino"
    ).length;
    const mulheres = clientes.filter(
      (cliente) => cliente.s_sexo_cliente === "Feminino"
    ).length;

    const resultadosGerais = `Número de contatos no banco de dados: ${totalContatos}, ${homens} ${
      homens === 1 ? "homem" : "homens"
    } e ${mulheres} ${mulheres === 1 ? "mulher" : "mulheres"}`;

    const resultadosPorCidade = clientes.reduce((acc, cliente) => {
      const cidade = cliente.s_cidade_cliente;

      if (!acc[cidade]) {
        acc[cidade] = {
          total: 0,
          homens: 0,
          mulheres: 0,
          meses: {},
        };
      }

      acc[cidade].total++;
      acc[cidade][
        cliente.s_sexo_cliente === "Masculino" ? "homens" : "mulheres"
      ]++;

      const mes = format(new Date(cliente.d_data_cliente), "MMMM", {
        locale: pt,
      });

      if (!acc[cidade].meses[mes]) {
        acc[cidade].meses[mes] = {
          total: 0,
          homens: 0,
          mulheres: 0,
        };
      }

      acc[cidade].meses[mes].total++;
      acc[cidade].meses[mes][
        cliente.s_sexo_cliente === "Masculino" ? "homens" : "mulheres"
      ]++;

      return acc;
    }, {});

    setResultadosAnalise({ resultadosGerais, resultadosPorCidade });
  };

  return (
    <div>
      <h1>Cadastro de Dados:</h1>

      <div className="form-container">
        <form>
          <div className="campo-form">
            <label htmlFor="s_nome_cliente">Nome: </label>
            <input
              type="text"
              name="s_nome_cliente"
              id="s_nome_cliente"
              value={formulario.s_nome_cliente}
              onChange={handleChange}
            />
          </div>

          <div className="campo-form">
            <label htmlFor="s_sexo_cliente">Sexo: </label>
            <select
              name="s_sexo_cliente"
              id="s_sexo_cliente"
              value={formulario.s_sexo_cliente}
              onChange={handleChange}
            >
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>

          <div className="campo-form">
            <label htmlFor="d_data_cliente">Data de Nascimento: </label>
            <input
              type="date"
              name="d_data_cliente"
              id="d_data_cliente"
              value={formulario.d_data_cliente}
              onChange={handleChange}
            />
          </div>

          <div className="campo-form">
            <label htmlFor="s_cidade_cliente">Cidade: </label>
            <input
              type="text"
              name="s_cidade_cliente"
              id="s_cidade_cliente"
              value={formulario.s_cidade_cliente}
              onChange={handleChange}
            />
          </div>

          {modoEdicao ? (
            <>
              <button type="button" onClick={cancelarEdicao}>
                Cancelar Edição
              </button>
              <button type="button" onClick={salvarEdicao}>
                Salvar Edição
              </button>
            </>
          ) : (
            <button type="button" onClick={adicionar}>
              Adicionar Cliente
            </button>
          )}
        </form>
      </div>
  

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Sexo</th>
              <th>Data de Nascimento</th>
              <th>Cidade</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.i_codcontato_cliente}>
                <td>{cliente.s_nome_cliente}</td>
                <td>{cliente.s_sexo_cliente}</td>
                <td>{cliente.d_data_cliente}</td>
                <td>{cliente.s_cidade_cliente}</td>
                <td>
                  <button onClick={() => editar(cliente)}>Editar</button>
                  <button onClick={() => excluir(cliente.i_codcontato_cliente)}>
                    {" "}
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => analisar()}>
        Contar No de contatos por cidade
      </button>

      {resultadosAnalise && (
        <div>
          <h2>Resultados da Análise:</h2>
          <p>{resultadosAnalise.resultadosGerais}</p>

          {Object.entries(resultadosAnalise.resultadosPorCidade).map(
            ([cidade, dadosCidade]) => (
              <div key={cidade}>
                <h3>{`Contatos em ${cidade}:`}</h3>

                {Object.entries(dadosCidade.meses).map(([mes, dadosMes]) => (
                  <p key={mes}>{`${mes}: ${dadosMes.total}, ${
                    dadosMes.homens
                  } ${dadosMes.homens === 1 ? "homem" : "homens"} e ${
                    dadosMes.mulheres
                  } ${dadosMes.mulheres === 1 ? "mulher" : "mulheres"}`}</p>
                ))}

                <p>{`Total: ${dadosCidade.total}`}</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default App;
