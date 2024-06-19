// Importando o mysql2
var mysql = require("mysql2");

// Configuração para acessar o banco de dados
var conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "electron-teste",
});

// Criando uma função para conectar ao MySQL
function conectarBancoDeDados() {

  // Conectando ao MySQL
  conexao.connect(function (error) {
    if (error) {
      console.log(`Ocorreu um erro ao conectar no banco de dados: ${error.code}`);
      console.log(`Ocorreu um erro ao conectar no banco de dados: ${error.fatal}`);
    } else {
      console.log("Conectado ao banco de dados com sucesso!");
    }
  });
}

// Função responsável por adicionar item pelo evento de onkeypress no input
function adicionarItemPelaTecla(event) {
  // Pegando o tipo da tecla pelo evento
  var tecla = event.key;

  // Verificando se a tecla pressionada é o Enter
  if (tecla === "Enter") {
    // Chamando a função responsável por adicionar item
    adicionarItem();
  }
}

function adicionarItem() {
  // Invocando a função conectarAoBancoDeDados
  conectarBancoDeDados();

  // Pegando o valor do input
  var elementoInput = document.getElementById("input-tarefa");

  // Verificando se o input esta vazio
  if (elementoInput.value === "") {
    return;
  }
  // Pegando o valor do input
  var valorInput = elementoInput.value;

  // Pegando a tag UL do nosso HTML pelo ID
  var minhaTagUL = document.getElementById("lista-de-tarefas");

  // Criando tag LI com JavaScript
  var criarTagLI = document.createElement("li");

  // Adicionando um evento de click para a tag <li>
  criarTagLI.addEventListener("click", concluirTarefa);

  // Criando uma tag em negrito
  var tagRemover =
    "<i onclick='removerItem(event)' class='fa-solid fa-circle-minus'></i>";

  // Adicionando um texto para nossa tag li criada
  criarTagLI.innerHTML = valorInput + tagRemover;

  // Adicionando a tag li para nossa ul
  minhaTagUL.appendChild(criarTagLI);


  var query = `INSERT INTO todo_list (item, concluido) VALUES ("${valorInput}", false)`;
  conexao.query(query, function (error) {
    if (error) {
      console.log('Erro ao inseririr a tarefa', error);
    } else {
      console.log('Tarefa inserida com sucesso!');
    }
  })

  // Limpando o valor do input
  var input = document.getElementById("input-tarefa");
  input.value = "";
}

// Função responsável por remover item
function removerItem(event) {
  // Invocando a função carregarTarefasDoBancoDeDados
  carregarTarefasDoBancoDeDados();

  // Pegando tag <i> dentro do nosso event
  var meuIcone = event.target;

  // Pegando a tag <li> através da minha tag <i> com propriedade parentElement
  var minhaLi = meuIcone.parentElement;

  // Excluindo a tag <li> com a função remove()
  minhaLi.remove();

  // Criando a query para remover a tarefa e usando textContent para pegar o valor
  var query = `DELETE FROM todo_list WHERE item = "${minhaLi.textContent}"`;

  // Executando a query
  conexao.query(query, function (error) {
    if (error) {
      console.log('Erro ao remover a tarefa', error);
    } else {
      console.log('Tarefa removida com sucesso!');
    }
  })
}

// Função responsável por concluir tarefa
function concluirTarefa(event) {
  var query
  // Pegando tag <li> dentro do nosso event
  var minhaTagLi = event.target;

  if (minhaTagLi.className === "concluida") {

    // Criando a query para editar a tarefa caso seja concluída  
    query = `UPDATE todo_list SET concluido = false WHERE item = "${minhaTagLi.textContent}"`;

    // Executando a query
    conexao.query(query, function (error) {
      if (error) {
        console.log('Erro ao concluir a tarefa', error);
      } else {
        console.log('Tarefa concluída com sucesso!');
      }
    })

    // Removendo a classe concluída e deixa a tag sem concluir
    minhaTagLi.className = "";

  } else {
    // Criando a query para editar a tarefa caso seja concluída
    query = `UPDATE todo_list SET concluido = true WHERE item = "${minhaTagLi.textContent}"`;
    
    // Executando a query
    conexao.query(query, function (error) {
      if (error) {
        console.log('Erro ao concluir a tarefa', error);
      } else {
        console.log('Tarefa concluída com sucesso!');
      }
    })

    // Adicionando a classe concluída
    minhaTagLi.className = "concluida";
  }
}

// Função responsável por carregar as tarefas
function carregarTarefasDoBancoDeDados() {

  // Invocando a função conectarBancoDeDados
  conectarBancoDeDados()

  // Criando a query para selecionar as tarefas
  var query = `SELECT * FROM todo_list`;

  // Executando a query
  conexao.query(query, function (error, resultado) {
    if (error) {
      console.log("Erro ao selecionar as tarefas:", error);
    } else {
      console.log("Tarefas selecionadas com sucesso!");
    }

    // Percorrendo o resultado
    resultado.forEach(function (resultado) {
      console.log(resultado)

    })
  });
}

// Invocando a função carregarTarefasDoBancoDeDados
carregarTarefasDoBancoDeDados();