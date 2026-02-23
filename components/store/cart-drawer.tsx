"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/cart-store"
import { formatCurrency, generateWhatsAppUrl } from "@/lib/store-utils"
import type { Estabelecimento, Frete, Cupom } from "@/lib/types"
import { X, Minus, Plus, Trash2, ShoppingBag, MapPin, Truck, Store, UtensilsCrossed } from "lucide-react"
import { toast } from "sonner"

interface CartDrawerProps {
  loja: Estabelecimento
  fretes: Frete[]
  cupons: Cupom[]
}

export function CartDrawer({ loja, fretes, cupons }: CartDrawerProps) {
  const {
    items, isOpen, closeCart,
    removeItem, updateQuantity,
    nomeCliente, setNomeCliente,
    whatsappCliente, setWhatsappCliente,
    formaEntrega, setFormaEntrega,
    mesa, setMesa,
    bairroEntrega, setBairroEntrega,
    freteValor, setFreteValor,
    formaPagamento, setFormaPagamento,
    trocoParaValor, setTrocoParaValor,
    cupomCodigo, setCupomCodigo,
    cupomDesconto, setCupomDesconto,
    cupomTipo, setCupomTipo,
    enderecoCep, enderecoRua, enderecoNumero, enderecoBairro,
    enderecoComplemento, enderecoReferencia,
    setEndereco,
    getSubtotal, getTotal, clearCart,
  } = useCartStore()

  const [cupomInput, setCupomInput] = useState("")
  const [step, setStep] = useState<"cart" | "checkout">("cart")

  const subtotal = getSubtotal()
  const total = getTotal()

  const handleFreteSelect = (frete: Frete) => {
    setBairroEntrega(frete.nome)
    setFreteValor(frete.valor)
  }

  const handleCupomApply = () => {
    const found = cupons.find(
      (c) => c.codigo.toUpperCase() === cupomInput.toUpperCase()
    )
    if (!found) {
      toast.error("Cupom invalido ou expirado")
      return
    }
    setCupomCodigo(found.codigo)
    setCupomTipo(found.tipo)
    if (found.tipo === "1") {
      setCupomDesconto(parseFloat(found.descontoPorcentagem || "0"))
    } else {
      setCupomDesconto(found.descontoFixo || 0)
    }
    toast.success(`Cupom ${found.codigo} aplicado!`)
  }

  const cupomDescontoValor =
    cupomDesconto > 0
      ? cupomTipo === "1"
        ? subtotal * (cupomDesconto / 100)
        : cupomDesconto
      : 0

  const handleFinalize = () => {
    if (!nomeCliente.trim()) {
      toast.error("Informe seu nome")
      return
    }
    if (!whatsappCliente.trim()) {
      toast.error("Informe seu WhatsApp")
      return
    }
    if (!formaEntrega) {
      toast.error("Selecione a forma de entrega")
      return
    }
    if (formaEntrega === "delivery" && !bairroEntrega) {
      toast.error("Selecione o bairro de entrega")
      return
    }
    if (formaEntrega === "mesa" && !mesa) {
      toast.error("Informe o numero da mesa")
      return
    }
    if (!formaPagamento) {
      toast.error("Selecione a forma de pagamento")
      return
    }
    if (subtotal < loja.pedidoMinimo) {
      toast.error(`Pedido minimo: ${formatCurrency(loja.pedidoMinimo)}`)
      return
    }

    const pedidoId = Math.floor(Math.random() * 9000) + 1000
    const formaPagamentoLabels: Record<string, string> = {
      "1": "Dinheiro", "2": "Cartao Debito", "3": "Cartao Credito",
      "4": "Cartao Alimentacao", "6": "PIX",
    }

    const itens = items.map((item) => ({
      quantidade: item.quantidade,
      nome: item.nome,
      variacaoNome: item.variacoes?.[0]?.grupoNome,
      variacaoEscolha: item.variacoes?.[0]?.escolhas.map((e) => e.nome).join(", "),
      observacao: item.observacao,
      subtotal: item.subtotal,
    }))

    const waUrl = generateWhatsAppUrl(
      loja,
      {
        id: pedidoId,
        nome: nomeCliente,
        whatsapp: whatsappCliente,
        formaEntrega,
        enderecoRua,
        enderecoNumero,
        enderecoBairro: bairroEntrega || enderecoBairro,
        enderecoCep,
        formaPagamento: formaPagamentoLabels[formaPagamento] || formaPagamento,
        vPedido: subtotal,
        taxa: freteValor,
      },
      itens
    )

    window.open(waUrl, "_blank")
    clearCart()
    closeCart()
    toast.success("Pedido enviado via WhatsApp!")
  }

  if (!isOpen) return null

  const entregaOptions = [
    { key: "delivery", icon: Truck, label: "Delivery", enabled: loja.delivery === "1" },
    { key: "retirada", icon: Store, label: "Retirada", enabled: loja.retirada === "1" },
    { key: "balcao", icon: UtensilsCrossed, label: "Balcao", enabled: loja.balcao === "1" },
    { key: "mesa", icon: MapPin, label: "Mesa", enabled: loja.mesa === "1" },
  ]

  const pagamentoOptions = [
    { key: "1", label: "Dinheiro", enabled: loja.pagamentoDinheiro === "1" },
    { key: "2", label: "Cartao Debito", enabled: loja.pagamentoCartaoDebito === "1" },
    { key: "3", label: "Cartao Credito", enabled: loja.pagamentoCartaoCredito === "1" },
    { key: "4", label: "Alimentacao", enabled: loja.pagamentoCartaoAlimentacao === "1" },
    { key: "6", label: "PIX", enabled: loja.pagamentoPix === "1" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={closeCart} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" style={{ color: loja.cor }} />
            <h2 className="text-lg font-bold text-card-foreground">
              {step === "cart" ? "Sua Sacola" : "Finalizar Pedido"}
            </h2>
            <span className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: loja.cor }}>
              {items.length}
            </span>
          </div>
          <button onClick={closeCart} className="rounded-full p-1 text-muted-foreground hover:text-card-foreground" aria-label="Fechar sacola">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
              <p className="mt-4 text-muted-foreground">Sua sacola esta vazia</p>
              <button
                onClick={closeCart}
                className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: loja.cor }}
              >
                Ver cardapio
              </button>
            </div>
          ) : step === "cart" ? (
            <div className="p-5">
              {/* Items */}
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-lg border border-border p-3">
                    {item.imagem && (
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        crossOrigin="anonymous"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-card-foreground">{item.nome}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Remover item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {item.variacoes && item.variacoes.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {item.variacoes.map((v) => v.escolhas.map((e) => e.nome).join(", ")).join(" | ")}
                        </p>
                      )}
                      {item.observacao && (
                        <p className="text-xs text-muted-foreground italic">Obs: {item.observacao}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-md border border-border px-0.5">
                          <button
                            onClick={() =>
                              item.quantidade > 1
                                ? updateQuantity(item.id, item.quantidade - 1)
                                : removeItem(item.id)
                            }
                            className="p-1 text-muted-foreground hover:text-card-foreground"
                            aria-label="Diminuir"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-5 text-center text-sm font-semibold text-card-foreground">
                            {item.quantidade}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                            className="p-1 text-muted-foreground hover:text-card-foreground"
                            aria-label="Aumentar"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold" style={{ color: loja.cor }}>
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Checkout step */
            <div className="flex flex-col gap-5 p-5">
              {/* Customer info */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-card-foreground">Seus dados</h3>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp (11) 99999-9999"
                    value={whatsappCliente}
                    onChange={(e) => setWhatsappCliente(e.target.value)}
                    className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Forma de entrega */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-card-foreground">Forma de entrega</h3>
                <div className="grid grid-cols-2 gap-2">
                  {entregaOptions
                    .filter((o) => o.enabled)
                    .map((opt) => {
                      const Icon = opt.icon
                      return (
                        <button
                          key={opt.key}
                          onClick={() => {
                            setFormaEntrega(opt.key)
                            if (opt.key !== "delivery") {
                              setFreteValor(0)
                              setBairroEntrega("")
                            }
                          }}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all ${
                            formaEntrega === opt.key
                              ? "border-2 shadow-sm text-card-foreground"
                              : "border-border text-muted-foreground hover:bg-muted/50"
                          }`}
                          style={
                            formaEntrega === opt.key
                              ? { borderColor: loja.cor }
                              : undefined
                          }
                        >
                          <Icon className="h-4 w-4" />
                          {opt.label}
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Delivery address */}
              {formaEntrega === "delivery" && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-card-foreground">Endereco de entrega</h3>
                  <div className="flex flex-col gap-2">
                    <select
                      value={bairroEntrega}
                      onChange={(e) => {
                        const frete = fretes.find((f) => f.nome === e.target.value)
                        if (frete) handleFreteSelect(frete)
                      }}
                      className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Selecione o bairro</option>
                      {fretes.map((f) => (
                        <option key={f.id} value={f.nome}>
                          {f.nome} - {formatCurrency(f.valor)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text" placeholder="Rua"
                      value={enderecoRua}
                      onChange={(e) => setEndereco("enderecoRua", e.target.value)}
                      className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text" placeholder="Numero"
                        value={enderecoNumero}
                        onChange={(e) => setEndereco("enderecoNumero", e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <input
                        type="text" placeholder="CEP"
                        value={enderecoCep}
                        onChange={(e) => setEndereco("enderecoCep", e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <input
                      type="text" placeholder="Complemento"
                      value={enderecoComplemento}
                      onChange={(e) => setEndereco("enderecoComplemento", e.target.value)}
                      className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="text" placeholder="Referencia"
                      value={enderecoReferencia}
                      onChange={(e) => setEndereco("enderecoReferencia", e.target.value)}
                      className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              )}

              {/* Mesa */}
              {formaEntrega === "mesa" && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-card-foreground">Numero da mesa</h3>
                  <input
                    type="number" placeholder="Ex: 5"
                    value={mesa || ""}
                    onChange={(e) => setMesa(parseInt(e.target.value) || null)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              {/* Cupom */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-card-foreground">Cupom de desconto</h3>
                {cupomCodigo ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-sm">
                    <span className="font-medium text-green-800">
                      {cupomCodigo} aplicado (-{formatCurrency(cupomDescontoValor)})
                    </span>
                    <button
                      onClick={() => {
                        setCupomCodigo("")
                        setCupomDesconto(0)
                        setCupomTipo("")
                        setCupomInput("")
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Codigo do cupom"
                      value={cupomInput}
                      onChange={(e) => setCupomInput(e.target.value.toUpperCase())}
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      onClick={handleCupomApply}
                      className="shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
                      style={{ backgroundColor: loja.cor }}
                    >
                      Aplicar
                    </button>
                  </div>
                )}
              </div>

              {/* Forma de pagamento */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-card-foreground">Forma de pagamento</h3>
                <div className="flex flex-col gap-1.5">
                  {pagamentoOptions
                    .filter((o) => o.enabled)
                    .map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setFormaPagamento(opt.key)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all ${
                          formaPagamento === opt.key
                            ? "border-2 shadow-sm text-card-foreground"
                            : "border-border text-muted-foreground hover:bg-muted/50"
                        }`}
                        style={
                          formaPagamento === opt.key
                            ? { borderColor: loja.cor }
                            : undefined
                        }
                      >
                        <div
                          className={`h-4 w-4 rounded-full border-2 ${
                            formaPagamento === opt.key
                              ? "border-transparent"
                              : "border-muted-foreground/30"
                          }`}
                          style={
                            formaPagamento === opt.key
                              ? { backgroundColor: loja.cor }
                              : undefined
                          }
                        />
                        {opt.label}
                      </button>
                    ))}
                </div>
              </div>

              {/* Troco */}
              {formaPagamento === "1" && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-card-foreground">Precisa de troco?</h3>
                  <input
                    type="text"
                    placeholder="Troco para R$ ..."
                    value={trocoParaValor}
                    onChange={(e) => setTrocoParaValor(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              {/* PIX info */}
              {formaPagamento === "6" && loja.chavePix && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground">Chave PIX</p>
                  <p className="text-sm font-bold text-card-foreground">{loja.chavePix}</p>
                  <p className="text-xs text-muted-foreground">{loja.beneficiarioPix}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            {/* Summary */}
            <div className="mb-3 flex flex-col gap-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {freteValor > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Entrega ({bairroEntrega})</span>
                  <span>{formatCurrency(freteValor)}</span>
                </div>
              )}
              {cupomDescontoValor > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>- {formatCurrency(cupomDescontoValor)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-1 text-base font-bold text-card-foreground">
                <span>Total</span>
                <span style={{ color: loja.cor }}>{formatCurrency(total)}</span>
              </div>
            </div>

            {step === "cart" ? (
              <button
                onClick={() => setStep("checkout")}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity"
                style={{ backgroundColor: loja.cor }}
              >
                Continuar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("cart")}
                  className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-card-foreground"
                >
                  Voltar
                </button>
                <button
                  onClick={handleFinalize}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-opacity"
                  style={{ backgroundColor: loja.cor }}
                >
                  Enviar Pedido via WhatsApp
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
