# 🍔 Cardápio Digital com WhatsApp

Sistema de cardápio digital simples que permite aos clientes selecionarem produtos e enviarem pedidos diretamente para o WhatsApp do restaurante.

## 📋 Características

- ✅ 100% HTML, CSS e JavaScript puro (sem frameworks)
- ✅ Responsivo (mobile-first)
- ✅ Três etapas de pedido: Seleção → Revisão → Checkout
- ✅ Persistência de dados com localStorage
- ✅ Integração direta com WhatsApp
- ✅ Código limpo e bem organizado

## 📁 Estrutura do Projeto

```
/cardapio-digital
│
├── index.html           # Página de seleção de produtos
├── review.html          # Página de revisão do pedido
├── checkout.html        # Página de finalização e envio
│
├── /css
│   └── styles.css       # Estilos responsivos
│
├── /js
│   ├── data.js          # Produtos e configurações
│   ├── cart.js          # Lógica do carrinho
│   ├── storage.js       # Persistência no localStorage
│   ├── whatsapp.js      # Geração de mensagem WhatsApp
│   └── ui.js            # Manipulação da interface
│
└── /assets              # Imagens (se necessário)
```

## 🚀 Como Usar

### 1. Configuração Inicial

Abra o arquivo [js/data.js](js/data.js) e configure:

**Número do WhatsApp do restaurante:**
```javascript
const RESTAURANT_WHATSAPP = '5511999999999'; // Altere para seu número
```

**Endereço do restaurante:**
```javascript
const RESTAURANT_ADDRESS = {
  street: 'Rua das Flores',
  number: '123',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP'
};
```

### 2. Como Adicionar/Editar Produtos

No arquivo [js/data.js](js/data.js), edite o array `menuData`:

```javascript
const menuData = [
  {
    id: 1,                    // ID único do produto
    name: 'X-Burger',         // Nome do produto
    description: 'Descrição', // Descrição do produto
    price: 18.00,             // Preço (número)
    category: 'Lanches'       // Categoria
  },
  // Adicione mais produtos aqui...
];
```

### 3. Hospedagem

Este é um site estático que pode ser hospedado em:

- **GitHub Pages** (gratuito)
- **Netlify** (gratuito)
- **Vercel** (gratuito)
- Qualquer servidor web

Basta fazer upload dos arquivos e acessar o `index.html`.

## 🎯 Como Funciona

### Fluxo do Pedido

1. **index.html - Seleção de Produtos**
   - Cliente visualiza o cardápio organizado por categorias
   - Adiciona produtos ao carrinho
   - Badge mostra quantidade de itens
   - Clica em "Ver Carrinho" para prosseguir

2. **review.html - Revisão do Pedido**
   - Cliente visualiza todos os itens selecionados
   - Pode adicionar (+) ou remover (-) quantidades
   - Vê o total do pedido
   - Pode voltar para adicionar mais itens
   - Clica em "Continuar" para finalizar

3. **checkout.html - Finalização**
   - Cliente informa telefone
   - Escolhe tipo de entrega:
     - **Delivery:** preenche endereço completo
     - **Retirada:** visualiza endereço do restaurante
   - Clica em "Finalizar Pedido"
   - É redirecionado para WhatsApp com mensagem pronta

### Exemplo de Mensagem WhatsApp

```
Olá, gostaria de fazer o seguinte pedido:

- X-Burger (2x) - R$ 36,00
- Refrigerante Lata (1x) - R$ 5,00

Total: R$ 41,00

📍 Entrega: Delivery
Endereço: Rua das Flores, 123 - Apt 45
Bairro: Centro

📞 Telefone para contato: (11) 99999-9999
```

## 🛠️ Arquitetura do Código

### Separação de Responsabilidades

| Arquivo | Responsabilidade |
|---------|------------------|
| `data.js` | Armazena produtos e configurações |
| `cart.js` | Gerencia adição/remoção de itens |
| `storage.js` | Salva/recupera dados do localStorage |
| `whatsapp.js` | Gera mensagem e link do WhatsApp |
| `ui.js` | Renderiza interface e manipula DOM |

### Principais Funções

**Cart (carrinho)**
- `addItem(product)` - Adiciona produto
- `removeItem(id)` - Remove uma unidade
- `getTotal()` - Calcula total
- `getItems()` - Retorna itens

**Storage (persistência)**
- `saveCart(cart)` - Salva carrinho
- `getCart()` - Recupera carrinho
- `clearAll()` - Limpa dados

**WhatsApp (integração)**
- `generateMessage()` - Gera texto do pedido
- `sendOrder()` - Redireciona para WhatsApp

**UI (interface)**
- `renderMenu()` - Renderiza cardápio
- `renderReview()` - Renderiza revisão
- `initCheckout()` - Inicializa checkout

## 🎨 Personalização

### Cores

Edite as variáveis CSS no arquivo [css/styles.css](css/styles.css):

```css
:root {
  --primary-color: #25D366;      /* Cor principal (verde WhatsApp) */
  --primary-dark: #1da851;       /* Cor escura para hover */
  --text-dark: #333;             /* Cor do texto */
  --bg-light: #f5f5f5;           /* Cor de fundo */
}
```

### Layout

O CSS está organizado em seções:
- Reset e configurações globais
- Header
- Cards de produto
- Botões
- Página de revisão
- Página de checkout
- Responsividade (mobile-first)

## 📱 Responsividade

O layout é **mobile-first** e se adapta automaticamente:

- **Mobile (até 767px):** 1 coluna
- **Tablet (768px+):** 2 colunas
- **Desktop (1024px+):** 3 colunas
- **Desktop Grande (1440px+):** 4 colunas

## 🔧 Requisitos Técnicos

- Navegador moderno com suporte a:
  - ES6+ JavaScript
  - CSS Grid e Flexbox
  - localStorage
- Não requer instalação
- Não requer servidor backend
- Não requer Node.js ou npm

## ⚠️ Notas Importantes

1. **Número do WhatsApp:** Deve estar no formato internacional sem '+' (ex: 5511999999999)
2. **localStorage:** Os dados do carrinho são salvos localmente no navegador
3. **Validação:** Validação básica dos campos do formulário
4. **Limpeza:** O carrinho é limpo após enviar o pedido

## 🤝 Como Contribuir

Para adicionar novas funcionalidades:

1. Mantenha a separação de responsabilidades
2. Adicione funções pequenas e reutilizáveis
3. Comente o código quando necessário
4. Mantenha o estilo mobile-first

## 📄 Licença

Livre para uso pessoal e comercial.

## 📞 Suporte

Para dúvidas sobre personalização:
1. Verifique a estrutura do código
2. Consulte os comentários nos arquivos JavaScript
3. Teste em um navegador moderno

---

**Desenvolvido com HTML, CSS e JavaScript puro 💚**
