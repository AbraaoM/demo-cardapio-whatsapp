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
    category: 'Lanches',
    image: 'images/x burguer.png'
  },
  {
    id: 2,
    name: 'X-Bacon',
    description: 'Hambúrguer, queijo, bacon, alface, tomate e maionese',
    price: 22.00,
    category: 'Lanches',
    image: 'images/x_bacon.png'
  },
  {
    id: 3,
    name: 'X-Egg',
    description: 'Hambúrguer, queijo, ovo, alface, tomate e maionese',
    price: 20.00,
    category: 'Lanches',
    image: 'images/x_egg.png'
  },
  {
    id: 4,
    name: 'X-Salada',
    description: 'Hambúrguer, queijo, alface, tomate, milho e maionese',
    price: 19.00,
    category: 'Lanches',
    image: 'images/x_salada.png'
  },
  {
    id: 5,
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Fanta 350ml',
    price: 5.00,
    category: 'Bebidas',
    image: 'images/lata.png'
  },
  {
    id: 6,
    name: 'Refrigerante 2L',
    description: 'Coca-Cola, Guaraná ou Fanta 2 litros',
    price: 10.00,
    category: 'Bebidas',
    image: 'images/garrafa.png'
  },
  {
    id: 7,
    name: 'Suco Natural',
    description: 'Laranja, limão ou morango 500ml',
    price: 8.00,
    category: 'Bebidas',
    image: 'images/suco.png'
  },
  {
    id: 8,
    name: 'Batata Frita',
    description: 'Porção individual de batata frita crocante',
    price: 12.00,
    category: 'Acompanhamentos',
    image: 'images/batata.png'
  },
  {
    id: 9,
    name: 'Onion Rings',
    description: 'Porção de anéis de cebola empanados',
    price: 14.00,
    category: 'Acompanhamentos',
    image: 'images/onion.png'
  }
];

// Número do WhatsApp do restaurante (formato: código do país + DDD + número)
const RESTAURANT_WHATSAPP = '5512991630587'; // ALTERAR AQUI

// Endereço do restaurante para retirada
const RESTAURANT_ADDRESS = {
  street: 'Rua das Flores',
  number: '123',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP'
};
