# 📦 Guia de Imagens - Cardápio Digital

## Status Atual

✅ **Imagens SVG implementadas** - Formato vetorial otimizado, carregam rapidamente
- Tamanho pequeno (< 1KB por imagem)
- Escaláveis sem perda de qualidade
- Lazy loading nativo implementado

## Como Otimizar Ainda Mais

### 1. **Converter SVG para PNG (Opcional)**

Se preferir usar PNG em vez de SVG:

```bash
# Instalar Pillow (Python image library)
pip install Pillow

# Gerar imagens PNG otimizadas
python3 generate_images.py
```

Depois, em `js/data.js`, trocar:
```javascript
image: 'images/xburger.svg'  // → para PNG
```

### 2. **WebP - Formato Moderno (Recomendado)**

Para melhor compatibilidade e menor tamanho:

```html
<!-- No HTML, usar picture element -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="Produto">
</picture>
```

### 3. **Minificar SVGs**

Use a ferramenta online ou localmente:
```bash
npm install -g svgo
svgo images/*.svg
```

### 4. **Implementar Lazy Loading (Já Feito ✓)**

O código já usa `loading="lazy"` para melhor performance:
```javascript
<img src="..." loading="lazy" ...>
```

## Otimizações Aplicadas

✅ SVG vetorial (menor tamanho)  
✅ Lazy loading nativo  
✅ Imagens responsive (diferentes tamanhos em tablets/desktop)  
✅ Placeholders visuais enquanto carregam  
✅ Animações CSS de fade-in suave  
✅ Sem bloqueio de carregamento da página  

## Tamanho e Performance

| Formato | Tamanho | Vantagens |
|---------|---------|-----------|
| SVG | ~0.5-1KB | Escalável, vetorial, rápido |
| PNG | ~3-5KB | Tradicional, compatível |
| WebP | ~2-3KB | Moderno, menor, melhor |

## Próximas Melhorias

- [ ] Converter para WebP com fallback PNG
- [ ] Implementar image srcset para resoluções diferentes
- [ ] Usar CDN para distribuição global
- [ ] Implementar blur-up/LQIP (Low Quality Image Placeholder)

## Arquivo Gerador

`generate_images.py` - Script Python para gerar PNG otimizadas

**Uso:**
```bash
python3 generate_images.py
```

**Requisitos:**
- Python 3.6+
- Pillow (PIL): `pip install Pillow`

---

**Desenvolvido com ❤️ para o estilo McDonald's 1990**
