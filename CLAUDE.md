# Site da Padaria Fafe

Projeto do Lucca: refazer o site da padaria da mãe dele, que hoje está no Wix (www.padariafafe.com), com código próprio. Ele estuda Sistemas de Informação (FIAP, 2º semestre), quer ser Full Stack com base em Java/BD e prefere entender o panorama antes de executar. Explique o porquê das decisões; não entregue só o código.

## Contexto já levantado

- O site atual é só informativo, com 6 páginas: Home, Nossa Padaria, Produtos/cardápio, Fotos, Promoções e Contato. Não tem loja, pagamento nem CMS. O delivery é por telefone/WhatsApp e iFood.
- Os únicos recursos dinâmicos são o formulário de contato (nome, e-mail, assunto, mensagem), o de newsletter e um Google Maps.
- A conta Wix tem o Plano Premium Essencial (anual, próxima cobrança em 9/abr/2027) e o domínio padariafafe.com, comprado no Wix (anual, próxima cobrança em 29/mar/2027).

## Decisões

- **O domínio fica no Wix.** No lançamento, apontar os registros A/CNAME (Domínios → Gerenciar registros DNS) para o novo host e cancelar só o Plano Premium antes de 9/abr/2027.
- **O site deve ser simples:** primeiro estático, com back-end depois.

## Arquivos desta pasta

Esta pasta é a raiz do repositório https://github.com/AugustinhoLucca/WebSite_PadariaFafe. A estrutura do site está descrita no `README.md`.

- `docs/conteudo-site.md`: todo o texto das páginas, contatos, links, URLs atuais e sugeridas, e pendências a revisar com a dona
- `dados/cardapio.json`: 157 produtos em 6 categorias (bolos, beirutes, tábuas de frios, lanches, sanduíches de metro, pizzas). O campo `preco` está null porque o site não informa preços. Os erros de digitação listados no inventário já foram corrigidos, menos "Madacaru", que ainda precisa ser confirmado.
- `imagens/`: 55 imagens originais, por página, fora do Git. `docs/imagens.csv` mapeia cada uma ao link original. 4 são de stock do Wix e não foram usadas. As versões web ficam em `assets/img/` e são geradas por `ferramentas/otimizar_imagens.py`.

## Convenções do código

- HTML, CSS e JS puros, sem build. Os caminhos são absolutos (`/assets/...`), então é preciso servir a partir desta pasta.
- O cabeçalho e o rodapé se repetem nos 7 HTML. Uma mudança neles precisa ser aplicada em todos.
- O WhatsApp dos links `wa.me` é o número novo, 5511913221450.

## Plano

**Fase 0, inventário:** concluída. Conteúdo e imagens exportados. Ainda falta revisar preços, itens e promoções com a mãe.

**Fase 1, front-end estático:** primeira versão pronta em 13/11/2026. Falta configurar o ID do Formspree em `contato/index.html` e revisar o conteúdo com a mãe (pendências em `docs/conteudo-site.md`).
1. Repositório no GitHub
2. Páginas em HTML/CSS, responsivas e pensadas pro celular: `/`, `/a-padaria`, `/cardapio`, `/fotos`, `/promocoes`, `/contato`
3. Botão de WhatsApp em destaque e link pro iFood
4. Título e descrição de SEO em cada página
5. Formulário de contato via serviço externo (ex.: Formspree), sem back-end
6. O cardápio pode ser renderizado em JS a partir do `cardapio.json`, o que já prepara a fase 3

**Fase 2, publicação:** Vercel ou Netlify, com teste no endereço provisório, aprovação da mãe, DNS apontado no Wix e cancelamento do plano.

**Fase 3, back-end Java (portfólio):** tabelas `categoria`/`produto`/`promocao`, API Spring Boot (leitura pública e CRUD com login), painel admin pra mãe editar o cardápio, front consumindo a API e hospedagem em Render/Railway.
