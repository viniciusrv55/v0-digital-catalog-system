import type {
  Estabelecimento,
  Categoria,
  Produto,
  Banner,
  Frete,
  Cupom,
  Pedido,
} from "./types"
import {
  mockLoja,
  mockCategorias,
  mockProdutos,
  mockBanners,
  mockFretes,
  mockCupons,
  mockPedidos,
} from "./mock-data"

// ============================================================
// Multi-tenant data layer
// Each establishment is keyed by its numeric id.
// In production this would query the database filtered by
// `estabelecimento_id` — for now it returns mock data per tenant.
// ============================================================

// Second mock establishment
const acaiLoja: Estabelecimento = {
  id: 2,
  relUsersId: "3",
  nome: "Acai Power",
  descricao: "O melhor acai da regiao! Bowls, cremes e complementos especiais.",
  segmento: "Delivery",
  estado: "RJ",
  cidade: "Rio de Janeiro",
  subdominio: "acaipower",
  perfil: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200&h=200&fit=crop",
  capa: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=1200&h=400&fit=crop",
  cor: "#7c3aed",
  pedidoMinimo: 15,
  pagamentoDinheiro: "1",
  pagamentoCartaoDebito: "1",
  pagamentoCartaoDebitoBandeiras: "Visa,Mastercard",
  pagamentoCartaoCredito: "1",
  pagamentoCartaoCreditoBandeiras: "Visa,Mastercard",
  pagamentoCartaoAlimentacao: "2",
  pagamentoOutros: "2",
  pagamentoPix: "1",
  tipopix: "telefone",
  chavePix: "(21) 98888-1234",
  beneficiarioPix: "Acai Power LTDA",
  asaasHabilitado: false,
  asaasSandbox: true,
  asaasPixHabilitado: false,
  asaasCartaoHabilitado: false,
  asaasBoletoHabilitado: false,
  enderecoCep: "20040-020",
  enderecoNumero: "456",
  enderecoBairro: "Copacabana",
  enderecoRua: "Av. Atlantica",
  enderecoComplemento: "Loja 2",
  contatoWhatsapp: "(21) 98888-1234",
  contatoEmail: "contato@acaipower.com",
  contatoInstagram: "@acaipower",
  delivery: "1",
  retirada: "1",
  balcao: "1",
  mesa: "2",
  outros: "2",
  horarios: JSON.stringify({
    tarde: [
      { dia: "0", inicio: "10:00", fim: "22:00", ativo: true },
      { dia: "1", inicio: "10:00", fim: "22:00", ativo: true },
      { dia: "2", inicio: "10:00", fim: "22:00", ativo: true },
      { dia: "3", inicio: "10:00", fim: "22:00", ativo: true },
      { dia: "4", inicio: "10:00", fim: "22:00", ativo: true },
      { dia: "5", inicio: "10:00", fim: "22:00", ativo: true },
      { dia: "6", inicio: "10:00", fim: "22:00", ativo: true },
    ],
  }),
  funcionalidadeMarketplace: "1",
  funcionalidadeVariacao: "1",
  funcionalidadeBanners: "1",
  limiteProdutos: "50",
  status: "1",
  statusForce: "2",
  funcionamento: "1",
  expiracao: "2026-06-30",
  calcularfrete: 1,
}

const acaiCategorias: Categoria[] = [
  {
    id: 100, relEstabelecimentosId: "2", ordem: 0, nome: "Acai Bowls",
    visible: "1", status: "1",
    domingo: 1, segunda: 1, terca: 1, quarta: 1, quinta: 1, sexta: 1, sabado: 1, feriados: 1,
  },
  {
    id: 101, relEstabelecimentosId: "2", ordem: 1, nome: "Cremes",
    visible: "1", status: "1",
    domingo: 1, segunda: 1, terca: 1, quarta: 1, quinta: 1, sexta: 1, sabado: 1, feriados: 1,
  },
]

const acaiProdutos: Produto[] = [
  {
    id: 100, relEstabelecimentosId: "2", relCategoriasId: "100",
    destaque: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
    nome: "Acai Tradicional 500ml", descricao: "Acai puro batido com guarana, banana e granola.",
    valor: 22.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "0",
  },
  {
    id: 101, relEstabelecimentosId: "2", relCategoriasId: "100",
    destaque: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop",
    nome: "Acai Premium 700ml", descricao: "Acai premium com morango, kiwi, leite ninho e granola.",
    valor: 32.90, oferta: "1", valorPromocional: 28.90, visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "1",
  },
  {
    id: 102, relEstabelecimentosId: "2", relCategoriasId: "101",
    destaque: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop",
    nome: "Creme de Cupuacu 300ml", descricao: "Creme de cupuacu com leite condensado.",
    valor: 18.90, oferta: "2", visible: "1", status: "1", statusp: "1", estoque: "1", posicao: "0",
  },
]

const acaiBanners: Banner[] = [
  {
    id: 100, relEstabelecimentosId: "2",
    titulo: "Promo Acai",
    mobile: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=400&fit=crop",
    desktop: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1200&h=400&fit=crop",
    status: "1",
  },
]

const acaiFretes: Frete[] = [
  { id: 100, relEstabelecimentosId: "2", nome: "Copacabana", valor: 3.00, outros: "0" },
  { id: 101, relEstabelecimentosId: "2", nome: "Ipanema", valor: 5.00, outros: "0" },
]

const acaiCupons: Cupom[] = []

const acaiPedidos: Pedido[] = [
  {
    id: 2001, relEstabelecimentosId: "2",
    nome: "Ana Costa", whatsapp: "(21) 99999-1111",
    formaEntrega: "delivery", enderecoBairro: "Copacabana",
    enderecoRua: "Rua Barata Ribeiro", enderecoNumero: "10",
    formaPagamento: "6", status: "1", statusp: "1",
    dataHora: new Date().toISOString(),
    vPedido: 55.80, taxa: 3.00,
    json: "2x Acai Tradicional 500ml, 1x Creme de Cupuacu 300ml",
  },
]

// ------ Registry ------

interface TenantData {
  loja: Estabelecimento
  categorias: Categoria[]
  produtos: Produto[]
  banners: Banner[]
  fretes: Frete[]
  cupons: Cupom[]
  pedidos: Pedido[]
}

const TENANT_DB: Record<number, TenantData> = {
  1: {
    loja: mockLoja,
    categorias: mockCategorias,
    produtos: mockProdutos,
    banners: mockBanners,
    fretes: mockFretes,
    cupons: mockCupons,
    pedidos: mockPedidos,
  },
  2: {
    loja: acaiLoja,
    categorias: acaiCategorias,
    produtos: acaiProdutos,
    banners: acaiBanners,
    fretes: acaiFretes,
    cupons: acaiCupons,
    pedidos: acaiPedidos,
  },
}

// All establishments (for admin views)
export function getAllEstabelecimentos(): Estabelecimento[] {
  return Object.values(TENANT_DB).map((t) => t.loja)
}

// Get data for a specific tenant
export function getTenantData(estabelecimentoId: number): TenantData | null {
  return TENANT_DB[estabelecimentoId] ?? null
}

// Get establishment by subdomain (for public storefront routing)
export function getEstabelecimentoBySubdominio(subdominio: string): TenantData | null {
  const entry = Object.values(TENANT_DB).find(
    (t) => t.loja.subdominio.toLowerCase() === subdominio.toLowerCase()
  )
  return entry ?? null
}
