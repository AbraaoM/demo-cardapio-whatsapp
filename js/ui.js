/**
 * ui.js
 * Gerencia a manipulação do DOM e interações da interface
 */

const UI = {
  /**
   * Formata um valor em reais
   * @param {number} value - Valor a ser formatado
   * @returns {string} - Valor formatado
   */
  formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  },

  /**
   * Renderiza o menu na página inicial
   */
  renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;

    // Agrupa produtos por categoria
    const categories = {};
    menuData.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });

    // Renderiza cada categoria
    Object.keys(categories).forEach(category => {
      const categorySection = document.createElement('div');
      categorySection.className = 'category-section';
      
      const categoryTitle = document.createElement('h2');
      categoryTitle.className = 'category-title';
      categoryTitle.textContent = category;
      categorySection.appendChild(categoryTitle);

      const categoryGrid = document.createElement('div');
      categoryGrid.className = 'menu-grid';

      categories[category].forEach(product => {
        const productCard = this.createProductCard(product);
        categoryGrid.appendChild(productCard);
      });

      categorySection.appendChild(categoryGrid);
      container.appendChild(categorySection);
    });

    this.updateCartBadge();
  },

  /**
   * Cria um card de produto
   * @param {Object} product - Dados do produto
   * @returns {HTMLElement} - Elemento do card
   */
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-footer">
        <span class="product-price">${this.formatCurrency(product.price)}</span>
        <button class="btn btn-add" data-id="${product.id}">Adicionar</button>
      </div>
    `;

    const btn = card.querySelector('.btn-add');
    btn.addEventListener('click', () => {
      Cart.addItem(product);
      this.updateCartBadge();
      this.showFeedback(btn);
    });

    return card;
  },

  /**
   * Mostra feedback visual ao adicionar item
   * @param {HTMLElement} button - Botão clicado
   */
  showFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✓ Adicionado';
    button.classList.add('added');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('added');
    }, 800);
  },

  /**
   * Atualiza o badge do carrinho
   */
  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const reviewBtn = document.getElementById('review-btn');
    
    if (!badge || !reviewBtn) return;

    const count = Cart.getItemCount();
    
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
      reviewBtn.disabled = false;
    } else {
      badge.style.display = 'none';
      reviewBtn.disabled = true;
    }
  },

  /**
   * Renderiza a página de revisão do pedido
   */
  renderReview() {
    const container = document.getElementById('review-container');
    const totalElement = document.getElementById('total-value');
    
    if (!container || !totalElement) return;

    const items = Cart.getItems();

    if (items.length === 0) {
      window.location.href = 'index.html';
      return;
    }

    container.innerHTML = '';

    items.forEach(item => {
      const itemElement = this.createReviewItem(item);
      container.appendChild(itemElement);
    });

    const total = Cart.getTotal();
    totalElement.textContent = this.formatCurrency(total);
  },

  /**
   * Cria um elemento de item na revisão
   * @param {Object} item - Item do carrinho
   * @returns {HTMLElement} - Elemento do item
   */
  createReviewItem(item) {
    const div = document.createElement('div');
    div.className = 'review-item';

    const subtotal = item.price * item.quantity;

    div.innerHTML = `
      <div class="review-item-info">
        <h3 class="review-item-name">${item.name}</h3>
        <p class="review-item-price">${this.formatCurrency(item.price)} cada</p>
      </div>
      <div class="review-item-controls">
        <button class="btn-quantity" data-action="remove" data-id="${item.id}">-</button>
        <span class="review-item-quantity">${item.quantity}</span>
        <button class="btn-quantity" data-action="add" data-id="${item.id}">+</button>
      </div>
      <div class="review-item-subtotal">${this.formatCurrency(subtotal)}</div>
    `;

    // Event listeners para os botões
    const btnRemove = div.querySelector('[data-action="remove"]');
    const btnAdd = div.querySelector('[data-action="add"]');

    btnRemove.addEventListener('click', () => {
      Cart.removeItem(item.id);
      this.renderReview();
    });

    btnAdd.addEventListener('click', () => {
      const product = menuData.find(p => p.id === item.id);
      if (product) {
        Cart.addItem(product);
        this.renderReview();
      }
    });

    return div;
  },

  /**
   * Inicializa a página de checkout
   */
  initCheckout() {
    const deliveryRadios = document.querySelectorAll('input[name="delivery-type"]');
    const deliveryAddressSection = document.getElementById('delivery-address-section');
    const pickupAddressSection = document.getElementById('pickup-address-section');
    const totalElement = document.getElementById('checkout-total');

    if (Cart.isEmpty()) {
      window.location.href = 'index.html';
      return;
    }

    // Exibe o total
    if (totalElement) {
      const total = Cart.getTotal();
      totalElement.textContent = this.formatCurrency(total);
    }

    // Exibe o endereço de retirada
    if (pickupAddressSection) {
      const addressText = `${RESTAURANT_ADDRESS.street}, ${RESTAURANT_ADDRESS.number} - ${RESTAURANT_ADDRESS.neighborhood}, ${RESTAURANT_ADDRESS.city}/${RESTAURANT_ADDRESS.state}`;
      pickupAddressSection.querySelector('.pickup-address').textContent = addressText;
    }

    // Gerencia a exibição dos campos de acordo com o tipo de entrega
    deliveryRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'delivery') {
          deliveryAddressSection.style.display = 'block';
          pickupAddressSection.style.display = 'none';
          
          // Marca campos como obrigatórios
          document.getElementById('street').required = true;
          document.getElementById('number').required = true;
          document.getElementById('neighborhood').required = true;
        } else {
          deliveryAddressSection.style.display = 'none';
          pickupAddressSection.style.display = 'block';
          
          // Remove obrigatoriedade
          document.getElementById('street').required = false;
          document.getElementById('number').required = false;
          document.getElementById('neighborhood').required = false;
        }
      });
    });
  },

  /**
   * Processa o formulário de checkout
   * @param {Event} e - Evento do formulário
   */
  handleCheckoutSubmit(e) {
    e.preventDefault();

    const phone = document.getElementById('phone').value;
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;

    const checkoutData = {
      phone,
      deliveryType
    };

    if (deliveryType === 'delivery') {
      checkoutData.address = {
        street: document.getElementById('street').value,
        number: document.getElementById('number').value,
        neighborhood: document.getElementById('neighborhood').value,
        complement: document.getElementById('complement').value
      };
    }

    // Salva os dados
    Storage.saveCheckoutData(checkoutData);

    // Envia para o WhatsApp
    const items = Cart.getItems();
    const total = Cart.getTotal();
    
    WhatsApp.sendOrder(items, total, checkoutData);

    // Limpa o carrinho após enviar
    Cart.clear();
  }
};
