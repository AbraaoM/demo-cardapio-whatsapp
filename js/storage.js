/**
 * storage.js
 * Gerencia a persistência de dados no localStorage
 */

const Storage = {
  /**
   * Salva o carrinho no localStorage
   * @param {Array} cart - Array com os itens do carrinho
   */
  saveCart(cart) {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
      return false;
    }
  },

  /**
   * Recupera o carrinho do localStorage
   * @returns {Array} - Array com os itens do carrinho
   */
  getCart() {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Erro ao recuperar carrinho:', error);
      return [];
    }
  },

  /**
   * Salva os dados do checkout
   * @param {Object} data - Dados do checkout
   */
  saveCheckoutData(data) {
    try {
      localStorage.setItem('checkoutData', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados do checkout:', error);
      return false;
    }
  },

  /**
   * Recupera os dados do checkout
   * @returns {Object} - Dados do checkout
   */
  getCheckoutData() {
    try {
      const data = localStorage.getItem('checkoutData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao recuperar dados do checkout:', error);
      return null;
    }
  },

  /**
   * Limpa todos os dados armazenados
   */
  clearAll() {
    try {
      localStorage.removeItem('cart');
      localStorage.removeItem('checkoutData');
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  }
};
