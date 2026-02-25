/**
 * whatsapp.js
 * Gera a mensagem e o link para o WhatsApp
 */

const WhatsApp = {
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
   * Gera a mensagem do pedido
   * @param {Array} items - Itens do carrinho
   * @param {number} total - Total do pedido
   * @param {Object} checkoutData - Dados do checkout
   * @returns {string} - Mensagem formatada
   */
  generateMessage(items, total, checkoutData) {
    let message = 'Olá, gostaria de fazer o seguinte pedido:\n\n';
    
    // Lista de itens
    items.forEach(item => {
      const subtotal = item.price * item.quantity;
      message += `- ${item.name} (${item.quantity}x) - ${this.formatCurrency(subtotal)}\n`;
    });
    
    // Total
    message += `\n*Total: ${this.formatCurrency(total)}*\n\n`;
    
    // Tipo de entrega
    if (checkoutData.deliveryType === 'delivery') {
      message += '📍 *Entrega: Delivery*\n';
      message += `Endereço: ${checkoutData.address.street}, ${checkoutData.address.number}`;
      
      if (checkoutData.address.complement) {
        message += ` - ${checkoutData.address.complement}`;
      }
      
      message += `\nBairro: ${checkoutData.address.neighborhood}\n`;
    } else {
      message += '🏪 *Entrega: Retirada no local*\n';
    }
    
    // Telefone
    message += `\n📞 Telefone para contato: ${checkoutData.phone}`;
    
    return message;
  },

  /**
   * Gera o link do WhatsApp
   * @param {string} message - Mensagem do pedido
   * @returns {string} - URL do WhatsApp
   */
  generateLink(message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodedMessage}`;
  },

  /**
   * Envia o pedido para o WhatsApp
   * @param {Array} items - Itens do carrinho
   * @param {number} total - Total do pedido
   * @param {Object} checkoutData - Dados do checkout
   */
  sendOrder(items, total, checkoutData) {
    const message = this.generateMessage(items, total, checkoutData);
    const link = this.generateLink(message);
    
    // Redireciona para o WhatsApp
    window.location.href = link;
  }
};
