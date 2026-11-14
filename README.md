# Padaria Fafe: site

Site institucional da [Padaria Fafe](https://www.padariafafe.com), no Jabaquara (SP), desde 1990.
É HTML, CSS e JavaScript puros, sem framework e sem etapa de build.

## Como rodar localmente

O cardápio é carregado com `fetch()`, e o navegador bloqueia `fetch` em arquivos abertos direto do disco (`file://`). Por isso, rode um servidor local **na pasta do projeto**. Escolha uma das opções:

- **VS Code:** instale a extensão *Live Server*, abra a pasta do projeto e clique em **Go Live**.
- **Python:** `python -m http.server 8000` e abra http://localhost:8000

Os caminhos começam com `/` (ex.: `/assets/css/style.css`), então o servidor precisa ser aberto na raiz do projeto, e não numa subpasta.

## Estrutura

```
index.html              Início
a-padaria/index.html    A Padaria        -> /a-padaria/
cardapio/index.html     Cardápio         -> /cardapio/
fotos/index.html        Fotos            -> /fotos/
promocoes/index.html    Promoções        -> /promocoes/
contato/index.html      Contato          -> /contato/
404.html                Página de erro (Vercel/Netlify usam automaticamente)

assets/css/style.css    Estilo único, mobile-first
assets/js/main.js       Usado em todas as páginas (ano do rodapé, menu)
assets/js/cardapio.js   Monta o cardápio a partir do JSON (busca e links de WhatsApp)
assets/js/galeria.js    Visualizador de fotos (<dialog>)
assets/js/contato.js    Envio do formulário pelo Formspree
assets/img/             Fotos otimizadas (WebP), logo e ícones (icones.svg)

dados/cardapio.json     157 produtos em 6 categorias (na fase 3 vira a API)
docs/                   Inventário do site antigo (textos, pendências, mapa de imagens)
ferramentas/            Script que gera as fotos otimizadas
imagens/                Fotos originais (fora do Git, ver .gitignore)
```

## Tarefas comuns

**Mudar um produto do cardápio:** edite `dados/cardapio.json`. O HTML não muda.

**Adicionar uma foto:** coloque o original em `imagens/`, acrescente uma linha em `FOTOS` no
`ferramentas/otimizar_imagens.py` e rode `python ferramentas/otimizar_imagens.py`
(requer `python -m pip install pillow`). Depois use as versões `nome.webp` e `nome-p.webp` no HTML.

**Mudar cabeçalho ou rodapé:** eles se repetem nas 7 páginas HTML. Use *Localizar e substituir em arquivos* do VS Code (Ctrl+Shift+H).

## Formulário de contato (Formspree)

1. Crie uma conta grátis em https://formspree.io com o e-mail que deve receber as mensagens.
2. Crie um formulário e copie o ID dele (ex.: `xyzabcde`).
3. Em `contato/index.html`, troque o ID em `action="https://formspree.io/f/..."` pelo novo.
   O formulário oficial da padaria é o `mdegavga`.

O plano grátis aceita 50 mensagens por mês. O campo oculto `_gotcha` serve de filtro anti-spam.
