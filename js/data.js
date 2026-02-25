/**
 * data.js
 * Contém a lista de produtos do cardápio
 */

const menuData = [
  {
    id: 1,
    name: 'X-Burger',
    description: 'Hambúrguer, queijo, alface, tomate e maionese',
    price: 18.00,
    category: 'Lanches'
  },
  {
    id: 2,
    name: 'X-Bacon',
    description: 'Hambúrguer, queijo, bacon, alface, tomate e maionese',
    price: 22.00,
    category: 'Lanches'
  },
  {
    id: 3,
    name: 'X-Egg',
    description: 'Hambúrguer, queijo, ovo, alface, tomate e maionese',
    price: 20.00,
    category: 'Lanches'
  },
  {
    id: 4,
    name: 'X-Salada',
    description: 'Hambúrguer, queijo, alface, tomate, milho e maionese',
    price: 19.00,
    category: 'Lanches'
  },
  {
    id: 5,
    name: 'X-Tudo',
    description: 'Hambúrguer, queijo, bacon, ovo, calabresa, alface, tomate e maionese',
    price: 28.00,
    category: 'Lanches'
  },
  {
    id: 6,
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Fanta 350ml',
    price: 5.00,
    category: 'Bebidas'
  },
  {
    id: 7,
    name: 'Refrigerante 2L',
    description: 'Coca-Cola, Guaraná ou Fanta 2 litros',
    price: 10.00,
    category: 'Bebidas'
  },
  {
    id: 8,
    name: 'Suco Natural',
    description: 'Laranja, limão ou morango 500ml',
    price: 8.00,
    category: 'Bebidas'
  },
  {
    id: 9,
    name: 'Batata Frita',
    description: 'Porção individual de batata frita crocante',
    price: 12.00,
    category: 'Acompanhamentos'
  },
  {
    id: 10,
    name: 'Onion Rings',
    description: 'Porção de anéis de cebola empanados',
    price: 14.00,
    category: 'Acompanhamentos'
  }
];

// Número do WhatsApp do restaurante (formato: código do país + DDD + número)
const RESTAURANT_WHATSAPP = '5511999999999'; // ALTERAR AQUI

// Endereço do restaurante para retirada
const RESTAURANT_ADDRESS = {
  street: 'Rua das Flores',
  number: '123',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP'
};
