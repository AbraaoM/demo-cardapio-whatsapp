/**
 * cart.js
 * Gerencia a lógica do carrinho de compras
 */

const Cart = {
  items: [],

  /**
   * Inicializa o carrinho recuperando dados do localStorage
   */
  init() {
    const storedItems = Storage.getCart();
    this.items = Array.isArray(storedItems)
      ? storedItems.map(item => this.normalizeStoredItem(item))
      : [];
  },

  /**
   * Adiciona um item ao carrinho
   * @param {Object} product - Produto a ser adicionado
   * @param {Object|null} configuration - Dados da configuração customizada
   */
  addItem(product, configuration = null) {
    const signature = configuration?.signature || 'default';
    const key = this.generateItemKey(product.id, signature);
    const existingItem = this.items.find(item => item.key === key);

    const price = typeof configuration?.price === 'number' ? configuration.price : product.price;
    const name = configuration?.displayName || product.name;
    const customization = configuration
      ? {
          summary: configuration.summary,
          selections: configuration.selections,
          signature
        }
      : null;

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.price = price;
    } else {
      this.items.push({
        key,
        id: product.id,
        name,
        price,
        quantity: 1,
        customization
      });
    }
    
    this.save();
  },

  /**
   * Incrementa a quantidade de um item existente
   * @param {string} itemKey - Chave única do item
   */
  incrementItem(itemKey) {
    const item = this.items.find(entry => entry.key === itemKey);
    if (item) {
      item.quantity += 1;
      this.save();
    }
  },

  /**
   * Remove uma unidade de um item do carrinho
   * @param {number} productId - ID do produto
   * @param {string|null} itemKey - Chave única quando houver customização
   */
  removeItem(productId, itemKey = null) {
    const item = this.findItem(productId, itemKey);
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.items = this.items.filter(entry => entry.key !== item.key);
      }
      this.save();
    }
  },

  /**
   * Remove completamente um item do carrinho
   * @param {number} productId - ID do produto
   * @param {string|null} itemKey - Chave única quando houver customização
   */
  deleteItem(productId, itemKey = null) {
    const item = this.findItem(productId, itemKey);
    if (!item) return;
    this.items = this.items.filter(entry => entry.key !== item.key);
    this.save();
  },

  /**
   * Retorna um item considerando ID e chave
   * @param {number} productId - ID do produto
   * @param {string|null} itemKey - Chave única
   * @returns {Object|undefined}
   */
  findItem(productId, itemKey = null) {
    if (itemKey) {
      return this.items.find(item => item.key === itemKey);
    }

    const defaultKey = this.generateItemKey(productId);
    return this.items.find(item => item.key === defaultKey) || this.items.find(item => item.id === productId);
  },

  /**
   * Cria a chave única de um item
   * @param {number} productId - ID do produto
   * @param {string} signature - Assinatura da customização
   * @returns {string}
   */
  generateItemKey(productId, signature = 'default') {
    return `${productId}::${signature}`;
  },

  /**
   * Normaliza itens vindos do storage antigo
   * @param {Object} item - Item bruto
   * @returns {Object}
   */
  normalizeStoredItem(item) {
    if (item.key) {
      return item;
    }

    const signature = item.customization?.signature || 'default';
    return {
      ...item,
      key: this.generateItemKey(item.id, signature)
    };
  },

  /**
   * Retorna todos os itens do carrinho
   * @returns {Array} - Array com os itens
   */
  getItems() {
    return this.items;
  },

  /**
   * Calcula o total do carrinho
   * @returns {number} - Valor total
   */
  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  /**
   * Retorna a quantidade total de itens
   * @returns {number} - Quantidade total
   */
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  },

  /**
   * Verifica se o carrinho está vazio
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  },

  /**
   * Limpa o carrinho
   */
  clear() {
    this.items = [];
    this.save();
  },

  /**
   * Salva o carrinho no localStorage
   */
  save() {
    Storage.saveCart(this.items);
  }
};
