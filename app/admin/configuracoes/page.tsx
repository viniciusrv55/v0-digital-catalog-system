"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Save } from "lucide-react"
import { toast } from "sonner"

export default function AdminConfiguracoesPage() {
  const [config, setConfig] = useState({
    nomeApp: "ZapMaxx",
    emailSuporte: "suporte@zapmaxx.com",
    dominioBase: "zapmaxx.com.br",
    taxaPlataforma: "5",
    manutencao: false,
    cadastroAberto: true,
    emailNotificacoes: true,
  })

  function handleSave() {
    toast.success("Configuracoes salvas com sucesso")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-sm text-muted-foreground">Configuracoes gerais da plataforma</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4 text-primary" />
              Dados da Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Nome da Aplicacao</Label>
              <Input
                value={config.nomeApp}
                onChange={(e) => setConfig({ ...config, nomeApp: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email de Suporte</Label>
              <Input
                type="email"
                value={config.emailSuporte}
                onChange={(e) => setConfig({ ...config, emailSuporte: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Dominio Base</Label>
              <Input
                value={config.dominioBase}
                onChange={(e) => setConfig({ ...config, dominioBase: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Taxa da Plataforma (%)</Label>
              <Input
                type="number"
                value={config.taxaPlataforma}
                onChange={(e) => setConfig({ ...config, taxaPlataforma: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4 text-primary" />
              Opcoes do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Modo Manutencao</p>
                <p className="text-xs text-muted-foreground">Desativa o acesso publico as lojas</p>
              </div>
              <Switch
                checked={config.manutencao}
                onCheckedChange={(v) => setConfig({ ...config, manutencao: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Cadastro Aberto</p>
                <p className="text-xs text-muted-foreground">Permite novos estabelecimentos se cadastrarem</p>
              </div>
              <Switch
                checked={config.cadastroAberto}
                onCheckedChange={(v) => setConfig({ ...config, cadastroAberto: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Notificacoes por Email</p>
                <p className="text-xs text-muted-foreground">Envia emails sobre novos cadastros e pedidos</p>
              </div>
              <Switch
                checked={config.emailNotificacoes}
                onCheckedChange={(v) => setConfig({ ...config, emailNotificacoes: v })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Configuracoes
        </Button>
      </div>
    </div>
  )
}
