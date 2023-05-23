const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const conexao = require("./database/database");
const Perguntas = require("./database/Perguntas");
const Resposta = require("./database/Resposta"); 

//Banco de dados
conexao
    .authenticate() //Tentar autenticar a conexao com o banco de dados
    .then(() => {
        console.log("Conexão feita com o Banco de Dados!") // Se a conexão for feita com sucesso 
    })
    .catch((msgErro) => {
        console.log(msgErro); //Se ocorrer algum erro
    })

//Dizendo para o Express que quero usar o EJS para renderizar HTML
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Body Parser
app.use(bodyParser.urlencoded({extended: false})) //essa linha vai permitir que o body parser receba os dados do formulario e use no JS (decodificar)
app.use(bodyParser.json());

//Rotas
app.get("/", (req, res) => {
    Perguntas.findAll({ raw: true, order:[
        ['id','DESC'] //ASC = Crescente || DESC = Decrescente
    ]}).then(perguntas => { //SELECT * FROM SQL (RAW:TRUE É PARA TRAZER SOMENTE OS DADOS DE FORMA CRUA)
        res.render("index",{
            perguntas: perguntas
        });
    });
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
})

app.post("/salvarpergunta", (req, res) => {

    let titulo = req.body.titulo; //o name do campo titulo do formulario
    let descricao = req.body.descricao; //o name do campo descricao do formulario

    Perguntas.create({ //INSERT INTO SQL
        //Dados do post para o Banco de dados
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/"); //Caso seja feito o INSERT INTO ele vai redirecionar o usuario
    }) 
})

app.get("/pergunta/:id", (req, res) => {
    let id_pergunta = req.params.id; //id da perguntar no banco de dados
    Perguntas.findOne({ //select da pergunta
        where: {id: id_pergunta} // {coluna: parametro}
    }).then(pergunta => {
        if(pergunta != undefined){ //se a pergunta for achada

            Resposta.findAll({
                where: {perguntaId: pergunta.id}, //pesquisando respostas atreladas ao ID da pergunta
                order: [ 
                    ['id', 'DESC']
                ] //ordenando as respostas pelo ID de forma decrescente
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta, //exportando a pergunta para a view
                    respostas: respostas //passando respostas para a view
                }); //A pagina a ser exibida
            });

        } else { //Pergunta não encontrada
            res.redirect("/") //redirecionar o usuario
        }
    })

})

app.post("/responder", (req, res) => { //recebendo formulario da resposta
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;

    Resposta.create({ //tratando variaveis de metodo post CREATE MYSQL
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId) //redirecionando para a pagina da pergunta
    });
})

app.listen(8080, () => {
    console.log("App rodando em http://localhost:8080"); //Definindo qual porta o aplicativo vai rodar
})