const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "cadastro-jf",
});

app.use(cors());
app.use(express.json());

app.get("/getCliente", (req, res) => {
  let sql = "select * from cliente";

  db.query(sql, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
});

app.post("/adicionar", (req, res) => {
  const { s_nome_cliente, s_sexo_cliente, d_data_cliente, s_cidade_cliente } =
    req.body;

  const sql =
    "insert into cliente (s_nome_cliente, s_sexo_cliente, d_data_cliente, s_cidade_cliente) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [s_nome_cliente, s_sexo_cliente, d_data_cliente, s_cidade_cliente],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Erro ao adicionar cliente.");
      } else {
        res.send("Cliente adicionado com sucesso!");
      }
    }
  );
});

app.delete("/excluir/:id", (req, res)=>{
    const { id } = req.params

    let sql = "delete from cliente where i_codcontato_cliente=?"

    db.query(sql, [id], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

app.put("/editar", (req, res) => {
    const { i_codcontato_cliente, s_nome_cliente, s_sexo_cliente, d_data_cliente, s_cidade_cliente } = req.body;

    let sql = "update cliente set s_nome_cliente = ?, s_sexo_cliente = ?, d_data_cliente = ?, s_cidade_cliente = ? where i_codcontato_cliente = ?";

    db.query(sql, [s_nome_cliente, s_sexo_cliente, d_data_cliente, s_cidade_cliente, i_codcontato_cliente], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Erro ao editar cliente");
        } else {
            res.send(result);
        }
    });
});


app.listen(3001, () => {
  console.log("Rodando servidor");
});
