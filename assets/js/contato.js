// Envia o formulário de contato pelo Formspree sem sair da página.
//
// Como funciona: o Formspree recebe o POST e encaminha a mensagem para o
// e-mail cadastrado na conta. Assim não precisamos de back-end agora.
// Sem JavaScript, o <form> faz um POST comum e o Formspree mostra a própria
// página de "obrigado"; com JavaScript, mostramos a confirmação aqui mesmo.

const form = document.querySelector("#form-contato");
const status = document.querySelector(".formulario-status");

form?.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const botao = form.querySelector("button[type=submit]");
  botao.disabled = true;
  status.className = "formulario-status";
  status.textContent = "Enviando…";

  try {
    const resposta = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }, // pede resposta em JSON em vez de HTML
    });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

    form.reset();
    status.classList.add("formulario-status--ok");
    status.textContent = "Mensagem enviada! Responderemos em breve.";
  } catch (erro) {
    console.error(erro);
    status.classList.add("formulario-status--erro");
    status.textContent = "Não foi possível enviar. Tente pelo WhatsApp ou pelo telefone (11) 5588-4565.";
  } finally {
    botao.disabled = false;
  }
});
