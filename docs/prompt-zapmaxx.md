# PROMPT COMPLETO — Sistema de Catálogo Digital / Delivery Multi-Tenant
### Copie tudo abaixo desta linha e cole no v0.dev

---

```
Crie um sistema completo de catálogo digital / delivery multi-tenant em Next.js 14 (App Router) com TypeScript e Tailwind CSS, pronto para deploy em VPS com Docker ou PM2. O sistema é uma plataforma SaaS onde cada loja (estabelecimento) tem seu próprio subdomínio e cardápio digital com pedidos via WhatsApp.

---

## STACK TECNOLÓGICA

- Next.js 14 com App Router + TypeScript
- Tailwind CSS + shadcn/ui (cards, tables, forms, dialogs, badges, toasts)
- Prisma ORM com PostgreSQL (Supabase)
- NextAuth.js com JWT (sessões separadas por nível de acesso)
- React Hook Form + Zod para validação
- Zustand para estado global da sacola
- Lucide React para ícones
- next-pwa para Progressive Web App
- Supabase Storage para upload de imagens
- ASAAS como gateway de pagamento (PIX, cartão, boleto)

---

## ESTRUTURA DE PASTAS

```
/app
  /(auth)/login/page.tsx
  /(auth)/esqueci/page.tsx
  /(auth)/comece/page.tsx          ← cadastro multi-step (3 etapas)
  /painel/
    /inicio/page.tsx
    /pedidos/page.tsx
    /produtos/page.tsx
    /categorias/page.tsx
    /banners/page.tsx
    /frete/page.tsx
    /cupons/page.tsx
    /configuracoes/page.tsx
    /plano/page.tsx
    /relatorio/page.tsx
    layout.tsx
  /administracao/
    /inicio/page.tsx
    /estabelecimentos/page.tsx
    /usuarios/page.tsx
    /planos/page.tsx
    /segmentos/page.tsx
    /vouchers/page.tsx
    /assinaturas/page.tsx
    /pedidos/page.tsx
    /logs/page.tsx
    layout.tsx
  /afiliado/
    /inicio/page.tsx
    /estabelecimentos/page.tsx
    /planos/page.tsx
    /vouchers/page.tsx
    layout.tsx
  /api/
    /auth/[...nextauth]/route.ts
    /pedidos/route.ts
    /produtos/route.ts
    /categorias/route.ts
    /frete/route.ts
    /cupons/route.ts
    /banners/route.ts
    /asaas/cobranca/route.ts
    /asaas/webhook/route.ts
    /upload/route.ts
/[slug]/                           ← subdomínio via middleware
  /page.tsx                        ← cardápio público
  /produto/[id]/page.tsx
  /pagamento/[pedidoId]/page.tsx   ← tela PIX/boleto/cartão ASAAS
/middleware.ts                     ← resolve subdomínio → loja
/prisma/schema.prisma
```

---

## BANCO DE DADOS — SCHEMA PRISMA (PostgreSQL/Supabase)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          Int       @id @default(autoincrement())
  nome        String?
  email       String    @unique
  password    String
  level       String    @default("2")
  // level: "1" = admin/afiliado, "2" = estabelecimento
  operacao    String    @default("2")
  // operacao: "1" = admin/afiliado, "2" = estabelecimento
  status      String    @default("1")
  recoverKey  String?   @map("recover_key")
  keepalive   String?
  comis       String?
  createdAt   DateTime? @map("created")
  lastLogin   DateTime? @map("last_login")

  userData        UserData?
  estabelecimento Estabelecimento?
  logs            Log[]

  @@map("users")
}

model UserData {
  id            Int     @id @default(autoincrement())
  relUsersId    String? @map("rel_users_id")
  nascimento    String?
  documentoTipo String? @map("documento_tipo")
  documento     String?
  estado        String?
  cidade        String?
  telefone      String?
  comissao      String?

  user User? @relation(fields: [relUsersId], references: [id])

  @@map("users_data")
}

model Estabelecimento {
  id                              Int       @id @default(autoincrement())
  relUsersId                      String?   @map("rel_users_id")
  afiliado                        String?
  nome                            String?
  descricao                       String?
  segmento                        String?
  estado                          String?
  cidade                          String?
  subdominio                      String?   @unique
  perfil                          String?   // URL da foto de perfil/avatar
  capa                            String?   // URL da foto de capa
  cor                             String?   @default("#e11d48")
  pedidoMinimo                    Decimal?  @map("pedido_minimo") @db.Decimal(10, 2)

  // Formas de pagamento presencial
  pagamentoDinheiro               String?   @map("pagamento_dinheiro")     @default("2")
  pagamentoCartaoDebito           String?   @map("pagamento_cartao_debito") @default("2")
  pagamentoCartaoDebitoBandeiras  String?   @map("pagamento_cartao_debito_bandeiras")
  pagamentoCartaoCredito          String?   @map("pagamento_cartao_credito") @default("2")
  pagamentoCartaoCreditoBandeiras String?   @map("pagamento_cartao_credito_bandeiras")
  pagamentoCartaoAlimentacao      String?   @map("pagamento_cartao_alimentacao") @default("2")
  pagamentoCartaoAlimentacaoBandeiras String? @map("pagamento_cartao_alimentacao_bandeiras")
  pagamentoOutros                 String?   @map("pagamento_outros") @default("2")
  pagamentoOutrosDescricao        String?   @map("pagamento_outros_descricao")
  pagamentoPix                    String?   @map("pagamento_pix") @default("2")
  tipopix                         String?
  chavePix                        String?   @map("chave_pix")
  beneficiarioPix                 String?   @map("beneficiario_pix")

  // Integração ASAAS
  asaasHabilitado                 Boolean   @default(false) @map("asaas_habilitado")
  asaasApiKey                     String?   @map("asaas_api_key")
  asaasSandbox                    Boolean   @default(true) @map("asaas_sandbox")
  asaasPixHabilitado              Boolean   @default(false) @map("asaas_pix_habilitado")
  asaasCartaoHabilitado           Boolean   @default(false) @map("asaas_cartao_habilitado")
  asaasBoletoHabilitado           Boolean   @default(false) @map("asaas_boleto_habilitado")

  // Endereço
  enderecoCep          String?   @map("endereco_cep")
  enderecoNumero       String?   @map("endereco_numero")
  enderecoBairro       String?   @map("endereco_bairro")
  enderecoRua          String?   @map("endereco_rua")
  enderecoComplemento  String?   @map("endereco_complemento")
  enderecoReferencia   String?   @map("endereco_referencia")

  // Contato
  contatoWhatsapp  String?  @map("contato_whatsapp")
  contatoEmail     String?  @map("contato_email")
  contatoInstagram String?  @map("contato_instagram")
  contatoFacebook  String?  @map("contato_facebook")

  // Tipos de entrega disponíveis
  delivery  String?  @default("1")  // 1=ativo 2=inativo
  retirada  String?  @default("1")  @map("entrega_retirada")
  balcao    String?  @default("1")
  mesa      String?  @default("1")
  outros    String?  @default("2")
  nomeoutros String?

  // Horários (JSON: {"manha":[{"dia":"0","inicio":"08:00","fim":"12:00","ativo":true},...], "tarde":[...]})
  horarios  String?  @db.Text

  // Funcionalidades por plano
  funcionalidadeMarketplace String? @map("funcionalidade_marketplace") @default("2")
  funcionalidadeVariacao    String? @map("funcionalidade_variacao")    @default("2")
  funcionalidadeBanners     String? @map("funcionalidade_banners")     @default("2")
  limiteProdutos            String? @map("limite_produtos")            @default("999")

  // Dados responsável
  responsavelNome      String?  @map("responsavel_nome")
  responsavelNascimento String? @map("responsavel_nascimento")
  responsavelDocTipo   String?  @map("responsavel_documento_tipo")
  responsavelDoc       String?  @map("responsavel_documento")

  // Analytics
  estatisticasAnalytics String? @map("estatisticas_analytics")
  estatisticasPixel     String? @map("estatisticas_pixel")

  // Status e controle
  status        String?   @default("1")   // 1=ativo, 2=inativo
  statusForce   String?   @map("status_force") @default("2")
  funcionamento String?   @default("1")   // 1=aberto, 2=fechado (manual)
  expiracao     String?
  calcularfrete Int?      @default(2)     // 1=sim, 2=não
  tipofrete     Int?
  empresa       String?
  exibicao      String?   @default("1")   // 1=mostrar no marketplace

  createdAt    DateTime? @map("created")
  lastModified DateTime? @map("last_modified")
  lastLogin    DateTime? @map("last_login")

  user        User?         @relation(fields: [relUsersId], references: [id])
  produtos    Produto[]
  categorias  Categoria[]
  pedidos     Pedido[]
  banners     Banner[]
  fretes      Frete[]
  cupons      Cupom[]
  assinaturas Assinatura[]
  clientes    Cliente[]
  impressao   Impressao?

  @@map("estabelecimentos")
}

model Produto {
  id                    Int      @id @default(autoincrement())
  relEstabelecimentosId String?  @map("rel_estabelecimentos_id")
  relCategoriasId       String?  @map("rel_categorias_id")
  destaque              String?  // URL da imagem destaque
  ref                   String?
  nome                  String?
  descricao             String?  @db.Text
  valor                 Decimal? @db.Decimal(10, 2)
  oferta                String?  @default("2") // 1=em oferta
  valorPromocional      Decimal? @map("valor_promocional") @db.Decimal(10, 2)
  // variacao: JSON array de grupos de variação (codificado em base64 no sistema original)
  // Formato decodificado: [{"nome":"Tamanhos","escolha_minima":"1","escolha_maxima":"1","item":[{"nome":"P","descricao":"","valor":""},...]}]
  variacao              String?  @db.Text
  visible               String?  @default("1")  // 1=visível, 2=oculto
  status                String?  @default("1")  // 1=ativo, 2=inativo (esgotado)
  statusp               String?  @default("1")  // statusp: 1=disponível
  estoque               String?  @default("1")  // 1=ilimitado, 2=limitado
  posicao               String?  @default("0")
  videoLink             String?  @map("video_link")
  pesofrete             Float?
  createdAt             DateTime? @map("created")
  lastModified          DateTime? @map("last_modified")

  estabelecimento Estabelecimento? @relation(fields: [relEstabelecimentosId], references: [id])
  categoria       Categoria?       @relation(fields: [relCategoriasId], references: [id])
  midias          Midia[]

  @@map("produtos")
}

model Categoria {
  id                    Int      @id @default(autoincrement())
  relEstabelecimentosId String?  @map("rel_estabelecimentos_id")
  ordem                 Int      @default(0)
  nome                  String?
  visible               String?  @default("1")
  status                String?  @default("1")
  // Disponibilidade por dia da semana: 1=ativo, 2=inativo
  domingo   Int  @default(1)
  segunda   Int  @default(1)
  terca     Int  @default(1)
  quarta    Int  @default(1)
  quinta    Int  @default(1)
  sexta     Int  @default(1)
  sabado    Int  @default(1)
  feriados  Int  @default(2)
  lastModified DateTime? @map("last_modified")

  estabelecimento Estabelecimento? @relation(fields: [relEstabelecimentosId], references: [id])
  produtos        Produto[]

  @@map("categorias")
}

model Pedido {
  id                    Int       @id @default(autoincrement())
  relEstabelecimentosId String?   @map("rel_estabelecimentos_id")
  relSegmentosId        String?   @map("rel_segmentos_id")
  nome                  String?
  whatsapp              String?
  formaEntrega          String?   @map("forma_entrega")
  // formaEntrega valores: "delivery", "retirada", "mesa", "balcao"
  estado                String?
  cidade                String?
  enderecoCep           String?   @map("endereco_cep")
  enderecoNumero        String?   @map("endereco_numero")
  enderecoBairro        String?   @map("endereco_bairro")
  enderecoRua           String?   @map("endereco_rua")
  enderecoComplemento   String?   @map("endereco_complemento")
  enderecoReferencia    String?   @map("endereco_referencia")
  formaPagamento        String?   @map("forma_pagamento")
  // formaPagamento: "1"=dinheiro, "2"=débito, "3"=crédito, "4"=alimentação, "5"=outros, "6"=pix, "7"=asaas_pix, "8"=asaas_cartao, "9"=asaas_boleto
  formaPagamentoInfo    String?   @map("forma_pagamento_informacao")
  comprovante           String?   @db.Text
  // json: texto formatado do pedido (para WhatsApp)
  json                  String?   @db.Text
  // status: "1"=aguardando, "2"=aceito, "3"=em preparo, "4"=saiu para entrega, "5"=entregue, "6"=cancelado
  status                String    @default("1")
  statusp               String    @default("1")  // 1=ativo, 2=excluído
  mesa                  Int?
  dataHora              DateTime? @map("data_hora")
  cupom                 String?
  vPedido               Decimal?  @map("v_pedido") @db.Decimal(10, 2)
  taxa                  Float     @default(0)
  mensagem              String?
  linkpagamento         String?
  referencia            String?
  datadepagamento       DateTime?
  statuspagamento       String?
  pagamentotipo         String?
  detalhespagamento     String?   @db.Text

  estabelecimento Estabelecimento? @relation(fields: [relEstabelecimentosId], references: [id])
  pagamentos      Pagamento[]

  @@map("pedidos")
}

model Pagamento {
  id            Int     @id @default(autoincrement())
  estabelecimento String @map("estabelecimento")
  pedido        Int
  data          String
  hora          String
  valor         String
  gateway       String  // "asaas", "pix_manual", etc.
  codigo        String  // ID da cobrança no ASAAS
  status        String  // "1"=aprovado, "2"=pendente, "3"=recusado

  // Campos extras ASAAS
  asaasPaymentId     String?   @map("asaas_payment_id")
  asaasStatus        String?   @map("asaas_status")
  pixQrcode          String?   @map("pix_qrcode")        @db.Text
  pixCopiaCola       String?   @map("pix_copia_cola")    @db.Text
  boletoUrl          String?   @map("boleto_url")
  boletoLinhaDigitavel String? @map("boleto_linha_digitavel")
  dataVencimento     DateTime? @map("data_vencimento")
  dataPagamento      DateTime? @map("data_pagamento")

  pedidoRel Pedido @relation(fields: [pedido], references: [id])

  @@map("pagamentos")
}

model Banner {
  id                    Int       @id @default(autoincrement())
  relEstabelecimentosId String?   @map("rel_estabelecimentos_id")
  titulo                String?
  desktop               String?   // URL imagem desktop
  mobile                String    // URL imagem mobile
  videoLink             String?   @map("video_link")
  link                  String?
  status                String?   @default("1")
  createdAt             DateTime? @map("created")
  lastModified          DateTime? @map("last_modified")

  estabelecimento Estabelecimento? @relation(fields: [relEstabelecimentosId], references: [id])

  @@map("banners")
}

model BannerMarketplace {
  id       Int     @id @default(autoincrement())
  titulo   String?
  desktop  String?
  mobile   String
  link     String?
  status   String? @default("1")

  @@map("banners_marketplace")
}

model Frete {
  id                    Int      @id @default(autoincrement())
  relEstabelecimentosId String?  @map("rel_estabelecimentos_id")
  nome                  String?  // Nome do bairro ou zona de entrega
  valor                 Decimal? @db.Decimal(10, 2)
  outros                String?  @default("0")  // "1" = tipo especial (correios, transportadora)

  estabelecimento Estabelecimento? @relation(fields: [relEstabelecimentosId], references: [id])

  @@map("frete")
}

model Cupom {
  id                    Int       @id @default(autoincrement())
  relEstabelecimentosId String?   @map("rel_estabelecimentos_id")
  nome                  String?
  descricao             String?   @db.Text
  codigo                String?
  tipo                  String?   // "1"=porcentagem, "2"=fixo
  descontoPorcentagem   String?   @map("desconto_porcentagem")
  descontoFixo          Decimal?  @map("desconto_fixo") @db.Decimal(10, 2)
  valorMaximo           Decimal?  @map("valor_maximo") @db.Decimal(10, 2)
  quantidade            String?   // quantidade máxima de usos
  validade              DateTime?

  estabelecimento Estabelecimento? @relation(fields: [relEstabelecimentosId], references: [id])

  @@map("cupons")
}

model Plano {
  id                        Int      @id @default(autoincrement())
  destaque                  String?  // URL imagem destaque
  nome                      String?
  descricao                 String?  @db.Text
  comissionamento           String?  // % comissão para afiliado
  duracaoMeses              String?  @map("duracao_meses")
  duracaoDias               String?  @map("duracao_dias")
  valorTotal                Decimal? @map("valor_total") @db.Decimal(10, 2)
  valorMensal               Decimal? @map("valor_mensal") @db.Decimal(10, 2)
  link                      String?
  termos                    String?  @db.Text
  funcionalidadeMarketplace String?  @map("funcionalidade_marketplace") @default("1")
  funcionalidadeVariacao    String?  @map("funcionalidade_variacao")    @default("1")
  funcionalidadeBanners     String?  @map("funcionalidade_banners")     @default("1")
  visible                   String?  @default("1")
  status                    String?  @default("1")
  ordem                     String?  @default("1")
  limiteProdutos            String?  @map("limite_produtos") @default("999")

  assinaturas Assinatura[]
  vouchers    Voucher[]

  @@map("planos")
}

model Assinatura {
  id                              Int       @id @default(autoincrement())
  relPlanosId                     String?   @map("rel_planos_id")
  relEstabelecimentosId           String?   @map("rel_estabelecimentos_id")
  relEstabelecimentosNome         String?   @map("rel_estabelecimentos_nome")
  relEstabelecimentosSubdominio   String?   @map("rel_estabelecimentos_subdominio")
  afiliado                        String?
  nome                            String?
  descricao                       String?   @db.Text
  comissionamento                 String?
  duracaoMeses                    String?   @map("duracao_meses")
  duracaoDias                     String?   @map("duracao_dias")
  valorTotal                      Decimal?  @map("valor_total")    @db.Decimal(10, 2)
  valorRecebido                   Decimal?  @map("valor_recebido") @db.Decimal(10, 2)
  valorMensal                     Decimal?  @map("valor_mensal")   @db.Decimal(10, 2)
  termos                          String?   @db.Text
  funcionalidadeMarketplace       String?   @map("funcionalidade_marketplace")
  funcionalidadeVariacao          String?   @map("funcionalidade_variacao")
  funcionalidadeBanners           String?   @map("funcionalidade_banners")

  // Dados do gateway de pagamento da assinatura (ASAAS)
  gatewayRef         String?   @map("gateway_ref")
  gatewayLink        String?   @map("gateway_link")
  gatewayTransaction String?   @map("gateway_transaction")
  gatewayPayable     DateTime? @map("gateway_payable")
  gatewayExpiration  DateTime? @map("gateway_expiration")
  gatewayPayment     String?   @map("gateway_payment")

  mode       String?
  voucher    String?
  // status: "1"=ativa, "2"=expirada, "3"=cancelada
  status     String?
  used       String?
  expiration DateTime?
  createdAt  DateTime? @map("created")
  limiteProdutos String? @map("limite_produtos")

  plano           Plano?          @relation(fields: [relPlanosId], references: [id])
  estabelecimento Estabelecimento? @relation(fields: [relEstabelecimentosId], references: [id])

  @@map("assinaturas")
}

model Voucher {
  id               Int     @id @default(autoincrement())
  relPlanosId      String? @map("rel_planos_id")
  relAssinaturasId String? @map("rel_assinaturas_id")
  descricao        String?
  codigo           String?
  status           String? @default("1")  // "1"=disponível, "2"=usado
  afiliado         String?

  plano Plano? @relation(fields: [relPlanosId], references: [id])

  @@map("vouchers")
}

model Segmento {
  id      Int     @id @default(autoincrement())
  icone   String?  // URL do ícone
  nome    String?
  censura String? @default("2")  // "1"=conteúdo adulto

  @@map("segmentos")
}

model Subdominio {
  id         Int     @id @default(autoincrement())
  relId      String? @map("rel_id")
  tipo       String? // "1"=estabelecimento, "5"=reservado/sistema
  subdominio String?
  url        String?

  @@map("subdominios")
}

model Cliente {
  id                Int      @id @default(autoincrement())
  idEstabelecimento Int      @map("id_estabelecimento")
  nome              String
  datadeinclusao    DateTime @default(now())
  whatsapp          String
  senha             String?
  qtdpontos         Float    @default(0)
  pontosOp          String?  @map("pontos_op") @db.Text
  qtdpedidos        Int      @default(0)
  ativo             Int      @default(1)
  cep               String?
  rua               String?
  numero            String?
  bairro            String?
  cidade            Int?
  uf                Int?
  complemento       String?
  referencia        String?

  estabelecimento Estabelecimento? @relation(fields: [idEstabelecimento], references: [id])

  @@map("clientes")
}

model Midia {
  id                    Int     @id @default(autoincrement())
  type                  String? // "1"=imagem produto
  relEstabelecimentosId String? @map("rel_estabelecimentos_id")
  relId                 String? @map("rel_id")  // ID do produto
  url                   String?

  produto Produto? @relation(fields: [relId], references: [id])

  @@map("midia")
}

model Log {
  id         Int      @id @default(autoincrement())
  relUsersId String   @map("rel_users_id")
  relLojasId String?  @map("rel_lojas_id")
  info       String?  @db.Text
  dateTime   DateTime @map("date_time")

  user User? @relation(fields: [relUsersId], references: [id])

  @@map("logs")
}

model Agendamento {
  id                    Int     @id @default(autoincrement())
  relEstabelecimentosId String? @map("rel_estabelecimentos_id")
  sun  String? @default("2")
  mon  String? @default("2")
  tue  String? @default("2")
  wed  String? @default("2")
  thu  String? @default("2")
  fri  String? @default("2")
  sat  String? @default("2")
  hora String?
  // acao: "1"=abrir loja, "2"=fechar loja
  acao String?

  @@map("agendamentos")
}

model Impressao {
  id     Int     @id @default(autoincrement())
  ide    String? // ID do estabelecimento
  status String? @default("2")  // "1"=habilitado, "2"=desabilitado
  token  String?

  estabelecimento Estabelecimento? @relation(fields: [ide], references: [id])

  @@map("impressao")
}
```

---

## 1. APP PÚBLICO DA LOJA (cardápio digital)

O middleware.ts detecta o subdomínio da requisição e injeta o `slug` no header para o layout carregar os dados da loja correta.

### Página principal `/[slug]`
- Header com:
  - Foto de capa (campo `capa` do estabelecimento)
  - Avatar/logo circular (campo `perfil`)
  - Nome e descrição da loja
  - Badge dinâmico "Aberto 🟢" / "Fechado 🔴" baseado nos horários (campo `horarios` JSON)
  - Tempo estimado e pedido mínimo
- Carrossel de banners (tabela `banners`, campo `mobile`)
- Tabs de categorias filtráveis (tabela `categorias`)
- Grid de produtos com imagem, nome, descrição, preço e preço promocional
- Botão flutuante de sacola com contador e subtotal
- Cor principal do tema vinda do campo `cor` do estabelecimento

### Sacola (drawer lateral / modal)
- Lista itens com quantidade, observação e subtotal
- Seleção de tipo de pedido: Delivery / Retirada / Mesa / Balcão (conforme habilitado no estabelecimento)
- Para Delivery: seleção de bairro (tabela `frete`) com valor automático
- Campo de nome e WhatsApp do cliente
- Campo de mesa (quando tipo = Mesa)
- Aplicação de cupom (valida código na tabela `cupons`)
- Resumo: subtotal + frete + desconto = total
- Seleção de forma de pagamento conforme habilitado no estabelecimento:
  - Dinheiro (com campo "precisa de troco?")
  - Cartão de débito / crédito / alimentação (presencial)
  - PIX manual (mostra chave PIX do estabelecimento)
  - PIX via ASAAS (gera cobrança e redireciona para `/pagamento/[id]`)
  - Cartão via ASAAS
  - Boleto via ASAAS
- Botão "Fazer Pedido":
  - Se pagamento presencial/pix manual: salva pedido e abre WhatsApp com mensagem formatada
  - Se pagamento ASAAS: salva pedido, cria cobrança na API e redireciona para tela de pagamento

### Página de pagamento `/[slug]/pagamento/[pedidoId]`
- Busca dados do pagamento na tabela `pagamentos`
- **PIX**: exibe QR Code (imagem base64), código Copia e Cola, timer de expiração (30min), botão "Copiar código"
- **Boleto**: exibe linha digitável, link para PDF, data de vencimento
- **Cartão**: formulário com campos do cartão (integração ASAAS.js tokenizado)
- Status: aguardando pagamento / pago / expirado (polling a cada 5s na API)
- Ao confirmar pagamento: exibe confirmação e botão para voltar à loja

### Página de produto `/[slug]/produto/[id]`
- Imagem grande, nome, descrição, preço
- Galeria de imagens (tabela `midia`)
- Variações (decodifica JSON base64 do campo `variacao`)
- Seletor de quantidade
- Campo de observação
- Botão "Adicionar à sacola"

---

## 2. PAINEL DO ESTABELECIMENTO `/painel`

### Layout do painel
- Sidebar com navegação e avatar da loja
- Header com nome da loja, link "Ver Loja" e botão logout
- Aviso amarelo de expiração quando `expiracao` <= 15 dias

### Dashboard `/painel/inicio`
- Cards: Total de pedidos hoje / Total de pedidos do mês / Faturamento do mês
- Lista dos últimos 5 pedidos com status
- Atalhos rápidos para as seções mais usadas

### Pedidos `/painel/pedidos`
- Lista paginada com: número do pedido, nome do cliente, tipo de entrega, valor, status, data/hora
- Filtros por status e data
- Badges coloridos por status:
  - 🟡 Aguardando → 🔵 Aceito → 🟠 Em preparo → 🚚 Saiu para entrega → ✅ Entregue → ❌ Cancelado
- Ações:
  - Aceitar pedido → atualiza status e abre WhatsApp para notificar cliente
  - Avançar status (botão de próxima etapa)
  - Cancelar pedido
  - Imprimir pedido (abre janela de impressão com layout limpo)
- Modal de detalhes do pedido com todos os itens e informações
- 🔔 Notificação sonora de novos pedidos (polling a cada 30s)

### Produtos `/painel/produtos`
- Lista paginada com imagem, nome, categoria, preço, status
- Filtros por categoria, visibilidade, status
- CRUD completo:
  - Formulário: nome, descrição, imagem, categoria, preço, preço promocional, status, visível, variações
  - Variações: interface para adicionar grupos (ex: "Tamanhos") com itens (ex: P, M, G) e valor adicional
  - Copiar produto
  - Reordenar por drag-and-drop (campo `posicao`)

### Categorias `/painel/categorias`
- Lista com nome, status, ordem
- CRUD: nome, disponibilidade por dia da semana, ordem
- Drag-and-drop para reordenar

### Banners `/painel/banners`
- Upload de banners (desktop e mobile)
- Lista com preview, título, link, status
- CRUD completo

### Frete `/painel/frete`
- Lista de zonas de entrega/bairros com valor
- CRUD: nome do bairro, valor (R$ 0,00 = grátis)
- Toggle para habilitar/desabilitar cálculo de frete (`calcularfrete`)

### Cupons `/painel/cupons`
- Lista com código, tipo, desconto, validade, usos
- CRUD: nome, código, tipo (% ou R$), desconto, valor mínimo do pedido, quantidade, validade

### Configurações `/painel/configuracoes`
Abas:
- **Dados da loja**: nome, descrição, WhatsApp, email, endereço, segmento
- **Aparência**: upload de logo/avatar, upload de capa, cor principal (color picker)
- **Entrega**: habilitar/desabilitar delivery, retirada, mesa, balcão
- **Horários**: configuração por turno (manhã/tarde) para cada dia da semana
- **Pagamentos presenciais**: dinheiro, débito, crédito, alimentação, PIX manual (com campo de chave PIX)
- **ASAAS (pagamento online)**:
  - Toggle habilitar ASAAS
  - Campo Chave de API do ASAAS
  - Toggle Sandbox (para testes)
  - Toggle habilitar PIX via ASAAS
  - Toggle habilitar Cartão via ASAAS
  - Toggle habilitar Boleto via ASAAS

### Plano `/painel/plano`
- Card com plano atual: nome, funcionalidades, dias restantes, data de expiração
- Lista de planos disponíveis (tabela `planos`)
- Botão "Contratar" abre fluxo de pagamento via ASAAS

### Relatório `/painel/relatorio`
- Filtro por período (data início / data fim)
- Tabela de pedidos no período com totais
- Cards de resumo: total de pedidos, faturamento, ticket médio

---

## 3. ÁREA ADMINISTRATIVA `/administracao`

- Dashboard com métricas globais: total de estabelecimentos, pedidos do mês, receita
- **Estabelecimentos**: lista paginada, aprovar/bloquear, editar, ver loja, renovar plano
- **Usuários**: CRUD de usuários (admins e afiliados), definir nível de acesso e comissão
- **Planos**: CRUD de planos com todas as funcionalidades e preços
- **Segmentos**: CRUD das categorias globais de negócio (com ícone e nome)
- **Vouchers**: gerar vouchers por plano, marcar como usado, vincular a afiliado
- **Assinaturas**: lista de todas as assinaturas, status, valores
- **Subdominios**: lista de subdomínios reservados (tipo 5 = sistema)
- **Logs**: histórico de ações da plataforma com filtros

---

## 4. ÁREA DO AFILIADO `/afiliado`

- Dashboard: estabelecimentos vinculados, receita de comissão, conversões
- **Meus Estabelecimentos**: lista dos estabelecimentos com `afiliado` = email do afiliado
- **Planos**: planos que o afiliado pode oferecer
- **Vouchers**: vouchers do afiliado para distribuir
- **Configurações**: dados pessoais, dados bancários para repasse de comissão

---

## AUTENTICAÇÃO

- Login único em `/login` com redirecionamento por nível:
  - `level=1` + `operacao=1` → `/administracao`
  - `level=1` + `operacao=2` → `/afiliado`
  - `level=2` → `/painel`
- NextAuth.js com provider Credentials
- JWT com campos: id, email, level, operacao, estabelecimentoId
- Recuperação de senha: gera `recover_key` e envia por email (Nodemailer)
- Cadastro multi-step em `/comece`:
  - Passo 1: Dados pessoais (nome, email, senha, confirmação)
  - Passo 2: Dados do estabelecimento (nome, segmento da tabela `segmentos`, cidade, WhatsApp)
  - Passo 3: Escolha do subdomínio (valida disponibilidade na tabela `subdominios`)
  - Passo 4: Confirmação → cria user + estabelecimento + assinatura trial (30 dias, plano grátis)

---

## INTEGRAÇÃO ASAAS

Variáveis de ambiente necessárias:
```
ASAAS_API_URL=https://sandbox.asaas.com/api/v3   # usar https://api.asaas.com/v3 em produção
ASAAS_API_KEY=sua_chave_aqui                      # chave global para cobranças de assinatura da plataforma
```

Cada estabelecimento tem sua própria chave ASAAS nos campos `asaas_api_key` e `asaas_sandbox`.

### POST /api/asaas/cobranca
Cria uma cobrança para um pedido:
```typescript
// Lê asaas_api_key do estabelecimento
// Cria cobrança na API ASAAS
// Retorna: { paymentId, pixQrcode, pixCopiaCola, boletoUrl, boletoLinhaDigitavel, status }
// Salva na tabela pagamentos
```

### POST /api/asaas/webhook
Recebe notificações de pagamento do ASAAS:
```typescript
// Valida token do webhook
// Atualiza status na tabela pagamentos
// Se aprovado: atualiza status do pedido para "2" (aceito)
// Dispara notificação para o estabelecimento
```

---

## MIDDLEWARE (subdomínio)

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const currentHost = hostname.replace('.zapmaxx.com.br', '')
  
  // Rotas do sistema — não interceptar
  const systemRoutes = ['www', 'painel', 'administracao', 'afiliado', 'api']
  if (systemRoutes.includes(currentHost) || hostname === 'zapmaxx.com.br') {
    return NextResponse.next()
  }
  
  // É um subdomínio de loja — reescrever para /[slug]
  const url = request.nextUrl.clone()
  url.pathname = `/${currentHost}${url.pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## MENSAGEM WHATSAPP (formato exato)

```typescript
function gerarMensagemWhatsApp(pedido, loja, itens) {
  let msg = `*${loja.nome.toUpperCase()}*\n`
  msg += `${loja.enderecoRua} ${loja.enderecoNumero}, ${loja.enderecoBairro}\n`
  msg += `${loja.contatoWhatsapp}\n`
  msg += `------\n*Pedido ${pedido.id}*\n------\n`
  msg += `${format(pedido.dataHora, 'dd/MM/yyyy')} às ${format(pedido.dataHora, 'HH:mm')}\n`
  msg += `------\n\n`
  msg += `*Nome:* \n${pedido.nome} \n\n`
  msg += `*Whatsapp:* \n${pedido.whatsapp} \n\n`
  
  if (pedido.formaEntrega === 'delivery') {
    msg += `*Endereços:* \n Rua: ${pedido.enderecoRua}, Nº: ${pedido.enderecoNumero}, `
    msg += `Bairro: ${pedido.enderecoBairro}, CEP: ${pedido.enderecoCep} \n\n`
  }
  
  msg += `*Forma de pagamento:* \n${pedido.formaPagamento} \n\n`
  msg += `------\n*PRODUTOS* \n------\n\n`
  
  itens.forEach(item => {
    msg += `*${item.quantidade} x* ${item.nome}\n`
    if (item.variacao) msg += `*${item.variacaoNome}*: ${item.variacaoEscolha}.\n`
    if (item.observacao) msg += `*Obs:* ${item.observacao}\n`
    msg += `*Valor:* R$ ${item.subtotal.toFixed(2).replace('.', ',')}\n\n`
  })
  
  msg += `------\n*Subtotal:* R$ ${pedido.vPedido.toFixed(2).replace('.', ',')}\n`
  if (pedido.taxa > 0) msg += `*Entrega:* ${pedido.enderecoBairro} (+ R$${pedido.taxa.toFixed(2).replace('.', ',')})\n`
  else msg += `*Entrega:* Retirar no Balcão\n`
  msg += `------\n\n*Total:* R$ ${(pedido.vPedido + pedido.taxa).toFixed(2).replace('.', ',')}\n`
  msg += `------\n\nhttps://${loja.subdominio}.zapmaxx.com.br\n`
  
  return `https://wa.me/55${loja.contatoWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`
}
```

---

## DESIGN E UX

- Design moderno, clean, mobile-first
- Cor principal customizável por loja (campo `cor` → CSS variable `--color-primary`)
- Cardápio público: visual premium, cards com sombra, imagens com aspect-ratio fixo
- Painel: sidebar escura, conteúdo claro, tabelas com linhas alternadas
- Notificações toast para todas as ações (sucesso/erro)
- Loading skeletons em todas as listagens
- Paginação com 20 itens por página
- Imagens com fallback para placeholder quando sem imagem

---

## DADOS MOCKADOS PARA DEMONSTRAÇÃO

Crie os dados mock de uma pizzaria chamada **"Pizza da Boa"** com:
- Subdomínio: `pizzadaboa`
- Cor: `#ff3c00`
- WhatsApp: `(11) 99999-9999`
- 3 categorias: Pizzas, Bebidas, Sobremesas
- 4 produtos por categoria com imagens de placeholder (via picsum.photos)
- 2 fretes: Centro (R$ 4,00), Demais bairros (R$ 7,00)
- 1 cupom: código `PROMO10`, 10% de desconto
- Horários: Seg-Dom das 18:00 às 23:00

---

## COMECE POR AQUI

Gere primeiro o **App público da loja** (cardápio digital) completo com os dados da "Pizza da Boa" mostrando:
1. Header com capa, logo, nome, status aberto/fechado
2. Carrossel de banners
3. Tabs de categorias
4. Grid de produtos
5. Modal/drawer de produto individual com variações
6. Sacola lateral completa com todos os campos
7. Fluxo de finalização de pedido
8. Tela de pagamento PIX (com QR Code mockado)
```

---

## SCRIPT SQL — Criação do banco no Supabase

Cole no **SQL Editor** do seu projeto Supabase:

```sql
-- ============================================================
-- SISTEMA DE CATÁLOGO DIGITAL / DELIVERY MULTI-TENANT
-- Script de criação de banco — PostgreSQL / Supabase
-- ============================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(255),
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  level      VARCHAR(10)  DEFAULT '2',
  operacao   VARCHAR(2)   DEFAULT '2',
  status     VARCHAR(10)  DEFAULT '1',
  recover_key VARCHAR(255),
  keepalive  VARCHAR(255),
  comis      VARCHAR(255),
  created    TIMESTAMP,
  last_login TIMESTAMP
);

-- USER DATA
CREATE TABLE IF NOT EXISTS users_data (
  id             SERIAL PRIMARY KEY,
  rel_users_id   VARCHAR(255) REFERENCES users(id),
  nascimento     VARCHAR(255),
  documento_tipo VARCHAR(255),
  documento      VARCHAR(255),
  estado         VARCHAR(255),
  cidade         VARCHAR(255),
  telefone       VARCHAR(255),
  comissao       VARCHAR(255)
);

-- SEGMENTOS
CREATE TABLE IF NOT EXISTS segmentos (
  id      SERIAL PRIMARY KEY,
  icone   VARCHAR(255),
  nome    VARCHAR(75),
  censura VARCHAR(10) DEFAULT '2'
);

INSERT INTO segmentos (nome, censura) VALUES
  ('Delivery', '2'),
  ('Comércio em Geral', '2'),
  ('Eletrônicos', '2'),
  ('Fit / Saúde', '2'),
  ('Moda', '2'),
  ('Beleza', '2'),
  ('Pet Shop', '2'),
  ('Serviços', '2')
ON CONFLICT DO NOTHING;

-- PLANOS
CREATE TABLE IF NOT EXISTS planos (
  id                         SERIAL PRIMARY KEY,
  destaque                   VARCHAR(255),
  nome                       VARCHAR(255),
  descricao                  TEXT,
  comissionamento            VARCHAR(255),
  duracao_meses              VARCHAR(50),
  duracao_dias               VARCHAR(50),
  valor_total                DECIMAL(10,2),
  valor_mensal               DECIMAL(10,2),
  link                       VARCHAR(255),
  termos                     TEXT,
  funcionalidade_marketplace VARCHAR(10) DEFAULT '1',
  funcionalidade_variacao    VARCHAR(10) DEFAULT '1',
  funcionalidade_banners     VARCHAR(10) DEFAULT '1',
  visible                    VARCHAR(10) DEFAULT '1',
  status                     VARCHAR(10) DEFAULT '1',
  ordem                      VARCHAR(10) DEFAULT '1',
  limite_produtos            VARCHAR(50) DEFAULT '999'
);

INSERT INTO planos (nome, descricao, duracao_meses, duracao_dias, valor_total, valor_mensal, funcionalidade_marketplace, funcionalidade_variacao, funcionalidade_banners, visible, status, ordem, limite_produtos) VALUES
  ('Plano Trial 30 dias', 'Período gratuito de 30 dias para testar a plataforma.', '1', '30', 0.00, 0.00, '1', '1', '1', '2', '1', '4', '999'),
  ('Plano Mensal',        'Acesso completo por 30 dias.',                          '1', '30', 29.90, 29.90, '1', '1', '1', '1', '1', '1', '999'),
  ('Plano Semestral',     'Acesso completo por 180 dias com desconto.',            '6', '180', 97.00, 16.16, '1', '1', '1', '1', '1', '3', '999'),
  ('Plano Anual',         'Acesso completo por 360 dias. Melhor custo-benefício.', '12','360', 159.00, 13.25, '1', '1', '1', '1', '1', '2', '999')
ON CONFLICT DO NOTHING;

-- ESTABELECIMENTOS
CREATE TABLE IF NOT EXISTS estabelecimentos (
  id                                    SERIAL PRIMARY KEY,
  rel_users_id                          VARCHAR(255) REFERENCES users(id),
  afiliado                              VARCHAR(255),
  nome                                  VARCHAR(255),
  descricao                             TEXT,
  segmento                              VARCHAR(255),
  estado                                VARCHAR(255),
  cidade                                VARCHAR(255),
  subdominio                            VARCHAR(255) UNIQUE,
  perfil                                VARCHAR(255),
  capa                                  VARCHAR(255),
  cor                                   VARCHAR(50)  DEFAULT '#e11d48',
  pedido_minimo                         DECIMAL(10,2) DEFAULT 0,
  pagamento_dinheiro                    VARCHAR(2)   DEFAULT '2',
  pagamento_cartao_debito               VARCHAR(2)   DEFAULT '2',
  pagamento_cartao_debito_bandeiras     VARCHAR(255),
  pagamento_cartao_credito              VARCHAR(2)   DEFAULT '2',
  pagamento_cartao_credito_bandeiras    VARCHAR(255),
  pagamento_cartao_alimentacao          VARCHAR(2)   DEFAULT '2',
  pagamento_cartao_alimentacao_bandeiras VARCHAR(255),
  pagamento_outros                      VARCHAR(2)   DEFAULT '2',
  pagamento_outros_descricao            VARCHAR(255),
  pagamento_pix                         VARCHAR(2)   DEFAULT '2',
  tipopix                               VARCHAR(255),
  chave_pix                             VARCHAR(99),
  beneficiario_pix                      VARCHAR(25),
  -- ASAAS
  asaas_habilitado                      BOOLEAN DEFAULT FALSE,
  asaas_api_key                         VARCHAR(255),
  asaas_sandbox                         BOOLEAN DEFAULT TRUE,
  asaas_pix_habilitado                  BOOLEAN DEFAULT FALSE,
  asaas_cartao_habilitado               BOOLEAN DEFAULT FALSE,
  asaas_boleto_habilitado               BOOLEAN DEFAULT FALSE,
  -- Endereço
  endereco_cep                          VARCHAR(20),
  endereco_numero                       VARCHAR(20),
  endereco_bairro                       VARCHAR(255),
  endereco_rua                          VARCHAR(255),
  endereco_complemento                  VARCHAR(255),
  endereco_referencia                   VARCHAR(255),
  -- Contato
  contato_whatsapp                      VARCHAR(30),
  contato_email                         VARCHAR(255),
  contato_instagram                     VARCHAR(255),
  contato_facebook                      VARCHAR(255),
  -- Tipos de entrega
  delivery                              VARCHAR(2)  DEFAULT '1',
  entrega_retirada                      VARCHAR(2)  DEFAULT '1',
  balcao                                VARCHAR(2)  DEFAULT '1',
  mesa                                  VARCHAR(2)  DEFAULT '1',
  outros                                VARCHAR(2)  DEFAULT '2',
  nomeoutros                            VARCHAR(255),
  -- Horários JSON: {"manha":[{"dia":"0","inicio":"08:00","fim":"12:00","ativo":true},...], "tarde":[...]}
  horarios                              TEXT,
  -- Funcionalidades
  funcionalidade_marketplace            VARCHAR(2)  DEFAULT '2',
  funcionalidade_variacao               VARCHAR(2)  DEFAULT '2',
  funcionalidade_banners                VARCHAR(2)  DEFAULT '2',
  limite_produtos                       VARCHAR(50) DEFAULT '999',
  -- Dados responsável
  responsavel_nome                      VARCHAR(255),
  responsavel_nascimento                VARCHAR(50),
  responsavel_documento_tipo            VARCHAR(10),
  responsavel_documento                 VARCHAR(50),
  -- Analytics
  estatisticas_analytics                VARCHAR(255),
  estatisticas_pixel                    VARCHAR(255),
  -- Status e controle
  status                                VARCHAR(10) DEFAULT '1',
  status_force                          VARCHAR(10) DEFAULT '2',
  funcionamento                         VARCHAR(10) DEFAULT '1',
  expiracao                             VARCHAR(50),
  calcularfrete                         INT         DEFAULT 2,
  tipofrete                             INT,
  empresa                               VARCHAR(150),
  exibicao                              VARCHAR(2)  DEFAULT '1',
  created                               TIMESTAMP,
  last_modified                         TIMESTAMP,
  last_login                            TIMESTAMP
);

-- CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
  id                     SERIAL PRIMARY KEY,
  rel_estabelecimentos_id VARCHAR(255) REFERENCES estabelecimentos(id),
  ordem                  INT         DEFAULT 0,
  nome                   VARCHAR(255),
  visible                VARCHAR(2)  DEFAULT '1',
  status                 VARCHAR(2)  DEFAULT '1',
  domingo                INT         DEFAULT 1,
  segunda                INT         DEFAULT 1,
  terca                  INT         DEFAULT 1,
  quarta                 INT         DEFAULT 1,
  quinta                 INT         DEFAULT 1,
  sexta                  INT         DEFAULT 1,
  sabado                 INT         DEFAULT 1,
  feriados               INT         DEFAULT 2,
  last_modified          TIMESTAMP
);

-- PRODUTOS
CREATE TABLE IF NOT EXISTS produtos (
  id                     SERIAL PRIMARY KEY,
  rel_estabelecimentos_id VARCHAR(255) REFERENCES estabelecimentos(id),
  rel_categorias_id       VARCHAR(255) REFERENCES categorias(id),
  destaque               VARCHAR(255),
  ref                    VARCHAR(255),
  nome                   VARCHAR(255),
  descricao              TEXT,
  valor                  DECIMAL(10,2),
  oferta                 VARCHAR(2)  DEFAULT '2',
  valor_promocional      DECIMAL(10,2),
  -- variacao JSON array: [{"nome":"Tamanhos","escolha_minima":"1","escolha_maxima":"1","item":[{"nome":"P","descricao":"","valor":""}]}]
  variacao               TEXT,
  visible                VARCHAR(2)  DEFAULT '1',
  status                 VARCHAR(2)  DEFAULT '1',
  statusp                VARCHAR(2)  DEFAULT '1',
  estoque                VARCHAR(2)  DEFAULT '1',
  posicao                VARCHAR(9)  DEFAULT '0',
  video_link             VARCHAR(255),
  pesofrete              FLOAT,
  created                TIMESTAMP,
  last_modified          TIMESTAMP
);

-- MIDIA (imagens extras dos produtos)
CREATE TABLE IF NOT EXISTS midia (
  id                      SERIAL PRIMARY KEY,
  type                    VARCHAR(10),
  rel_estabelecimentos_id VARCHAR(255),
  rel_id                  VARCHAR(255) REFERENCES produtos(id),
  url                     VARCHAR(255)
);

-- PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
  id                      SERIAL PRIMARY KEY,
  rel_estabelecimentos_id VARCHAR(255) REFERENCES estabelecimentos(id),
  rel_segmentos_id        VARCHAR(255),
  nome                    VARCHAR(255),
  whatsapp                VARCHAR(30),
  forma_entrega           VARCHAR(50),
  estado                  VARCHAR(255),
  cidade                  VARCHAR(255) DEFAULT '',
  endereco_cep            VARCHAR(20),
  endereco_numero         VARCHAR(20),
  endereco_bairro         VARCHAR(255),
  endereco_rua            VARCHAR(255),
  endereco_complemento    VARCHAR(255),
  endereco_referencia     VARCHAR(255),
  forma_pagamento         VARCHAR(10),
  forma_pagamento_informacao VARCHAR(255),
  comprovante             TEXT,
  json                    TEXT,
  -- status: 1=aguardando, 2=aceito, 3=em preparo, 4=saiu entrega, 5=entregue, 6=cancelado
  status                  VARCHAR(10) DEFAULT '1',
  statusp                 VARCHAR(2)  DEFAULT '1',
  mesa                    INT,
  data_hora               TIMESTAMP,
  cupom                   VARCHAR(255),
  v_pedido                DECIMAL(10,2),
  taxa                    FLOAT       DEFAULT 0,
  mensagem                VARCHAR(250),
  linkpagamento           VARCHAR(400),
  referencia              VARCHAR(120),
  datadepagamento         TIMESTAMP,
  statuspagamento         VARCHAR(50),
  pagamentotipo           VARCHAR(25),
  detalhespagamento       TEXT
);

-- PAGAMENTOS
CREATE TABLE IF NOT EXISTS pagamentos (
  id                    SERIAL PRIMARY KEY,
  estabelecimento       VARCHAR(11)  NOT NULL,
  pedido                INT          NOT NULL REFERENCES pedidos(id),
  data                  VARCHAR(20)  NOT NULL,
  hora                  VARCHAR(20)  NOT NULL,
  valor                 VARCHAR(50)  NOT NULL,
  gateway               VARCHAR(50)  NOT NULL,
  codigo                VARCHAR(255) NOT NULL,
  -- status: 1=aprovado, 2=pendente, 3=recusado
  status                VARCHAR(20)  NOT NULL DEFAULT '2',
  asaas_payment_id      VARCHAR(255),
  asaas_status          VARCHAR(100),
  pix_qrcode            TEXT,
  pix_copia_cola        TEXT,
  boleto_url            VARCHAR(500),
  boleto_linha_digitavel VARCHAR(60),
  data_vencimento       TIMESTAMP,
  data_pagamento        TIMESTAMP
);

-- BANNERS
CREATE TABLE IF NOT EXISTS banners (
  id                      SERIAL PRIMARY KEY,
  rel_estabelecimentos_id VARCHAR(255) REFERENCES estabelecimentos(id),
  titulo                  VARCHAR(255),
  desktop                 VARCHAR(255),
  mobile                  VARCHAR(255) NOT NULL,
  video_link              VARCHAR(255),
  link                    VARCHAR(255),
  status                  VARCHAR(2)  DEFAULT '1',
  created                 TIMESTAMP,
  last_modified           TIMESTAMP
);

-- BANNERS MARKETPLACE
CREATE TABLE IF NOT EXISTS banners_marketplace (
  id      SERIAL PRIMARY KEY,
  titulo  VARCHAR(255),
  desktop VARCHAR(255),
  mobile  VARCHAR(255) NOT NULL,
  link    VARCHAR(255),
  status  VARCHAR(2) DEFAULT '1'
);

-- FRETE
CREATE TABLE IF NOT EXISTS frete (
  id                      SERIAL PRIMARY KEY,
  rel_estabelecimentos_id VARCHAR(255) REFERENCES estabelecimentos(id),
  nome                    VARCHAR(255),
  valor                   DECIMAL(10,2),
  outros                  VARCHAR(2) DEFAULT '0'
);

-- CUPONS
CREATE TABLE IF NOT EXISTS cupons (
  id                      SERIAL PRIMARY KEY,
  rel_estabelecimentos_id VARCHAR(255) REFERENCES estabelecimentos(id),
  nome                    VARCHAR(255),
  descricao               TEXT,
  codigo                  VARCHAR(255),
  tipo                    VARCHAR(10),
  desconto_porcentagem    VARCHAR(10),
  desconto_fixo           DECIMAL(10,2),
  valor_maximo            DECIMAL(10,2),
  quantidade              VARCHAR(50),
  validade                TIMESTAMP
);

-- ASSINATURAS
CREATE TABLE IF NOT EXISTS assinaturas (
  id                               SERIAL PRIMARY KEY,
  rel_planos_id                    VARCHAR(255) REFERENCES planos(id),
  rel_estabelecimentos_id          VARCHAR(255) REFERENCES estabelecimentos(id),
  rel_estabelecimentos_nome        VARCHAR(255),
  rel_estabelecimentos_subdominio  VARCHAR(255),
  afiliado                         VARCHAR(255),
  nome                             VARCHAR(255),
  descricao                        TEXT,
  comissionamento                  VARCHAR(50),
  duracao_meses                    VARCHAR(50),
  duracao_dias                     VARCHAR(50),
  valor_total                      DECIMAL(10,2),
  valor_recebido                   DECIMAL(10,2),
  valor_mensal                     DECIMAL(10,2),
  termos                           TEXT,
  funcionalidade_marketplace       VARCHAR(2),
  funcionalidade_variacao          VARCHAR(2),
  funcionalidade_banners           VARCHAR(2),
  gateway_ref                      VARCHAR(255),
  gateway_link                     VARCHAR(255),
  gateway_transaction              VARCHAR(255),
  gateway_payable                  DATE,
  gateway_expiration               DATE,
  gateway_payment                  VARCHAR(100),
  mode                             VARCHAR(50),
  voucher                          VARCHAR(255),
  -- status: 1=ativa, 2=expirada, 3=cancelada
  status                           VARCHAR(10),
  used                             VARCHAR(10),
  expiration                       DATE,
  created                          TIMESTAMP,
  limite_produtos                  VARCHAR(50)
);

-- VOUCHERS
CREATE TABLE IF NOT EXISTS vouchers (
  id                SERIAL PRIMARY KEY,
  rel_planos_id     VARCHAR(255) REFERENCES planos(id),
  rel_assinaturas_id VARCHAR(255),
  descricao         VARCHAR(255),
  codigo            VARCHAR(255),
  -- status: 1=disponível, 2=usado
  status            VARCHAR(10) DEFAULT '1',
  afiliado          VARCHAR(50)
);

-- SUBDOMINIOS (reservados do sistema)
CREATE TABLE IF NOT EXISTS subdominios (
  id         SERIAL PRIMARY KEY,
  rel_id     VARCHAR(255),
  tipo       VARCHAR(10),
  subdominio VARCHAR(255),
  url        VARCHAR(255)
);

INSERT INTO subdominios (tipo, subdominio) VALUES
  ('5', 'www'), ('5', 'painel'), ('5', 'administracao'), ('5', 'afiliado'),
  ('5', 'api'), ('5', 'login'), ('5', 'logout'), ('5', 'comece'),
  ('5', 'esqueci'), ('5', 'novasenha'), ('5', 'home'), ('5', 'app')
ON CONFLICT DO NOTHING;

-- CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
  id                 SERIAL PRIMARY KEY,
  id_estabelecimento INT NOT NULL REFERENCES estabelecimentos(id),
  nome               VARCHAR(150) NOT NULL,
  datadeinclusao     TIMESTAMP DEFAULT NOW(),
  whatsapp           VARCHAR(15) NOT NULL,
  senha              VARCHAR(60),
  qtdpontos          FLOAT   DEFAULT 0,
  pontos_op          TEXT,
  qtdpedidos         INT     DEFAULT 0,
  ativo              INT     NOT NULL DEFAULT 1,
  cep                VARCHAR(15),
  rua                VARCHAR(250),
  numero             VARCHAR(15),
  bairro             VARCHAR(150),
  cidade             INT,
  uf                 INT,
  complemento        VARCHAR(250),
  referencia         VARCHAR(250)
);

-- LOGS
CREATE TABLE IF NOT EXISTS logs (
  id           SERIAL PRIMARY KEY,
  rel_users_id VARCHAR(255) NOT NULL,
  rel_lojas_id VARCHAR(255),
  info         TEXT,
  date_time    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- AGENDAMENTOS (abertura/fechamento automático)
CREATE TABLE IF NOT EXISTS agendamentos (
  id                      SERIAL PRIMARY KEY,
  rel_estabelecimentos_id VARCHAR(255) REFERENCES estabelecimentos(id),
  sun  VARCHAR(2) DEFAULT '2',
  mon  VARCHAR(2) DEFAULT '2',
  tue  VARCHAR(2) DEFAULT '2',
  wed  VARCHAR(2) DEFAULT '2',
  thu  VARCHAR(2) DEFAULT '2',
  fri  VARCHAR(2) DEFAULT '2',
  sat  VARCHAR(2) DEFAULT '2',
  hora VARCHAR(10),
  -- acao: 1=abrir, 2=fechar
  acao VARCHAR(2)
);

-- IMPRESSAO (config de impressão térmica por estabelecimento)
CREATE TABLE IF NOT EXISTS impressao (
  id     SERIAL PRIMARY KEY,
  ide    VARCHAR(9),
  status VARCHAR(2) DEFAULT '2',
  token  VARCHAR(255)
);

-- ============================================================
-- ÍNDICES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_estabelecimentos_subdominio ON estabelecimentos(subdominio);
CREATE INDEX IF NOT EXISTS idx_produtos_estabelecimento    ON produtos(rel_estabelecimentos_id);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria          ON produtos(rel_categorias_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estabelecimento     ON pedidos(rel_estabelecimentos_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status              ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_data_hora           ON pedidos(data_hora);
CREATE INDEX IF NOT EXISTS idx_categorias_estabelecimento  ON categorias(rel_estabelecimentos_id);
CREATE INDEX IF NOT EXISTS idx_frete_estabelecimento       ON frete(rel_estabelecimentos_id);
CREATE INDEX IF NOT EXISTS idx_banners_estabelecimento     ON banners(rel_estabelecimentos_id);
CREATE INDEX IF NOT EXISTS idx_cupons_codigo               ON cupons(codigo);
CREATE INDEX IF NOT EXISTS idx_pagamentos_pedido           ON pagamentos(pedido);
CREATE INDEX IF NOT EXISTS idx_pagamentos_asaas_id         ON pagamentos(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_estabelecimento ON assinaturas(rel_estabelecimentos_id);

-- ============================================================
-- USUÁRIO ADMIN PADRÃO
-- (senha: admin123 — ALTERE imediatamente após o primeiro login)
-- Hash MD5 de "admin123"
-- ============================================================
INSERT INTO users (nome, email, password, level, operacao, status, created)
VALUES ('Administrador', 'admin@zapmaxx.com.br', md5('admin123'), '1', '1', '1', NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
```

---

## VARIÁVEIS DE AMBIENTE (.env)

```env
# Banco de dados (Supabase)
DATABASE_URL="postgresql://postgres:[SUA_SENHA]@db.[SEU_PROJECT_REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="https://zapmaxx.com.br"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"

# Supabase Storage (para upload de imagens)
NEXT_PUBLIC_SUPABASE_URL="https://[SEU_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua_anon_key"
SUPABASE_SERVICE_ROLE_KEY="sua_service_role_key"

# ASAAS (chave da plataforma para cobranças de assinatura)
ASAAS_API_URL="https://sandbox.asaas.com/api/v3"
ASAAS_API_KEY="sua_chave_api_asaas"

# Email (Nodemailer para recuperação de senha)
SMTP_HOST="mail.zapmaxx.com.br"
SMTP_PORT="465"
SMTP_USER="contato@zapmaxx.com.br"
SMTP_PASS="sua_senha_app"
SMTP_FROM="Sistema <contato@zapmaxx.com.br>"

# Domínio principal
NEXT_PUBLIC_DOMAIN="zapmaxx.com.br"
```

---

## INSTRUÇÕES DE USO NO v0.dev

1. **Copie apenas o bloco entre as marcações ` ``` ` do PROMPT** (do início "Crie um sistema..." até o fim "...dados da 'Pizza da Boa'")
2. Cole no [v0.dev](https://v0.dev) — ele vai gerar o **cardápio público** primeiro
3. Iterações sugeridas após a primeira geração:
   - *"Adicione o drawer de sacola completo com seleção de bairro, cupom e formas de pagamento"*
   - *"Crie o layout do painel do estabelecimento com sidebar e a página de pedidos"*
   - *"Adicione a página de produtos com CRUD completo e editor de variações"*
   - *"Crie as configurações com aba de integração ASAAS"*
   - *"Adicione a área administrativa com gestão de estabelecimentos"*

## INSTRUÇÕES PARA O SUPABASE

1. Acesse [supabase.com](https://supabase.com) → crie um projeto
2. Vá em **SQL Editor** → cole e execute o script SQL acima
3. Vá em **Storage** → crie um bucket público chamado `imagens`
4. Copie as credenciais em **Settings > API** para o `.env`
5. O primeiro login admin é: `admin@zapmaxx.com.br` / `admin123` — **altere após entrar**

## INSTRUÇÕES PARA VPS (após baixar o projeto do v0)

```bash
# Instalar dependências
npm install

# Configurar o Prisma
npx prisma generate
npx prisma db push   # Ou: npx prisma migrate deploy

# Build de produção
npm run build

# Iniciar com PM2
pm2 start npm --name "cardapio" -- start
pm2 save
pm2 startup

# Ou com Docker
docker build -t cardapio .
docker run -d -p 3000:3000 --env-file .env cardapio
```

Configure seu servidor web (Nginx) para redirecionar `*.zapmaxx.com.br` → porta 3000 do Next.js.
