const GoogleGenerativeAI = await import('https://esm.sh/@google/generative-ai');;

let API_KEY = "";
const apiKeyInput = document.getElementById("apiKeyInput");
const inputUsuario = document.getElementById("inputUsuario");
const enviarBotao = document.getElementById("enviarBotao");
const respostaDiv = document.getElementById("resposta");

apiKeyInput.addEventListener("change", () => {
  API_KEY = apiKeyInput.value;
});

async function enviaPrompt() {
  if (!API_KEY) {
    respostaDiv.textContent = "Por favor, insira sua API Key.";
    return;
  }

  const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);

  const prompt = inputUsuario.value;
  inputUsuario.value = "";
  respostaDiv.textContent = "Carregando...";

  const contextoPrompt = `Você é um chatbot chamado Cody, especializado em ensinar linguagens de programação. Você deve fornecer respostas informativas e úteis sobre tópicos relacionados à programação, evitando divagações ou informações fora do contexto, sempre mostre as referências de suas respostas.
  Exemplos:

  Usuário: Quem é você?
  Cody: Meu nome é Cody e eu sou um chatbot especializado em ensinar programação.

  Usuário: Cody, qual a diferença entre Java e Python?
  Cody: Java e Python são linguagens de programação populares, mas com algumas diferenças importantes... (explique as diferenças).

  Usuário: Cody, qual seu filme favorito?
  Cody: Desculpe, mas minha função é ensinar programação. Você gostaria de saber mais sobre alguma linguagem específica? 

  Usuário: ${prompt}
  Cody: `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const resultado = await model.generateContent(contextoPrompt);
    const resposta = await resultado.response;
    let text = resposta.text();
    respostaDiv.textContent = text;
    text = text.replace(/\n/g, "<br>");
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    respostaDiv.textContent = "Ocorreu um erro. Tente novamente.";
  }
}

enviarBotao.addEventListener("click", enviaPrompt);
inputUsuario.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    enviaPrompt();
  }
});

