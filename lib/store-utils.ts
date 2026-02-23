export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "")
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`
  }
  return phone
}

export function isStoreOpen(horarios?: string): boolean {
  if (!horarios) return false
  try {
    const h = JSON.parse(horarios)
    const now = new Date()
    const currentDay = now.getDay().toString()
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    const allSlots = [...(h.manha || []), ...(h.tarde || [])]
    return allSlots.some(
      (slot: { dia: string; inicio: string; fim: string; ativo: boolean }) =>
        slot.ativo && slot.dia === currentDay && currentTime >= slot.inicio && currentTime <= slot.fim
    )
  } catch {
    return false
  }
}

export function getDayName(day: number): string {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
  return days[day] || ""
}

export function parseVariacoes(variacaoStr?: string) {
  if (!variacaoStr) return []
  try {
    return JSON.parse(variacaoStr)
  } catch {
    // Try base64 decode
    try {
      return JSON.parse(atob(variacaoStr))
    } catch {
      return []
    }
  }
}

export function generateWhatsAppUrl(
  loja: {
    nome: string
    enderecoRua?: string
    enderecoNumero?: string
    enderecoBairro?: string
    contatoWhatsapp?: string
    subdominio: string
  },
  pedido: {
    id: number
    nome?: string
    whatsapp?: string
    formaEntrega: string
    enderecoRua?: string
    enderecoNumero?: string
    enderecoBairro?: string
    enderecoCep?: string
    formaPagamento?: string
    vPedido: number
    taxa: number
    dataHora?: string
  },
  itens: {
    quantidade: number
    nome: string
    variacaoNome?: string
    variacaoEscolha?: string
    observacao?: string
    subtotal: number
  }[]
): string {
  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  let msg = `*${(loja.nome || "").toUpperCase()}*\n`
  msg += `${loja.enderecoRua || ""} ${loja.enderecoNumero || ""}, ${loja.enderecoBairro || ""}\n`
  msg += `${loja.contatoWhatsapp || ""}\n`
  msg += `------\n*Pedido ${pedido.id}*\n------\n`
  msg += `${dateStr} as ${timeStr}\n`
  msg += `------\n\n`
  msg += `*Nome:* \n${pedido.nome || ""} \n\n`
  msg += `*Whatsapp:* \n${pedido.whatsapp || ""} \n\n`

  if (pedido.formaEntrega === "delivery") {
    msg += `*Endereco:* \n Rua: ${pedido.enderecoRua || ""}, N: ${pedido.enderecoNumero || ""}, `
    msg += `Bairro: ${pedido.enderecoBairro || ""}, CEP: ${pedido.enderecoCep || ""} \n\n`
  }

  msg += `*Forma de pagamento:* \n${pedido.formaPagamento || ""} \n\n`
  msg += `------\n*PRODUTOS* \n------\n\n`

  itens.forEach((item) => {
    msg += `*${item.quantidade} x* ${item.nome}\n`
    if (item.variacaoNome) msg += `*${item.variacaoNome}*: ${item.variacaoEscolha}.\n`
    if (item.observacao) msg += `*Obs:* ${item.observacao}\n`
    msg += `*Valor:* R$ ${item.subtotal.toFixed(2).replace(".", ",")}\n\n`
  })

  msg += `------\n*Subtotal:* R$ ${pedido.vPedido.toFixed(2).replace(".", ",")}\n`
  if (pedido.taxa > 0) {
    msg += `*Entrega:* ${pedido.enderecoBairro || ""} (+ R$${pedido.taxa.toFixed(2).replace(".", ",")})\n`
  } else {
    msg += `*Entrega:* Retirar no Balcao\n`
  }
  msg += `------\n\n*Total:* R$ ${(pedido.vPedido + pedido.taxa).toFixed(2).replace(".", ",")}\n`
  msg += `------\n\nhttps://${loja.subdominio}.zapmaxx.com.br\n`

  const phone = (loja.contatoWhatsapp || "").replace(/\D/g, "")
  return `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`
}
