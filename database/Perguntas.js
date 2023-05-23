//Arquivos models, letra maiúscula
const Sequelize = require("sequelize");
const conexao = require("./database");

//Criando tabela no MySQL
const Pergunta = conexao.define('perguntas', { //chama a conexao com o banco de dados e o define com o nome da tabela que quer criar
    titulo:{
        type: Sequelize.STRING, //Para criar um campo na tabela, nome: tipo de campo:
        allowNull: false //Se vai permitir o campo ficar vazio ou não
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(() => {

}); //CREATE TABLE SQL (Se a tabela já existir, ele não vai criar novamente, impedindo duplicar a tabela ou erros)

module.exports = Pergunta;