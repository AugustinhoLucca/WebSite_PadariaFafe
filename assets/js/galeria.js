// Abre as fotos da galeria em tela cheia, usando o elemento <dialog> nativo.
// O <dialog> já cuida de: fundo escuro, fechar com Esc e prender o foco
// dentro dele (acessibilidade), sem precisar de biblioteca.
//
// Sem JavaScript, cada miniatura continua sendo um link para a foto grande.

const fotos = [...document.querySelectorAll(".galeria a")];
const dialogo = document.querySelector(".lightbox");

if (fotos.length && dialogo) {
  const img = dialogo.querySelector("img");
  const legenda = dialogo.querySelector("figcaption");
  let atual = 0;

  const mostrar = (i) => {
    atual = (i + fotos.length) % fotos.length; // volta ao início depois da última
    const link = fotos[atual];
    img.src = link.href;
    img.alt = link.querySelector("img").alt;
    legenda.textContent = link.querySelector("img").alt;
  };

  fotos.forEach((link, i) =>
    link.addEventListener("click", (evento) => {
      evento.preventDefault(); // não navega para o arquivo da foto
      mostrar(i);
      dialogo.showModal();
    }),
  );

  dialogo.querySelector(".lightbox-fechar").addEventListener("click", () => dialogo.close());
  dialogo.querySelector(".lightbox-anterior").addEventListener("click", () => mostrar(atual - 1));
  dialogo.querySelector(".lightbox-proxima").addEventListener("click", () => mostrar(atual + 1));

  // Setas do teclado
  dialogo.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") mostrar(atual - 1);
    if (e.key === "ArrowRight") mostrar(atual + 1);
  });

  // Clicar no fundo escuro fecha
  dialogo.addEventListener("click", (e) => {
    if (e.target === dialogo || e.target.tagName === "FIGURE") dialogo.close();
  });

  // Deslizar o dedo para os lados no celular
  let inicioX = null;
  dialogo.addEventListener("touchstart", (e) => (inicioX = e.touches[0].clientX), { passive: true });
  dialogo.addEventListener("touchend", (e) => {
    if (inicioX === null) return;
    const distancia = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(distancia) > 50) mostrar(atual + (distancia < 0 ? 1 : -1));
    inicioX = null;
  });
}
