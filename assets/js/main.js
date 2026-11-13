// Scripts usados em todas as páginas.
// O site funciona sem JavaScript; isto só melhora a experiência.

// Ano atual no rodapé (evita esquecer de atualizar todo ano)
document.querySelectorAll("[data-ano]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Guarda a altura do cabeçalho fixo numa variável CSS (--altura-topo),
// para a barra de busca do cardápio "grudar" logo abaixo dele.
const topo = document.querySelector(".topo");
if (topo) {
  const atualizar = () =>
    document.documentElement.style.setProperty("--altura-topo", `${topo.offsetHeight}px`);
  atualizar();
  window.addEventListener("resize", atualizar);
}

// No celular, rola o menu até o link da página atual (ele pode estar escondido à direita)
// (mexe só no scroll horizontal do menu, não no da página)
const menu = document.querySelector(".menu");
const atual = menu?.querySelector('a[aria-current="page"]');
if (menu && atual) {
  menu.scrollLeft = atual.offsetLeft - (menu.clientWidth - atual.offsetWidth) / 2;
}
