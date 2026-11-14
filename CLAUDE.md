# Site da Padaria Fafe

Projeto do Lucca: refazer o site da padaria da mãe dele, que hoje está no Wix (www.padariafafe.com), com código próprio. Ele estuda Sistemas de Informação (FIAP, 2º semestre), quer ser Full Stack com base em Java/BD e prefere entender o panorama antes de executar. Explique o porquê das decisões; não entregue só o código.

## Contexto já levantado

- O site atual é só informativo, com 6 páginas: Home, Nossa Padaria, Produtos/cardápio, Fotos, Promoções e Contato. Não tem loja, pagamento nem CMS. O delivery é por telefone/WhatsApp e iFood.
- Os únicos recursos dinâmicos são o formulário de contato (nome, e-mail, assunto, mensagem), o de newsletter e um Google Maps.
- A conta Wix tem o Plano Premium Essencial (anual, próxima cobrança em 9/abr/2027) e o domínio padariafafe.com, comprado no Wix (anual, próxima cobrança em 29/mar/2027).

## Decisões

- **O domínio fica no Wix.** No lançamento, apontar os registros A/CNAME (Domínios → Gerenciar registros DNS) para o novo host e cancelar só o Plano Premium antes de 9/abr/2027.
- **O site deve ser simples:** primeiro estático, com back-end depois.
- **Newsletter fica de fora por enquanto.** O público da padaria está no WhatsApp e no Instagram, e não há quem envie e-mails com frequência. Se a mãe quiser, dá pra fazer com o Formspree ou, na fase 3, com uma tabela `inscrito`.
- **Visual:** paleta tirada do logo (variáveis no topo de `style.css`). O layout ocupa a largura da tela. O hero tem foto em tela cheia com película escura em degradê (`.hero::after`).

## Arquivos desta pasta

Esta pasta é a raiz do repositório https://github.com/AugustinhoLucca/WebSite_PadariaFafe. A estrutura do site está descrita no `README.md`.

- `docs/conteudo-site.md`: todo o texto das páginas, contatos, links, URLs atuais e sugeridas, e pendências a revisar com a dona
- `dados/cardapio.json`: 157 produtos em 6 categorias (bolos, beirutes, tábuas de frios, lanches, sanduíches de metro, pizzas). O campo `preco` está null porque o site não informa preços. Os erros de digitação listados no inventário já foram corrigidos, menos "Madacaru", que ainda precisa ser confirmado.
- `imagens/`: originais, por página, fora do Git (backup em `../PadariaFafe.zip`, que não inclui as adições feitas depois do inventário). `docs/imagens.csv` registra a origem de cada uma.
  - 55 vieram do Wix. 4 delas são de stock e não foram usadas.
  - 6 foram recriadas com IA (Gemini) pelo Lucca, com o sufixo `-gemini`: o hero, as 4 capas do cardápio e a vitrine de docinhos da página A Padaria. Têm 1376 × 768 px.
  - Em 14/11/2026 o Lucca enviou mais 3, sem o sufixo: o frango assado (card da home) e as capas de Beirutes e Sanduíches de metro. Agora todas as 6 categorias do cardápio têm capa.
  - `06-contato/` tem duas logos baixadas (WhatsApp e iFood) com transparência falsa: o xadrez faz parte da imagem. Não servem para o site.
- `assets/img/`: versões web em WebP, geradas por `ferramentas/otimizar_imagens.py`. São `nome.webp` (1200 px) e `nome-p.webp` (600 px), mais `nome-g.webp` (até 1920 px) para as fotos do conjunto `GRANDES`.

## Convenções do código

- HTML, CSS e JS puros, sem build. Os caminhos são absolutos (`/assets/...`), então é preciso servir a partir desta pasta.
- O cabeçalho e o rodapé se repetem nos 7 HTML. Uma mudança neles precisa ser aplicada em todos.
- O WhatsApp dos links `wa.me` é o número novo, 5511913221450.
- O Lucca também edita os arquivos direto (textos, rodapé, posição das seções). Antes de mexer, leia o estado atual e preserve as mudanças dele. Quando ele muda algo que se repete, como o rodapé, replique nas outras páginas.
- **Ícones:** ficam em `assets/img/icones.svg` (sprite com `<symbol>`), usados com `<svg><use href="/assets/img/icones.svg#nome">`. A raiz do arquivo é `<s:svg>` de propósito, porque o Live Server injeta um script antes de qualquer `</svg>` e quebra o sprite. Não escreva `</svg>` nesse arquivo, nem em comentário.
- **Testar localmente:** com o Live Server do VS Code. Como o workspace aberto é a pasta de cima (`Desktop\PadariaFafe`), o `../.vscode/settings.json` define `liveServer.settings.root` como `/PadariaFafe`. Alternativa: `python -m http.server` nesta pasta.
- **O que vai pro site:** a Vercel publica tudo o que está no repositório, menos o que estiver no `.vercelignore` (CLAUDE.md, README, `docs/`, `ferramentas/`). Ao criar um arquivo interno novo, inclua ele lá.
- **Cores das marcas nos botões:** `.botao--whats`, `.botao--ifood` e `.botao--instagram`. O rosa (`#d62976`) e o verde foram escolhidos pelo contraste AA com texto branco.

## Plano

**Fase 0, inventário:** concluída. Conteúdo e imagens exportados. Ainda falta revisar preços, itens e promoções com a mãe.

**Fase 1, front-end estático:** pronta e enviada ao GitHub em 13/11/2026 (branch `main`). Feito:
- 6 páginas mobile-first e uma 404, com SEO (title, description, Open Graph e JSON-LD `Bakery`), `sitemap.xml` e `robots.txt`
- Botões de WhatsApp, iFood e Instagram, mais o botão flutuante do WhatsApp
- Cardápio montado em JS a partir do `cardapio.json`, com busca e "Encomendar pelo WhatsApp" em cada item
- Formulário de contato via Formspree, galeria com `<dialog>` e mapa do Google na home e no Contato

Pendências antes do lançamento:
- [x] Preço do frango assado atualizado pelo Lucca para R$ 48,90 (14/11/2026).
- [x] Conteúdo aprovado pela mãe para o lançamento (14/11/2026). Ainda vale confirmar com ela, sem bloquear o lançamento: promoção do Guaraná, "Madacaru", número novo do WhatsApp e os textos curtos dos cards, escritos na fase 1. A lista completa está em `docs/conteudo-site.md`.
- [x] Imagens geradas por IA aprovadas pela mãe junto com o site (14/11/2026). Na vitrine de docinhos aparecem preços (R$ 4,00 e R$ 4,90) e nomes com erro nas plaquinhas.
- [x] Formspree oficial da padaria configurado (`mdegavga`), no lugar do provisório.
- [ ] Logo do iFood: o botão ainda usa um ícone genérico de sacola. A ideia é pegar o SVG oficial (Wikimedia Commons, "IFood logo.svg") e pôr no sprite.
- [ ] Opcional: foto do hero com 1920 px ou mais (a atual tem 1376 px).

**Fase 2, publicação** (em andamento desde 14/11/2026, com o site autorizado pela mãe): conectar o repositório do GitHub à Vercel ou à Netlify, que publicam sozinhas a cada push, com teste no endereço provisório, aprovação da mãe, DNS apontado no Wix e cancelamento do plano.

**Fase 3, back-end Java (portfólio):** tabelas `categoria`/`produto`/`promocao`, API Spring Boot (leitura pública e CRUD com login), painel admin pra mãe editar o cardápio, front consumindo a API e hospedagem em Render/Railway.
