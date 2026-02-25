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
    this.items = Storage.getCart();
  },

  /**
   * Adiciona um item ao carrinho
   * @param {Object} product - Produto a ser adicionado
   */
  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
    
    this.save();
  },

  /**
   * Remove uma unidade de um item do carrinho
   * @param {number} productId - ID do produto
   */
  removeItem(productId) {
    const item = this.items.find(item => item.id === productId);
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.items = this.items.filter(item => item.id !== productId);
      }
      this.save();
    }
  },

  /**
   * Remove completamente um item do carrinho
   * @param {number} productId - ID do produto
   */
  deleteItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
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
