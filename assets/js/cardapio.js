// Monta o cardápio a partir de /dados/cardapio.json.
//
// Por que via JS e não escrito direto no HTML?
// 157 produtos escritos à mão no HTML seriam difíceis de manter. Com os dados
// separados da apresentação, mudar um item é mexer só no JSON. Na fase 3,
// basta trocar a URL abaixo pela da API Spring Boot (ex.: /api/categorias):
// se a API devolver o mesmo formato, o resto deste arquivo não muda.
const URL_CARDAPIO = "/dados/cardapio.json";

const WHATSAPP = "5511913221450";

// Foto de capa de cada categoria (na fase 3 isto vira uma coluna da tabela categoria)
const FOTOS_CATEGORIAS = {
  bolos: { src: "bolos", alt: "Bolos decorados com frutas e chocolate" },
  "tabuas-de-frios": { src: "tabua-frios", alt: "Tábua de frios decorada" },
  lanches: { src: "sanduiche-baguete", alt: "Sanduíche de baguete com presunto e queijo" },
  pizzas: { src: "pizza-04", alt: "Pizza de mussarela com tomate e azeitonas" },
};

// Rótulos dos campos extras dos bolos
const CAMPOS_BOLO = [
  ["base", "Massa"],
  ["frutas", "Frutas"],
  ["recheio", "Recheio"],
  ["cobertura", "Cobertura"],
];

const alvo = document.querySelector("#cardapio");
const atalhos = document.querySelector("#atalhos");
const busca = document.querySelector("#busca");

// Cria um elemento com texto. Usar textContent (e não innerHTML com os dados)
// evita que um texto vindo do banco seja interpretado como HTML: é a defesa
// básica contra XSS, que vai importar quando a mãe editar pelo painel admin.
function el(tag, props = {}, ...filhos) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...filhos.filter(Boolean));
  return node;
}

function linkWhatsApp(produto, categoria) {
  const texto = `Olá! Gostaria de encomendar: ${produto.nome} (${categoria.nome}, cód. ${produto.codigo}).`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

function criarProduto(produto, categoria) {
  const li = el("li", { className: "produto" });

  li.append(
    el("div", { className: "produto-topo" },
      el("h3", { textContent: produto.nome }),
      el("span", { className: "produto-codigo", textContent: `cód. ${produto.codigo}` }),
    ),
  );

  if (produto.descricao) li.append(el("p", { textContent: produto.descricao }));

  const detalhes = CAMPOS_BOLO.filter(([campo]) => produto[campo]);
  if (detalhes.length) {
    const dl = el("dl");
    detalhes.forEach(([campo, rotulo]) =>
      dl.append(el("dt", { textContent: rotulo }), el("dd", { textContent: produto[campo] })),
    );
    li.append(dl);
  }

  li.append(
    el("a", {
      className: "produto-pedir",
      href: linkWhatsApp(produto, categoria),
      target: "_blank",
      rel: "noopener",
      textContent: "Encomendar pelo WhatsApp",
    }),
  );

  // Texto usado pela busca: tudo em minúsculas e sem acento
  li.dataset.busca = normalizar(
    [produto.nome, produto.codigo, produto.descricao, ...CAMPOS_BOLO.map(([c]) => produto[c])].join(" "),
  );
  return li;
}

function criarCategoria(categoria) {
  const secao = el("section", { className: "categoria", id: categoria.id });
  secao.setAttribute("aria-labelledby", `titulo-${categoria.id}`);

  const cabecalho = el("div", { className: "categoria-cabecalho" },
    el("h2", { id: `titulo-${categoria.id}`, textContent: categoria.nome }),
  );
  const foto = FOTOS_CATEGORIAS[categoria.id];
  if (foto) {
    cabecalho.append(el("img", {
      src: `/assets/img/${foto.src}-p.webp`,
      srcset: `/assets/img/${foto.src}-p.webp 600w, /assets/img/${foto.src}.webp 1200w`,
      sizes: "(min-width: 1120px) 1088px, 100vw",
      alt: foto.alt,
      loading: "lazy",
      width: 600,
      height: 263,
    }));
  }
  if (categoria.observacao) {
    cabecalho.append(el("p", { className: "categoria-obs", textContent: categoria.observacao }));
  }

  const lista = el("ul", { className: "produtos" });
  categoria.produtos.forEach((p) => lista.append(criarProduto(p, categoria)));

  secao.append(cabecalho, lista);
  return secao;
}

function normalizar(texto) {
  return String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // remove acentos: "pão" -> "pao"
}

function filtrar() {
  const termo = normalizar(busca.value.trim());
  let visiveis = 0;

  document.querySelectorAll(".categoria").forEach((secao) => {
    let naCategoria = 0;
    secao.querySelectorAll(".produto").forEach((item) => {
      const mostra = !termo || item.dataset.busca.includes(termo);
      item.hidden = !mostra;
      if (mostra) naCategoria++;
    });
    secao.hidden = naCategoria === 0;
    visiveis += naCategoria;
  });

  document.querySelector(".cardapio-vazio").hidden = visiveis > 0;
}

async function iniciar() {
  try {
    const resposta = await fetch(URL_CARDAPIO);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();

    alvo.replaceChildren(
      ...dados.categorias.map(criarCategoria),
      el("p", { className: "cardapio-vazio", hidden: true,
        textContent: "Nenhum produto encontrado. Tente outra palavra ou fale com a gente pelo WhatsApp." }),
    );

    atalhos.replaceChildren(
      ...dados.categorias.map((c) =>
        el("li", {}, el("a", { href: `#${c.id}`, textContent: c.nome })),
      ),
    );

    busca.addEventListener("input", filtrar);

    // Se a página abriu com #categoria na URL, rola até ela agora que existe
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  } catch (erro) {
    console.error("Erro ao carregar o cardápio:", erro);
    alvo.replaceChildren(
      el("p", { className: "cardapio-erro" },
        "Não foi possível carregar o cardápio agora. ",
        el("a", { href: `https://wa.me/${WHATSAPP}`, textContent: "Peça pelo WhatsApp" }),
        " ou ligue (11) 5588-4565.",
      ),
    );
  }
}

iniciar();
