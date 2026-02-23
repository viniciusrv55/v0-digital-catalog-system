import type {
  Estabelecimento,
  Categoria,
  Produto,
  Banner,
  Frete,
  Cupom,
  Pedido,
  Pixel,
  Plano,
  Usuario,
  PlataformaConfig,
  CupomTrial,
} from "./types"

// ============================================================
// Mock Data - Pizzaria "Pizza da Boa"
// ============================================================

export const mockLoja: Estabelecimento = {
  id: 1,
  relUsersId: "1",
  nome: "Pizza da Boa",
  descricao: "A melhor pizza artesanal da cidade. Massa fresca, ingredientes selecionados e muito sabor!",
  segmento: "Delivery",
  estado: "SP",
  cidade: "Sao Paulo",
  subdominio: "pizzadaboa",
  perfil: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
  capa: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=1200&h=400&fit=crop",
  cor: "#ff3c00",
  pedidoMinimo: 20,

  pagamentoDinheiro: "1",
  pagamentoCartaoDebito: "1",
  pagamentoCartaoDebitoBandeiras: "Visa,Mastercard",
  pagamentoCartaoCredito: "1",
  pagamentoCartaoCreditoBandeiras: "Visa,Mastercard,Elo",
  pagamentoCartaoAlimentacao: "1",
  pagamentoCartaoAlimentacaoBandeiras: "VR,Sodexo",
  pagamentoOutros: "2",
  pagamentoPix: "1",
  tipopix: "telefone",
  chavePix: "(11) 99999-9999",
  beneficiarioPix: "Pizza da Boa LTDA",

  asaasHabilitado: false,
  asaasSandbox: true,
  asaasPixHabilitado: false,
  asaasCartaoHabilitado: false,
  asaasBoletoHabilitado: false,

  enderecoCep: "01001-000",
  enderecoNumero: "123",
  enderecoBairro: "Centro",
  enderecoRua: "Rua Augusta",
  enderecoComplemento: "Loja 1",

  contatoWhatsapp: "(11) 99999-9999",
  contatoEmail: "contato@pizzadaboa.com",
  contatoInstagram: "@pizzadaboa",

  delivery: "1",
  retirada: "1",
  balcao: "1",
  mesa: "1",
  outros: "2",

  horarios: JSON.stringify({
    tarde: [
      { dia: "1", inicio: "18:00", fim: "23:00", ativo: true },
      { dia: "2", inicio: "18:00", fim: "23:00", ativo: true },
      { dia: "3", inicio: "18:00", fim: "23:00", ativo: true },
      { dia: "4", inicio: "18:00", fim: "23:00", ativo: true },
      { dia: "5", inicio: "18:00", fim: "23:00", ativo: true },
      { dia: "6", inicio: "18:00", fim: "23:00", ativo: true },
      { dia: "0", inicio: "18:00", fim: "23:00", ativo: true },
    ],
  }),

  funcionalidadeMarketplace: "1",
  funcionalidadeVariacao: "1",
  funcionalidadeBanners: "1",
  limiteProdutos: "999",

  status: "1",
  statusForce: "2",
  funcionamento: "1",
  expiracao: "2026-12-31",
  calcularfrete: 1,
}

export const mockCategorias: Categoria[] = [
  {
    id: 1, relEstabelecimentosId: "1", ordem: 0, nome: "Pizzas",
    visible: "1", status: "1",
    domingo: 1, segunda: 1, terca: 1, quarta: 1, quinta: 1, sexta: 1, sabado: 1, feriados: 1,
  },
  {
    id: 2, relEstabelecimentosId: "1", ordem: 1, nome: "Bebidas",
    visible: "1", status: "1",
    domingo: 1, segunda: 1, terca: 1, quarta: 1, quinta: 1, sexta: 1, sabado: 1, feriados: 1,
  },
  {
    id: 3, relEstabelecimentosId: "1", ordem: 2, nome: "Sobremesas",
    visible: "1", status: "1",
    domingo: 1, segunda: 1, terca: 1, quarta: 1, quinta: 1, sexta: 1, sabado: 1, feriados: 1,
  },
]

const tamanhoVariacao = JSON.stringify([
  {
    nome: "Tamanho",
    escolha_minima: "1",
    escolha_maxima: "1",
    item: [
      { nome: "Broto", descricao: "6 fatias", valor: "0" },
      { nome: "Media", descricao: "8 fatias", valor: "10" },
      { nome: "Grande", descricao: "12 fatias", valor: "20" },
    ],
  },
])

export const mockProdutos: Produto[] = [
  // Pizzas
  {
    id: 1, relEstabelecimentosId: "1", relCategoriasId: "1",
    destaque: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    nome: "Margherita", descricao: "Molho de tomate fresco, mussarela de bufala, manjericao e azeite extra virgem.",
    valor: 39.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "0",
    variacao: tamanhoVariacao,
  },
  {
    id: 2, relEstabelecimentosId: "1", relCategoriasId: "1",
    destaque: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    nome: "Calabresa Especial", descricao: "Calabresa artesanal, cebola caramelizada, azeitonas pretas e oregano.",
    valor: 42.90, oferta: "1", valorPromocional: 35.90, visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "1",
    variacao: tamanhoVariacao,
  },
  {
    id: 3, relEstabelecimentosId: "1", relCategoriasId: "1",
    destaque: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400&h=300&fit=crop",
    nome: "Quatro Queijos", descricao: "Mussarela, gorgonzola, parmesao e catupiry cremoso.",
    valor: 45.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "2",
    variacao: tamanhoVariacao,
  },
  {
    id: 4, relEstabelecimentosId: "1", relCategoriasId: "1",
    destaque: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
    nome: "Frango com Catupiry", descricao: "Frango desfiado temperado, catupiry cremoso, milho e oregano.",
    valor: 41.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "3",
    variacao: tamanhoVariacao,
  },
  // Bebidas
  {
    id: 5, relEstabelecimentosId: "1", relCategoriasId: "2",
    destaque: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop",
    nome: "Coca-Cola 2L", descricao: "Refrigerante Coca-Cola garrafa 2 litros.",
    valor: 12.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "0",
  },
  {
    id: 6, relEstabelecimentosId: "1", relCategoriasId: "2",
    destaque: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=300&fit=crop",
    nome: "Guarana Antarctica 2L", descricao: "Refrigerante Guarana Antarctica garrafa 2 litros.",
    valor: 11.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "1",
  },
  {
    id: 7, relEstabelecimentosId: "1", relCategoriasId: "2",
    destaque: "https://images.unsplash.com/photo-1568702846914-96b305d2ebb1?w=400&h=300&fit=crop",
    nome: "Suco Natural Laranja", descricao: "Suco de laranja natural, 500ml. Feito na hora!",
    valor: 9.90, oferta: "1", valorPromocional: 7.90, visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "2",
  },
  {
    id: 8, relEstabelecimentosId: "1", relCategoriasId: "2",
    destaque: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=300&fit=crop",
    nome: "Agua Mineral 500ml", descricao: "Agua mineral sem gas, garrafa 500ml.",
    valor: 4.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "3",
  },
  // Sobremesas
  {
    id: 9, relEstabelecimentosId: "1", relCategoriasId: "3",
    destaque: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    nome: "Pizza Doce Nutella", descricao: "Massa crocante com Nutella, morango fresco e acucar de confeiteiro.",
    valor: 35.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "0",
  },
  {
    id: 10, relEstabelecimentosId: "1", relCategoriasId: "3",
    destaque: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=300&fit=crop",
    nome: "Petit Gateau", descricao: "Bolinho de chocolate com centro derretido, servido com sorvete de creme.",
    valor: 24.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "1",
  },
  {
    id: 11, relEstabelecimentosId: "1", relCategoriasId: "3",
    destaque: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    nome: "Tiramisu", descricao: "Classico italiano com cafe, mascarpone e cacau.",
    valor: 19.90, oferta: "1", valorPromocional: 15.90, visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "2",
  },
  {
    id: 12, relEstabelecimentosId: "1", relCategoriasId: "3",
    destaque: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    nome: "Churros com Doce de Leite", descricao: "Churros crocante recheado com doce de leite artesanal.",
    valor: 14.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "3",
  },
]

export const mockBanners: Banner[] = [
  {
    id: 1, relEstabelecimentosId: "1",
    titulo: "Promocao de Inauguracao",
    mobile: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=400&fit=crop",
    desktop: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=400&fit=crop",
    status: "1",
  },
  {
    id: 2, relEstabelecimentosId: "1",
    titulo: "Combo Familia",
    mobile: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&h=400&fit=crop",
    desktop: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=1200&h=400&fit=crop",
    status: "1",
  },
]

export const mockFretes: Frete[] = [
  { id: 1, relEstabelecimentosId: "1", nome: "Centro", valor: 4.00, outros: "0" },
  { id: 2, relEstabelecimentosId: "1", nome: "Demais bairros", valor: 7.00, outros: "0" },
]

export const mockCupons: Cupom[] = [
  {
    id: 1, relEstabelecimentosId: "1",
    nome: "Promo 10%", descricao: "10% de desconto em qualquer pedido",
    codigo: "PROMO10", tipo: "1", descontoPorcentagem: "10",
    quantidade: "100", validade: "2026-12-31",
  },
]

export const mockPedidos: Pedido[] = [
  {
    id: 1001, relEstabelecimentosId: "1",
    nome: "Joao Silva", whatsapp: "(11) 98888-7777",
    formaEntrega: "delivery", enderecoBairro: "Centro",
    enderecoRua: "Rua das Flores", enderecoNumero: "42",
    enderecoCep: "01001-000",
    formaPagamento: "6", status: "1", statusp: "1",
    dataHora: new Date().toISOString(),
    vPedido: 89.70, taxa: 4.00,
    json: "2x Margherita, 1x Coca-Cola 2L",
  },
  {
    id: 1002, relEstabelecimentosId: "1",
    nome: "Maria Oliveira", whatsapp: "(11) 97777-6666",
    formaEntrega: "retirada",
    formaPagamento: "1", status: "3", statusp: "1",
    dataHora: new Date(Date.now() - 3600000).toISOString(),
    vPedido: 42.90, taxa: 0,
    json: "1x Calabresa Especial Grande",
  },
  {
    id: 1003, relEstabelecimentosId: "1",
    nome: "Carlos Santos", whatsapp: "(11) 96666-5555",
    formaEntrega: "delivery", enderecoBairro: "Demais bairros",
    enderecoRua: "Av. Brasil", enderecoNumero: "100",
    formaPagamento: "3", status: "5", statusp: "1",
    dataHora: new Date(Date.now() - 7200000).toISOString(),
    vPedido: 110.60, taxa: 7.00,
    json: "1x Quatro Queijos Grande, 1x Frango com Catupiry, 1x Guarana 2L",
  },
]

// ============================================================
// Mock Planos (for admin management)
// ============================================================
export const mockPlanos: Plano[] = [
  {
    id: 1, nome: "Gratis", descricao: "Plano gratuito com funcionalidades basicas",
    duracaoMeses: "1", duracaoDias: "30", valorTotal: 0, valorMensal: 0,
    funcionalidadeMarketplace: "2", funcionalidadeVariacao: "2", funcionalidadeBanners: "2",
    visible: "1", status: "1", ordem: "1", limiteProdutos: "10",
  },
  {
    id: 2, nome: "Essencial", descricao: "Ideal para pequenos negocios",
    duracaoMeses: "1", duracaoDias: "30", valorTotal: 49.90, valorMensal: 49.90,
    funcionalidadeMarketplace: "1", funcionalidadeVariacao: "1", funcionalidadeBanners: "1",
    visible: "1", status: "1", ordem: "2", limiteProdutos: "50",
  },
  {
    id: 3, nome: "Profissional", descricao: "Para negocios em crescimento com pagamento online",
    duracaoMeses: "1", duracaoDias: "30", valorTotal: 99.90, valorMensal: 99.90,
    funcionalidadeMarketplace: "1", funcionalidadeVariacao: "1", funcionalidadeBanners: "1",
    visible: "1", status: "1", ordem: "3", limiteProdutos: "999",
  },
]

// ============================================================
// Mock Usuarios
// ============================================================
export const mockUsuarios: Usuario[] = [
  { id: 1, nome: "Admin Master", email: "admin@zapmaxx.com.br", role: "admin", status: "1", createdAt: "2025-01-15T10:00:00Z" },
  { id: 2, nome: "Joao Pizza", email: "joao@pizzadaboa.com", cpfCnpj: "123.456.789-00", role: "owner", status: "1", relEstabelecimentosId: "1", estabelecimentoNome: "Pizza da Boa", trialEndsAt: "2026-12-31", createdAt: "2025-03-10T14:30:00Z" },
  { id: 3, nome: "Maria Acai", email: "maria@acaipower.com", cpfCnpj: "987.654.321-00", role: "owner", status: "1", relEstabelecimentosId: "2", estabelecimentoNome: "Acai Power", trialEndsAt: "2027-03-15", createdAt: "2025-05-20T09:15:00Z" },
  { id: 4, nome: "Carlos Burger", email: "carlos@bklab.com", cpfCnpj: "11.222.333/0001-44", role: "owner", status: "1", relEstabelecimentosId: "3", estabelecimentoNome: "Burger King Lab", trialEndsAt: "2026-06-01", createdAt: "2025-06-01T11:00:00Z" },
  { id: 5, nome: "Ana Sushi", email: "ana@sushitokyo.com", cpfCnpj: "555.666.777-88", role: "owner", status: "2", relEstabelecimentosId: "4", estabelecimentoNome: "Sushi Tokyo", createdAt: "2025-07-12T16:45:00Z" },
  { id: 6, nome: "Pedro Cafe", email: "pedro@cafearoma.com", cpfCnpj: "999.888.777-66", role: "owner", status: "1", relEstabelecimentosId: "5", estabelecimentoNome: "Cafe Aroma", trialEndsAt: "2027-01-20", createdAt: "2025-08-05T08:30:00Z" },
]

// ============================================================
// Mock Pixels
// ============================================================
export const mockPixels: Pixel[] = [
  { id: 1, provider: "facebook", pixelId: "123456789012345", label: "Facebook Pixel Principal", ativo: true },
  { id: 2, provider: "google_analytics", pixelId: "G-XXXXXXXXXX", label: "GA4 Plataforma", ativo: true },
]

export const mockPixelsLoja: Pixel[] = [
  { id: 10, relEstabelecimentosId: "1", provider: "facebook", pixelId: "999888777666555", label: "FB Pixel Loja", ativo: true },
  { id: 11, relEstabelecimentosId: "1", provider: "google_analytics", pixelId: "G-LOJAPIZZA", label: "GA4 Loja", ativo: false },
]

// ============================================================
// Mock Cupons de Trial
// ============================================================
export const mockCuponsTrial: CupomTrial[] = [
  {
    id: 1,
    codigo: "TRIAL-JOAO-2026",
    diasTrial: 30,
    relPlanosId: "2",
    usado: true,
    usadoPor: "joao@pizzadaboa.com",
    usadoEm: "2025-03-10T14:30:00Z",
    criadoPor: "admin@zapmaxx.com.br",
    criadoEm: "2025-03-01T10:00:00Z",
    observacao: "Cupom para teste do Joao",
  },
  {
    id: 2,
    codigo: "TRIAL-MARIA-2026",
    diasTrial: 30,
    relPlanosId: "3",
    usado: true,
    usadoPor: "maria@acaipower.com",
    usadoEm: "2025-05-20T09:15:00Z",
    criadoPor: "admin@zapmaxx.com.br",
    criadoEm: "2025-05-15T08:00:00Z",
  },
  {
    id: 3,
    codigo: "TRIAL-DEMO-30D",
    diasTrial: 30,
    relPlanosId: "2",
    usado: false,
    criadoPor: "admin@zapmaxx.com.br",
    criadoEm: "2026-02-20T12:00:00Z",
    expiracao: "2026-12-31",
    observacao: "Cupom de demonstracao disponivel",
  },
  {
    id: 4,
    codigo: "TRIAL-VIP-60D",
    diasTrial: 60,
    relPlanosId: "3",
    usado: false,
    criadoPor: "admin@zapmaxx.com.br",
    criadoEm: "2026-02-20T12:00:00Z",
    expiracao: "2026-06-30",
    observacao: "Cupom VIP 60 dias - Plano Profissional",
  },
]

// ============================================================
// Mock Plataforma Config
// ============================================================
export const mockPlataformaConfig: PlataformaConfig = {
  id: 1,
  asaasApiKeyGlobal: "",
  asaasSandboxGlobal: true,
  pixels: mockPixels,
}
