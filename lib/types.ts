// ============================================================
// ZapMaxx - Multi-tenant Catalog/Delivery System Types
// ============================================================

export interface Estabelecimento {
  id: number
  relUsersId?: string
  afiliado?: string
  nome: string
  descricao?: string
  segmento?: string
  estado?: string
  cidade?: string
  subdominio: string
  perfil?: string
  capa?: string
  cor: string
  pedidoMinimo: number

  // Formas de pagamento presencial
  pagamentoDinheiro: string
  pagamentoCartaoDebito: string
  pagamentoCartaoDebitoBandeiras?: string
  pagamentoCartaoCredito: string
  pagamentoCartaoCreditoBandeiras?: string
  pagamentoCartaoAlimentacao: string
  pagamentoCartaoAlimentacaoBandeiras?: string
  pagamentoOutros: string
  pagamentoOutrosDescricao?: string
  pagamentoPix: string
  tipopix?: string
  chavePix?: string
  beneficiarioPix?: string

  // ASAAS
  asaasHabilitado: boolean
  asaasApiKey?: string
  asaasSandbox: boolean
  asaasPixHabilitado: boolean
  asaasCartaoHabilitado: boolean
  asaasBoletoHabilitado: boolean

  // Endereco
  enderecoCep?: string
  enderecoNumero?: string
  enderecoBairro?: string
  enderecoRua?: string
  enderecoComplemento?: string
  enderecoReferencia?: string

  // Contato
  contatoWhatsapp?: string
  contatoEmail?: string
  contatoInstagram?: string
  contatoFacebook?: string

  // Tipos de entrega
  delivery: string
  retirada: string
  balcao: string
  mesa: string
  outros: string
  nomeoutros?: string

  // Horarios
  horarios?: string

  // Funcionalidades
  funcionalidadeMarketplace: string
  funcionalidadeVariacao: string
  funcionalidadeBanners: string
  limiteProdutos: string

  // Status e controle
  status: string
  statusForce: string
  funcionamento: string
  expiracao?: string
  calcularfrete: number
  tipofrete?: number
}

export interface Categoria {
  id: number
  relEstabelecimentosId: string
  ordem: number
  nome: string
  visible: string
  status: string
  domingo: number
  segunda: number
  terca: number
  quarta: number
  quinta: number
  sexta: number
  sabado: number
  feriados: number
}

export interface Produto {
  id: number
  relEstabelecimentosId: string
  relCategoriasId: string
  destaque?: string
  ref?: string
  nome: string
  descricao?: string
  valor: number
  oferta: string
  valorPromocional?: number
  variacao?: string
  visible: string
  status: string
  statusp: string
  estoque: string
  posicao: string
  videoLink?: string
  midias?: Midia[]
}

export interface Midia {
  id: number
  type?: string
  relEstabelecimentosId?: string
  relId?: string
  url: string
}

export interface Banner {
  id: number
  relEstabelecimentosId: string
  titulo?: string
  desktop?: string
  mobile: string
  videoLink?: string
  link?: string
  status: string
}

export interface Frete {
  id: number
  relEstabelecimentosId: string
  nome: string
  valor: number
  outros: string
}

export interface Cupom {
  id: number
  relEstabelecimentosId: string
  nome?: string
  descricao?: string
  codigo: string
  tipo: string // "1"=porcentagem, "2"=fixo
  descontoPorcentagem?: string
  descontoFixo?: number
  valorMaximo?: number
  quantidade?: string
  validade?: string
}

export interface VariacaoGrupo {
  nome: string
  escolha_minima: string
  escolha_maxima: string
  item: VariacaoItem[]
}

export interface VariacaoItem {
  nome: string
  descricao?: string
  valor?: string
}

// Cart types
export interface CartItem {
  id: string // unique cart item id
  produtoId: number
  nome: string
  imagem?: string
  quantidade: number
  valorUnitario: number
  observacao?: string
  variacoes?: CartItemVariacao[]
  subtotal: number
}

export interface CartItemVariacao {
  grupoNome: string
  escolhas: { nome: string; valor: number }[]
}

export interface Pedido {
  id: number
  relEstabelecimentosId: string
  nome?: string
  whatsapp?: string
  formaEntrega: string
  estado?: string
  cidade?: string
  enderecoCep?: string
  enderecoNumero?: string
  enderecoBairro?: string
  enderecoRua?: string
  enderecoComplemento?: string
  enderecoReferencia?: string
  formaPagamento?: string
  formaPagamentoInfo?: string
  json?: string
  status: string
  statusp: string
  mesa?: number
  dataHora?: string
  cupom?: string
  vPedido: number
  taxa: number
  mensagem?: string
  linkpagamento?: string
  referencia?: string
  statuspagamento?: string
}

export interface Plano {
  id: number
  nome: string
  descricao?: string
  duracaoMeses?: string
  duracaoDias?: string
  valorTotal: number
  valorMensal: number
  funcionalidadeMarketplace: string
  funcionalidadeVariacao: string
  funcionalidadeBanners: string
  visible: string
  status: string
  ordem: string
  limiteProdutos: string
}

export interface Assinatura {
  id: number
  relPlanosId: string
  relEstabelecimentosId: string
  nome?: string
  status: string
  expiration?: string
  created?: string
}

export type PedidoStatus = "1" | "2" | "3" | "4" | "5" | "6"

export const PEDIDO_STATUS_LABELS: Record<PedidoStatus, string> = {
  "1": "Aguardando",
  "2": "Aceito",
  "3": "Em preparo",
  "4": "Saiu para entrega",
  "5": "Entregue",
  "6": "Cancelado",
}

export const PEDIDO_STATUS_COLORS: Record<PedidoStatus, string> = {
  "1": "bg-yellow-100 text-yellow-800",
  "2": "bg-blue-100 text-blue-800",
  "3": "bg-orange-100 text-orange-800",
  "4": "bg-indigo-100 text-indigo-800",
  "5": "bg-green-100 text-green-800",
  "6": "bg-red-100 text-red-800",
}

export const FORMA_PAGAMENTO_LABELS: Record<string, string> = {
  "1": "Dinheiro",
  "2": "Cartao Debito",
  "3": "Cartao Credito",
  "4": "Cartao Alimentacao",
  "5": "Outros",
  "6": "PIX",
  "7": "PIX (Online)",
  "8": "Cartao (Online)",
  "9": "Boleto",
}

// ============================================================
// Pixel / Tracking Types
// ============================================================

export type PixelProvider = "facebook" | "google_analytics" | "google_ads" | "tiktok"

export interface Pixel {
  id: number
  relEstabelecimentosId?: string // per-store pixel (null = platform-level)
  provider: PixelProvider
  pixelId: string
  label?: string
  ativo: boolean
}

export const PIXEL_PROVIDER_LABELS: Record<PixelProvider, string> = {
  facebook: "Facebook Pixel",
  google_analytics: "Google Analytics",
  google_ads: "Google Ads",
  tiktok: "TikTok Pixel",
}

// ============================================================
// ASAAS Integration Types
// ============================================================

export interface AsaasConfig {
  apiKey: string
  sandbox: boolean
  pixHabilitado: boolean
  cartaoHabilitado: boolean
  boletoHabilitado: boolean
}

export interface AsaasPaymentResponse {
  id: string
  status: "PENDING" | "RECEIVED" | "CONFIRMED" | "OVERDUE" | "REFUNDED" | "CANCELLED"
  value: number
  billingType: "PIX" | "CREDIT_CARD" | "BOLETO"
  invoiceUrl?: string
  pixQrCodeUrl?: string
  pixCopiaECola?: string
  bankSlipUrl?: string
}

export interface AsaasCustomer {
  id: string
  name: string
  cpfCnpj: string
  email?: string
  phone?: string
}

export interface AsaasPaymentRequest {
  customer: string
  billingType: "PIX" | "CREDIT_CARD" | "BOLETO"
  value: number
  dueDate: string
  description?: string
  externalReference?: string
}

// ============================================================
// Platform Config Types
// ============================================================

export interface PlataformaConfig {
  id: number
  asaasApiKeyGlobal?: string
  asaasSandboxGlobal: boolean
  pixels: Pixel[]
}

// ============================================================
// Trial Coupon Types
// ============================================================

export interface CupomTrial {
  id: number
  codigo: string
  diasTrial: number
  relPlanosId?: string
  usado: boolean
  usadoPor?: string // email of user who redeemed it
  usadoEm?: string  // ISO date when redeemed
  criadoPor: string // admin email who created it
  criadoEm: string  // ISO date
  expiracao?: string // ISO date, coupon itself can expire
  observacao?: string
}

// ============================================================
// User / Admin Types
// ============================================================

export interface Usuario {
  id: number
  nome: string
  email: string
  cpfCnpj?: string
  role: "admin" | "owner"
  status: string
  relEstabelecimentosId?: string
  estabelecimentoNome?: string
  trialEndsAt?: string
  createdAt: string
}
