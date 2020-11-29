const moment = require("moment");
const connection = require("../infra/connection");

class Atendimento {
  lista(res) {
    const sql = "SELECT * FROM Atendimentos";

    connection.query(sql, (err, result) => {
      if(err) {
        res.status(400).json(err);
      } else {
        res.json(result);
      }
    })
  };

  buscaId(id, res) {
    const sql = `SELECT * FROM Atendimentos WHERE id=${id}`; 
    
    connection.query(sql, (err, result) => {
      const atendimento = result[0];
      if(err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(atendimento);
      }
    })
  };

  adiciona(atendimento, res) {
    const dataAgendamento = moment().format("YYYY-MM-DD HH:mm:ss");
    const data = moment(atendimento.data, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss");
    const dataValida = moment(data).isSameOrAfter(dataAgendamento);
    const clienteValido = atendimento.cliente.length >= 5;
    console.log(data, dataAgendamento, dataValida)

    const validacoes = [
      {
        nome: "data",
        valido: dataValida,
        mensagem: "Data deve ser maior ou igual a atual"
      },
      {
        nome: "cliente",
        valido: clienteValido,
        mensagem: "Cliente deve ter pelo menos 5 caracteres"
      }
    ];

    const erros = validacoes.filter(campo => !campo.valido);
    const existemErros = erros.length;

    if(existemErros) {
      return res.status(400).json(erros);
    }

    const atendimentoDatado = {...atendimento, dataAgendamento, data};
    const sql = "INSERT INTO Atendimentos SET ?";

    connection.query(sql, atendimentoDatado, (err, result) => {
      if(err) {
        res.status(400).json(err);
      } else {
        res.status(201).json(atendimento);
      }
    })
  };

  altera(id, valores, res) {
    if(valores.data) {
      valores.data = moment(valores.data, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss");
    }
    const sql = `UPDATE Atendimentos SET ? WHERE id=?`;

    connection.query(sql, [valores, id], (err, result) => {
      if(err) {
        return res.status(400).json(err);
      } else {
        return res.status(200).json({...valores, id});
      }
    })
  };

  deleta(id, res) {
    const sql = "DELETE FROM Atendimentos WHERE id=?";

    connection.query(sql, id, (err, result) => {
      if(err) {
        res.status(400).json(err);
      } else {
        res.status(200).json({id});
      }
    })
  }
}

module.exports = new Atendimento;