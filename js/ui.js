/**
 * ui.js
 * Gerencia a manipulação do DOM e interações da interface
 */

const ProductConfigurator = (() => {
  const state = {
    product: null,
    levelIndex: 0,
    selections: {}
  };

  const elements = {
    overlay: null,
    title: null,
    description: null,
    levelContainer: null,
    summaryList: null,
    total: null,
    progressFill: null,
    progressLabel: null,
    backButton: null,
    nextButton: null
  };

  let lastFocusedElement = null;

  function ensureModal() {
    if (elements.overlay) return;

    const overlay = document.createElement('div');
    overlay.id = 'configurator-overlay';
    overlay.className = 'configurator-overlay hidden';
    overlay.innerHTML = `
      <div class="configurator-modal" role="dialog" aria-modal="true" aria-labelledby="configurator-title">
        <button type="button" class="configurator-close" aria-label="Fechar configurador">&times;</button>
        <header class="configurator-header">
          <span class="configurator-badge">Montagem guiada</span>
          <h2 id="configurator-title"></h2>
          <p id="configurator-description" class="configurator-description"></p>
        </header>
        <div class="configurator-progress">
          <div class="configurator-progress-bar">
            <div class="configurator-progress-fill"></div>
          </div>
          <span class="configurator-progress-label"></span>
        </div>
        <section id="configurator-level" class="configurator-level"></section>
        <section class="configurator-summary">
          <div>
            <h4>Resumo parcial</h4>
            <ul id="configurator-summary-list" class="configurator-summary-list"></ul>
          </div>
          <div class="configurator-summary-total">
            <span>Total estimado</span>
            <strong id="configurator-total">R$ 0,00</strong>
          </div>
        </section>
        <div class="configurator-actions">
          <button type="button" class="btn btn-secondary" id="configurator-back">Voltar</button>
          <button type="button" class="btn btn-primary" id="configurator-next">Continuar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    elements.overlay = overlay;
    elements.title = overlay.querySelector('#configurator-title');
    elements.description = overlay.querySelector('#configurator-description');
    elements.levelContainer = overlay.querySelector('#configurator-level');
    elements.summaryList = overlay.querySelector('#configurator-summary-list');
    elements.total = overlay.querySelector('#configurator-total');
    elements.progressFill = overlay.querySelector('.configurator-progress-fill');
    elements.progressLabel = overlay.querySelector('.configurator-progress-label');
    elements.backButton = overlay.querySelector('#configurator-back');
    elements.nextButton = overlay.querySelector('#configurator-next');

    const closeButton = overlay.querySelector('.configurator-close');
    closeButton.addEventListener('click', close);
    elements.backButton.addEventListener('click', goToPreviousLevel);
    elements.nextButton.addEventListener('click', goToNextLevel);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        close();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !overlay.classList.contains('hidden')) {
        close();
      }
    });
  }

  function open(product) {
    if (!product?.flowLevels?.length) return;
    ensureModal();

    state.product = product;
    state.levelIndex = 0;
    state.selections = {};

    elements.title.textContent = product.name;
    elements.description.textContent = product.description || '';
    elements.overlay.classList.remove('hidden');
    elements.overlay.classList.add('active');
    document.body.classList.add('configurator-open');
    lastFocusedElement = document.activeElement;

    render();
  }

  function close() {
    if (!elements.overlay) return;
    elements.overlay.classList.remove('active');
    elements.overlay.classList.add('hidden');
    document.body.classList.remove('configurator-open');

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }

    state.product = null;
    state.levelIndex = 0;
    state.selections = {};
  }

  function render() {
    const level = getCurrentLevel();
    if (!level) return;

    renderLevel(level);
    updateSummary();
    updateTotal();
    updateProgress();
    updateActions();
  }

  function renderLevel(level) {
    if (!elements.levelContainer) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'configurator-level-wrapper';

    const header = document.createElement('div');
    header.className = 'configurator-level-header';

    const title = document.createElement('h3');
    title.textContent = level.title;
    header.appendChild(title);

    if (level.description) {
      const description = document.createElement('p');
      description.className = 'configurator-level-description';
      description.textContent = level.description;
      header.appendChild(description);
    }

    const hint = document.createElement('p');
    hint.className = 'configurator-level-hint';
    hint.textContent = buildLevelHint(level);
    header.appendChild(hint);

    wrapper.appendChild(header);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'configurator-options';

    (level.options || []).forEach(option => {
      const optionButton = document.createElement('button');
      optionButton.type = 'button';
      optionButton.className = 'configurator-option';

      if (isOptionSelected(level.id, option.id)) {
        optionButton.classList.add('selected');
      }

      optionButton.innerHTML = `
        <span class="configurator-option-label">${option.label}</span>
        ${option.description ? `<span class="configurator-option-description">${option.description}</span>` : ''}
        <span class="configurator-option-price">${formatOptionPrice(option)}</span>
      `;

      optionButton.addEventListener('click', () => toggleOption(level, option));
      optionsContainer.appendChild(optionButton);
    });

    wrapper.appendChild(optionsContainer);
    elements.levelContainer.innerHTML = '';
    elements.levelContainer.appendChild(wrapper);
  }

  function buildLevelHint(level) {
    const min = getMinSelections(level);
    const max = getMaxSelections(level);

    if (min === max && min > 0) {
      return `Selecione ${min} opção${min > 1 ? 'es' : ''}`;
    }

    if (min > 0 && max < Infinity) {
      return `Selecione de ${min} até ${max} opções`;
    }

    if (max < Infinity) {
      return `Selecione até ${max} opção${max > 1 ? 'es' : ''}`;
    }

    if (min > 0) {
      return `Selecione pelo menos ${min} opção${min > 1 ? 'es' : ''}`;
    }

    return 'Seleção opcional';
  }

  function toggleOption(level, option) {
    const selection = state.selections[level.id] || {
      levelId: level.id,
      levelTitle: level.title,
      selectionType: (level.selectionType || 'single'),
      options: []
    };

    const alreadySelected = selection.options.some(opt => opt.id === option.id);
    const min = getMinSelections(level);
    const max = getMaxSelections(level);

    if ((level.selectionType || 'single') === 'single') {
      if (alreadySelected && min === 0) {
        selection.options = [];
        delete state.selections[level.id];
      } else {
        selection.options = [cloneOption(option)];
        state.selections[level.id] = selection;
      }
    } else {
      if (alreadySelected) {
        selection.options = selection.options.filter(opt => opt.id !== option.id);
        if (selection.options.length === 0) {
          delete state.selections[level.id];
        } else {
          state.selections[level.id] = selection;
        }
      } else {
        if (selection.options.length >= max) {
          flashLimitWarning();
          return;
        }
        selection.options = [...selection.options, cloneOption(option)];
        state.selections[level.id] = selection;
      }
    }

    renderLevel(level);
    updateSummary();
    updateTotal();
    updateActions();
  }

  function flashLimitWarning() {
    if (!elements.levelContainer) return;
    elements.levelContainer.classList.add('limit-reached');
    setTimeout(() => {
      elements.levelContainer.classList.remove('limit-reached');
    }, 400);
  }

  function updateSummary() {
    if (!elements.summaryList || !state.product) return;
    const entries = buildSummaryEntries();

    if (!entries.length) {
      elements.summaryList.innerHTML = '<li class="configurator-summary-placeholder">As escolhas aparecerão aqui</li>';
      return;
    }

    const markup = entries.map(entry => {
      const options = entry.options.map(opt => opt.label).join(', ');
      return `<li><strong>${entry.title}:</strong> <span>${options}</span></li>`;
    }).join('');

    elements.summaryList.innerHTML = markup;
  }

  function buildSummaryEntries() {
    if (!state.product) return [];
    return (state.product.flowLevels || []).map(level => {
      const selection = state.selections[level.id];
      if (!selection || !selection.options.length) {
        return null;
      }

      return {
        levelId: level.id,
        title: level.title,
        options: selection.options.map(opt => ({
          id: opt.id,
          label: opt.label
        }))
      };
    }).filter(Boolean);
  }

  function updateTotal() {
    if (!elements.total || !state.product) return;
    const total = calculatePrice(state.product, state.selections);
    elements.total.textContent = formatCurrency(total);
  }

  function updateProgress() {
    if (!elements.progressFill || !elements.progressLabel || !state.product) return;
    const totalLevels = state.product.flowLevels.length;
    const currentStep = state.levelIndex + 1;
    const percent = Math.round((currentStep / totalLevels) * 100);
    elements.progressFill.style.width = `${percent}%`;
    elements.progressLabel.textContent = `Passo ${currentStep} de ${totalLevels}`;
  }

  function updateActions() {
    if (!elements.nextButton || !elements.backButton) return;
    const totalLevels = state.product?.flowLevels?.length || 0;
    const onFirstLevel = state.levelIndex === 0;
    const onLastLevel = state.levelIndex === totalLevels - 1;
    const level = getCurrentLevel();

    elements.backButton.disabled = onFirstLevel;
    elements.nextButton.textContent = onLastLevel ? 'Adicionar ao carrinho' : 'Continuar';
    elements.nextButton.disabled = !canProceed(level);
  }

  function canProceed(level) {
    if (!level) return false;
    const selection = state.selections[level.id];
    const count = selection?.options?.length || 0;
    const min = getMinSelections(level);
    return count >= min;
  }

  function goToPreviousLevel() {
    if (state.levelIndex === 0) return;
    state.levelIndex -= 1;
    render();
  }

  function goToNextLevel() {
    const level = getCurrentLevel();
    if (!canProceed(level)) {
      return;
    }

    const isLast = state.levelIndex === state.product.flowLevels.length - 1;
    if (isLast) {
      finalizeSelection();
      return;
    }

    state.levelIndex += 1;
    render();
  }

  function finalizeSelection() {
    if (!state.product) return;
    const payload = buildConfigurationPayload();
    Cart.addItem(state.product, payload);
    if (typeof UI !== 'undefined' && UI.updateCartBadge) {
      UI.updateCartBadge();
    }
    close();
  }

  function buildConfigurationPayload() {
    const selections = buildSummaryEntries().map(entry => ({
      levelId: entry.levelId,
      title: entry.title,
      options: entry.options.map(opt => ({ id: opt.id, label: opt.label }))
    }));

    const summary = selections
      .map(entry => `${entry.title}: ${entry.options.map(opt => opt.label).join(', ')}`)
      .join(' | ');

    const signature = selections
      .map(entry => `${entry.levelId}=${entry.options.map(opt => opt.id).sort().join(',')}`)
      .join(';') || 'default';

    const price = calculatePrice(state.product, state.selections);

    return {
      price,
      summary,
      selections,
      signature,
      displayName: state.product.name
    };
  }

  function calculatePrice(product, selectionState = {}) {
    let basePrice = typeof product.price === 'number' ? product.price : 0;
    let adjustments = 0;

    (product.flowLevels || []).forEach(level => {
      const selection = selectionState[level.id];
      if (!selection) return;

      selection.options.forEach(option => {
        if (typeof option.priceOverride === 'number') {
          basePrice = option.priceOverride;
        }
        if (typeof option.priceAdjustment === 'number') {
          adjustments += option.priceAdjustment;
        }
      });
    });

    return basePrice + adjustments;
  }

  function getMinimalPrice(product) {
    if (!product?.flowLevels?.length) {
      return typeof product?.price === 'number' ? product.price : 0;
    }

    const simulatedSelections = {};

    product.flowLevels.forEach(level => {
      const min = getMinSelections(level);
      if (min <= 0) {
        return;
      }

      const sortedOptions = [...(level.options || [])].sort((a, b) => getOptionImpact(a) - getOptionImpact(b));
      const requiredOptions = sortedOptions.slice(0, Math.min(min, sortedOptions.length)).map(opt => cloneOption(opt));

      if (requiredOptions.length) {
        simulatedSelections[level.id] = {
          levelId: level.id,
          levelTitle: level.title,
          selectionType: level.selectionType || 'single',
          options: requiredOptions
        };
      }
    });

    return calculatePrice(product, simulatedSelections);
  }

  function getOptionImpact(option) {
    if (typeof option.priceOverride === 'number') {
      return option.priceOverride;
    }
    if (typeof option.priceAdjustment === 'number') {
      return option.priceAdjustment;
    }
    return 0;
  }

  function getCurrentLevel() {
    if (!state.product) return null;
    return state.product.flowLevels[state.levelIndex];
  }

  function getMinSelections(level) {
    if (typeof level.minSelections === 'number') {
      return level.minSelections;
    }
    return (level.selectionType || 'single') === 'multi' ? 0 : 1;
  }

  function getMaxSelections(level) {
    if (typeof level.maxSelections === 'number') {
      return level.maxSelections;
    }
    return (level.selectionType || 'single') === 'multi' ? Infinity : 1;
  }

  function isOptionSelected(levelId, optionId) {
    const selection = state.selections[levelId];
    if (!selection) return false;
    return selection.options.some(opt => opt.id === optionId);
  }

  function cloneOption(option) {
    return {
      id: option.id,
      label: option.label,
      description: option.description,
      priceAdjustment: option.priceAdjustment,
      priceOverride: option.priceOverride
    };
  }

  function formatOptionPrice(option) {
    if (typeof option.priceOverride === 'number') {
      return `Define ${formatCurrency(option.priceOverride)}`;
    }
    const adjustment = typeof option.priceAdjustment === 'number' ? option.priceAdjustment : 0;
    if (adjustment === 0) {
      return 'Incluso';
    }
    if (adjustment > 0) {
      return `+ ${formatCurrency(adjustment)}`;
    }
    return `- ${formatCurrency(Math.abs(adjustment))}`;
  }

  function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureModal);
  } else {
    ensureModal();
  }

  return {
    open,
    close,
    calculatePrice,
    getMinimalPrice
  };
})();

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
   * Verifica se o produto possui fluxo configurável
   * @param {Object} product
   * @returns {boolean}
   */
  hasConfigurableFlow(product) {
    return Array.isArray(product.flowLevels) && product.flowLevels.length > 0;
  },

  /**
   * Obtém o valor inicial de exibição de um produto
   * @param {Object} product
   * @returns {number}
   */
  getStartingPrice(product) {
    if (this.hasConfigurableFlow(product)) {
      return ProductConfigurator.getMinimalPrice(product);
    }
    return typeof product.price === 'number' ? product.price : 0;
  },

  /**
   * Formata o texto de preço exibido em cards de produto
   * @param {Object} product
   * @returns {string}
   */
  getProductPriceLabel(product) {
    const price = this.getStartingPrice(product);
    if (this.hasConfigurableFlow(product)) {
      return `A partir de ${this.formatCurrency(price)}`;
    }
    return this.formatCurrency(price);
  },

  /**
   * Renderiza o menu na página inicial
   */
  renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';

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
    const hasFlow = this.hasConfigurableFlow(product);
    const priceLabel = this.getProductPriceLabel(product);
    const buttonLabel = hasFlow ? 'Montar pedido' : 'Adicionar';

    card.innerHTML = `
      <div class="product-image-container">
        ${product.image ? `<img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">` : '<div class="product-image-placeholder">🍔</div>'}
      </div>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-footer">
        <div class="product-price-wrapper">
          ${hasFlow ? '<span class="product-badge">Personalizável</span>' : ''}
          <span class="product-price">${priceLabel}</span>
        </div>
        <button class="btn btn-add" data-id="${product.id}">${buttonLabel}</button>
      </div>
    `;

    // Adiciona animação de carregamento e extração de cor dominante
    if (product.image) {
      const img = card.querySelector('.product-image');
      const container = card.querySelector('.product-image-container');
      if (img) {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
          
          // Extrai a cor dominante da imagem
          if (typeof ColorThief !== 'undefined') {
            setTimeout(() => {
              try {
                const colorThief = new ColorThief();
                const dominantColor = colorThief.getColor(img);
                const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
                
                // Aclarar levemente a cor para melhor visual
                const lightenedColor = this.lightenColor(dominantColor[0], dominantColor[1], dominantColor[2], 0.15);
                container.style.setProperty('--dynamic-bg', lightenedColor);
                container.classList.add('loaded');
              } catch (e) {
                console.warn('Erro ao extrair cor da imagem:', e);
              }
            }, 0);
          }
        });
        img.addEventListener('error', () => {
          console.warn(`Falha ao carregar imagem: ${product.image}`);
          img.style.display = 'none';
          const placeholder = document.createElement('div');
          placeholder.className = 'product-image-placeholder';
          placeholder.textContent = '🍔';
          img.parentElement.appendChild(placeholder);
        });
      }
    }

    const btn = card.querySelector('.btn-add');
    btn.addEventListener('click', () => {
      if (hasFlow) {
        ProductConfigurator.open(product);
      } else {
        Cart.addItem(product);
        this.updateCartBadge();
        this.showFeedback(btn);
      }
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
    const customizationMarkup = this.renderCustomizationDetails(item);
    const itemKey = item.key || Cart.generateItemKey(item.id);

    div.innerHTML = `
      <div class="review-item-info">
        <h3 class="review-item-name">${item.name}</h3>
        <p class="review-item-price">${this.formatCurrency(item.price)} cada</p>
        ${customizationMarkup}
      </div>
      <div class="review-item-controls">
        <button class="btn-quantity" data-action="remove" data-id="${item.id}" data-key="${itemKey}">-</button>
        <span class="review-item-quantity">${item.quantity}</span>
        <button class="btn-quantity" data-action="add" data-id="${item.id}" data-key="${itemKey}">+</button>
      </div>
      <div class="review-item-subtotal">${this.formatCurrency(subtotal)}</div>
    `;

    // Event listeners para os botões
    const btnRemove = div.querySelector('[data-action="remove"]');
    const btnAdd = div.querySelector('[data-action="add"]');

    btnRemove.addEventListener('click', () => {
      Cart.removeItem(item.id, itemKey);
      this.renderReview();
    });

    btnAdd.addEventListener('click', () => {
      Cart.incrementItem(itemKey);
      this.renderReview();
    });

    return div;
  },

  /**
   * Renderiza detalhes da customização de um item
   * @param {Object} item - Item do carrinho
   * @returns {string}
   */
  renderCustomizationDetails(item) {
    const selections = item.customization?.selections;
    if (!Array.isArray(selections) || selections.length === 0) {
      return '';
    }

    const content = selections.map(selection => {
      const options = selection.options.map(opt => opt.label).join(', ');
      return `<li><strong>${selection.title}:</strong> <span>${options}</span></li>`;
    }).join('');

    return `<ul class="review-item-customizations">${content}</ul>`;
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
  },

  /**
   * Clareia uma cor RGB
   * @param {number} r - Componente vermelho
   * @param {number} g - Componente verde
   * @param {number} b - Componente azul
   * @param {number} factor - Fator de clareamento (0-1)
   * @returns {string} - Cor RGB aclarada
   */
  lightenColor(r, g, b, factor) {
    const lightenValue = (value) => {
      return Math.round(value + (255 - value) * factor);
    };
    return `rgb(${lightenValue(r)}, ${lightenValue(g)}, ${lightenValue(b)})`;
  }
};
