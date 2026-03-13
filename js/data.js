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
  },
  {
    id: 10,
    name: 'Monte sua Marmita',
    description: 'Configure tamanho, mistura e acompanhamentos em etapas simples',
    price: 24.00,
    category: 'Combos Personalizados',
    image: 'images/marmita.png',
    flowLevels: [
      {
        id: 'style',
        title: 'Escolha o estilo da marmita',
        description: 'Defina a base antes de continuar',
        selectionType: 'single',
        minSelections: 1,
        options: [
          {
            id: 'caseira',
            label: 'Caseira',
            description: 'Arroz, feijão, salada e farofa',
            priceAdjustment: 0
          },
          {
            id: 'lowcarb',
            label: 'Low Carb',
            description: 'Folhas, legumes salteados e mix de grãos',
            priceAdjustment: 4
          },
          {
            id: 'fit',
            label: 'Fit',
            description: 'Arroz integral, feijão verde, salada fresca',
            priceAdjustment: 2
          }
        ]
      },
      {
        id: 'size',
        title: 'Selecione o tamanho',
        description: 'O tamanho define o valor base da marmita',
        selectionType: 'single',
        minSelections: 1,
        options: [
          {
            id: 'p',
            label: 'Pequena (500g)',
            description: 'Ideal para uma refeição leve',
            priceOverride: 24
          },
          {
            id: 'm',
            label: 'Média (650g)',
            description: 'Serve bem uma pessoa',
            priceOverride: 29
          },
          {
            id: 'g',
            label: 'Grande (800g)',
            description: 'Serve com folga ou para dividir',
            priceOverride: 34
          }
        ]
      },
      {
        id: 'protein',
        title: 'Escolha a mistura',
        description: 'Selecione a proteína principal',
        selectionType: 'single',
        minSelections: 1,
        options: [
          {
            id: 'frango',
            label: 'Frango grelhado',
            description: 'Temperado com ervas frescas',
            priceAdjustment: 0
          },
          {
            id: 'carne',
            label: 'Carne acebolada',
            description: 'Alcatra fatiada com cebolas caramelizadas',
            priceAdjustment: 3
          },
          {
            id: 'tilapia',
            label: 'Tilápia crocante',
            description: 'Empanada na farinha panko',
            priceAdjustment: 4
          },
          {
            id: 'veg',
            label: 'Mix vegetariano',
            description: 'Cogumelos, tofu grelhado e legumes',
            priceAdjustment: 2
          }
        ]
      },
      {
        id: 'sides',
        title: 'Escolha até 2 acompanhamentos',
        description: 'Selecione os complementos preferidos',
        selectionType: 'multi',
        minSelections: 2,
        maxSelections: 2,
        options: [
          {
            id: 'vinagrete',
            label: 'Vinagrete',
            priceAdjustment: 0
          },
          {
            id: 'farofa',
            label: 'Farofa crocante',
            priceAdjustment: 0
          },
          {
            id: 'pure',
            label: 'Purê de batata',
            priceAdjustment: 1
          },
          {
            id: 'legumes',
            label: 'Legumes no vapor',
            priceAdjustment: 1
          },
          {
            id: 'salada',
            label: 'Salada fresca',
            priceAdjustment: 0
          }
        ]
      }
    ]
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
