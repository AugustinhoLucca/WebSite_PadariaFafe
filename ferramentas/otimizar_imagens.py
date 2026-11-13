"""Gera as versões web das fotos da padaria.

Por que existe: as fotos originais (pasta imagens/, ~49 MB) vêm do celular e
do Wix com até 4704 px e 6 MB cada. No celular do cliente, isso deixa o site
lento e gasta o plano de dados. Este script cria duas versões de cada foto
em WebP (formato ~30% menor que JPEG e suportado por todos os navegadores
atuais):

    assets/img/<nome>.webp     -> até 1200 px de largura (tela cheia/lightbox)
    assets/img/<nome>-p.webp   -> até 600 px (cards e miniaturas)

O HTML escolhe entre as duas com o atributo srcset.

Uso (precisa do Pillow: python -m pip install pillow):
    python ferramentas/otimizar_imagens.py

Para adicionar uma foto nova: coloque o original em imagens/, acrescente uma
linha no dicionário FOTOS abaixo e rode o script de novo.
"""
from pathlib import Path

from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "imagens"
DESTINO = RAIZ / "assets" / "img"

# original (relativo a imagens/)  ->  nome novo (sem extensão)
# Ficaram de fora 4 imagens de banco do Wix (textura de folhas, panela
# desenhada, cozinheira de desenho e frutas com respingo) e os ícones de
# iFood/WhatsApp/Instagram, que viraram SVG no próprio HTML.
FOTOS = {
    # Home
    "01-home/03-sopa.jpg": "sopa",
    "01-home/04-IMG_2792.jpeg": "pratos-economicos",
    "01-home/06-maminha.jpg": "maminha-assada",
    "01-home/07-pernil2.jpg": "pernil-decorado",
    "01-home/08-saladacompleta.jpg": "salada",
    "01-home/09-foto_catarinap.jpg": "catarinas",
    "01-home/10-vitrinesal.jpg": "vitrine-salgados",
    "01-home/11-vitrine_sal.jpg": "vitrine-folhados",
    "01-home/12-IMG_1752.jpg": "paes-variados",
    "01-home/14-IMG_5466.jpg": "mini-sanduiches",
    "01-home/15-fundo.jpg": "bolo-morango",
    # Nossa Padaria
    "02-nossa-padaria/01-sem-nome.jpg": "bolo-cenoura",
    "02-nossa-padaria/02-sem-nome.jpg": "bolo-chocolate-fatia",
    "02-nossa-padaria/03-sem-nome.jpg": "torta-chocolate",
    "02-nossa-padaria/04-sem-nome.jpg": "pacote-de-paes",
    "02-nossa-padaria/05-sem-nome.jpg": "doces-chocolate",
    "02-nossa-padaria/06-sem-nome.jpg": "torta-morango",
    # Produtos
    "03-produtos/01-sem-nome.jpg": "pizza-01",
    "03-produtos/02-IMG_8581.jpg": "pizza-02",
    "03-produtos/03-sem-nome.jpg": "pizza-03",
    "03-produtos/04-sem-nome.jpg": "pizza-04",
    "03-produtos/05-sem-nome.jpg": "pizza-05",
    "03-produtos/06-sem-nome.jpg": "pizza-06",
    "03-produtos/07-sem-nome.jpg": "pizza-07",
    "03-produtos/08-tabua.jpg": "tabua-frios",
    "03-produtos/09-porcao.jpg": "porcoes",
    # Fotos
    "04-fotos/01-IMG_0836_edited.jpg": "naked-cake-frutas",
    "04-fotos/02-sem-nome.jpg": "paes-doces",
    "04-fotos/03-sem-nome.png": "clientes-no-balcao",
    "04-fotos/04-sem-nome.jpg": "cappuccino",
    "04-fotos/05-sem-nome.jpg": "rosquinhas",
    "04-fotos/06-torta_fol.jpg": "torta-folhada",
    "04-fotos/07-bolo_lindo.jpg": "bolo-chocolate-decorado",
    "04-fotos/08-bolo_sensa.jpg": "bolo-sensacao",
    "04-fotos/09-cestas.jpg": "cestas-presente",
    "04-fotos/10-cesta_cafe1.jpg": "cesta-cafe-da-manha",
    "04-fotos/11-mini_sand_int.jpg": "mini-sanduiches-integrais",
    "04-fotos/12-cestafrutas.jpg": "cesta-frutas",
    "04-fotos/13-IMG_2725.jpg": "sanduiche-presunto",
    "04-fotos/14-IMG_2733.jpg": "prato-nhoque-bife",
    "04-fotos/15-IMG_2732.jpg": "omelete",
    "04-fotos/16-IMG_2729.jpg": "macarrao-almondegas",
    "04-fotos/17-IMG_2727.jpg": "fritada-com-fritas",
    "04-fotos/18-IMG_2724.jpg": "sanduiche-baguete",
    "04-fotos/19-IMG_3324.jpg": "vitrine-tortas",
    "04-fotos/20-bolos.jpg": "bolos",
    "04-fotos/21-vitrine_doces.jpg": "vitrine-doces",
}

TAMANHOS = {"": 1200, "-p": 600}  # sufixo -> largura máxima
QUALIDADE = 78


def salvar_webp(img: Image.Image, largura: int, caminho: Path) -> None:
    copia = img.copy()
    copia.thumbnail((largura, largura * 4))  # limita só a largura
    copia.save(caminho, "WEBP", quality=QUALIDADE, method=6)


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    total_antes = total_depois = 0

    for original, nome in FOTOS.items():
        origem = ORIGEM / original
        img = Image.open(origem)
        img = ImageOps.exif_transpose(img)  # respeita a rotação do celular
        img = img.convert("RGB")
        total_antes += origem.stat().st_size
        for sufixo, largura in TAMANHOS.items():
            saida = DESTINO / f"{nome}{sufixo}.webp"
            salvar_webp(img, largura, saida)
            total_depois += saida.stat().st_size

    # Logo: mantém PNG com transparência, recortado nas bordas vazias
    logo = Image.open(ORIGEM / "01-home/01-sem-nome.png").convert("RGBA")
    logo = logo.crop(logo.getbbox())
    logo.thumbnail((480, 480))
    logo.save(DESTINO / "logo-fafe.png", optimize=True)

    print(f"{len(FOTOS)} fotos: {total_antes / 1e6:.1f} MB -> {total_depois / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
