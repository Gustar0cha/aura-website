"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Edit2, Check } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface User {
  cpf: string
  nome: string
  email: string
  telefone: string
  empresa: string
  tipo: 'admin' | 'colaborador'
  status: 'ativo' | 'inativo' | 'desativado'
  dataValidade: string
  dataPagamento: string
  isDependente?: boolean
  titularCpf?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewUser, setShowNewUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    cpf: "",
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    password: "",
    tipo: "colaborador" as const,
    status: "ativo" as const,
    dataValidade: "",
    dataPagamento: "",
    isDependente: false,
    titularCpf: ""
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('aura_auth')}`
        }
      })

      if (!response.ok) throw new Error('Falha ao carregar usuários')

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('aura_auth')}`
        },
        body: JSON.stringify(newUser)
      })

      if (!response.ok) throw new Error('Falha ao criar usuário')

      setShowNewUser(false)
      fetchUsers()
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      alert('Erro ao criar usuário. Tente novamente.')
    }
  }

  const filteredUsers = users.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.empresa || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <Button onClick={() => setShowNewUser(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.cpf} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{user.nome}</h3>
                  <p className="text-sm text-gray-600">CPF: {user.cpf}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">Empresa: {user.empresa || 'Não informada'}</p>
                  {user.isDependente && user.titularCpf && (
                    <p className="text-sm text-blue-600">
                      Dependente de: {users.find(u => u.cpf && u.cpf === user.titularCpf)?.nome || user.titularCpf}
                    </p>
                  )}
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowEditUser(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${user.status === 'ativo' ? 'bg-green-100 text-green-800' :
                        user.status === 'inativo' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Validade: {user.dataValidade || 'N/A'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showNewUser} onOpenChange={setShowNewUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={newUser.cpf}
                onChange={(e) => setNewUser({ ...newUser, cpf: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={newUser.nome}
                onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={newUser.telefone}
                onChange={(e) => setNewUser({ ...newUser, telefone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={newUser.empresa}
                onChange={(e) => setNewUser({ ...newUser, empresa: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDependente"
                  checked={newUser.isDependente}
                  onChange={(e) => {
                    const isDependent = e.target.checked;
                    console.log('Alterando isDependente para:', isDependent);
                    setNewUser({ 
                      ...newUser, 
                      isDependente: isDependent,
                      titularCpf: isDependent ? newUser.titularCpf : "" 
                    });
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isDependente">É dependente de outro usuário?</Label>
              </div>
              {newUser.isDependente && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {newUser.titularCpf ? (
                        users.find(u => u.cpf === newUser.titularCpf)?.nome || 'Usuário não encontrado'
                      ) : (
                        "Selecione o titular"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar titular..." />
                      <CommandEmpty>Nenhum titular encontrado.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {users
                          .filter(u => !u.isDependente && u.cpf && u.cpf !== newUser.cpf)
                          .map(user => (
                            <CommandItem
                              key={user.cpf}
                              value={`${user.nome} ${user.cpf}`}
                              onSelect={() => setNewUser({ ...newUser, titularCpf: user.cpf })}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  newUser.titularCpf === user.cpf ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {user.nome || 'Sem nome'} (CPF: {user.cpf})
                            </CommandItem>
                          ))
                        }
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={newUser.tipo}
                onValueChange={(value: 'admin' | 'colaborador') => 
                  setNewUser({ ...newUser, tipo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="colaborador">Colaborador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newUser.status}
                onValueChange={(value: 'ativo' | 'inativo' | 'desativado') => 
                  setNewUser({ ...newUser, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="desativado">Desativado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dataValidade">Data de Validade</Label>
              <Input
                id="dataValidade"
                type="date"
                value={newUser.dataValidade}
                onChange={(e) => setNewUser({ ...newUser, dataValidade: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dataPagamento">Data do Último Pagamento</Label>
              <Input
                id="dataPagamento"
                type="date"
                value={newUser.dataPagamento}
                onChange={(e) => setNewUser({ ...newUser, dataPagamento: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowNewUser(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser}>
              Criar Usuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-nome">Nome</Label>
              <Input
                id="edit-nome"
                value={selectedUser?.nome || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, nome: e.target.value} : null)}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, email: e.target.value} : null)}
              />
            </div>
            <div>
              <Label htmlFor="edit-telefone">Telefone</Label>
              <Input
                id="edit-telefone"
                value={selectedUser?.telefone || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, telefone: e.target.value} : null)}
              />
            </div>
            <div>
              <Label htmlFor="edit-empresa">Empresa</Label>
              <Input
                id="edit-empresa"
                value={selectedUser?.empresa || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, empresa: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isDependente"
                  checked={selectedUser?.isDependente || false}
                  onChange={(e) => {
                    const isDependent = e.target.checked;
                    console.log('Alterando isDependente para:', isDependent);
                    setSelectedUser(prev => prev ? {
                      ...prev,
                      isDependente: isDependent,
                      titularCpf: isDependent ? prev.titularCpf : ""
                    } : null);
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-isDependente">É dependente de outro usuário?</Label>
              </div>
              {selectedUser?.isDependente && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedUser?.titularCpf ? (
                        users.find(u => u.cpf === selectedUser.titularCpf)?.nome || 'Usuário não encontrado'
                      ) : (
                        "Selecione o titular"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar titular..." />
                      <CommandEmpty>Nenhum titular encontrado.</CommandEmpty>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {users
                          .filter(u => !u.isDependente && u.cpf && u.cpf !== selectedUser?.cpf)
                          .map(user => (
                            <CommandItem
                              key={user.cpf}
                              value={`${user.nome} ${user.cpf}`}
                              onSelect={() => setSelectedUser(prev => prev ? {...prev, titularCpf: user.cpf} : null)}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedUser?.titularCpf === user.cpf ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {user.nome || 'Sem nome'} (CPF: {user.cpf})
                            </CommandItem>
                          ))
                        }
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div>
              <Label htmlFor="edit-tipo">Tipo</Label>
              <Select
                value={selectedUser?.tipo || 'colaborador'}
                onValueChange={(value: 'admin' | 'colaborador') => 
                  setSelectedUser(prev => prev ? {...prev, tipo: value} : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="colaborador">Colaborador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={selectedUser?.status || 'ativo'}
                onValueChange={(value: 'ativo' | 'inativo' | 'desativado') => 
                  setSelectedUser(prev => prev ? {...prev, status: value} : null)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="desativado">Desativado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-dataValidade">Data de Validade</Label>
              <Input
                id="edit-dataValidade"
                type="date"
                value={selectedUser?.dataValidade || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, dataValidade: e.target.value} : null)}
              />
            </div>
            <div>
              <Label htmlFor="edit-dataPagamento">Data do Último Pagamento</Label>
              <Input
                id="edit-dataPagamento"
                type="date"
                value={selectedUser?.dataPagamento || ''}
                onChange={(e) => setSelectedUser(prev => prev ? {...prev, dataPagamento: e.target.value} : null)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => {
              setShowEditUser(false)
              setSelectedUser(null)
            }}>
              Cancelar
            </Button>
            <Button onClick={async () => {
              if (!selectedUser) return;
              
              try {
                console.log('Salvando usuário:', selectedUser);
                const response = await fetch(`/api/admin/users/${selectedUser.cpf}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('aura_auth')}`
                  },
                  body: JSON.stringify(selectedUser)
                });

                if (!response.ok) {
                  throw new Error('Falha ao atualizar usuário');
                }

                setShowEditUser(false)
                setSelectedUser(null)
                fetchUsers()
              } catch (error) {
                console.error('Erro ao atualizar usuário:', error)
                alert('Erro ao atualizar usuário. Tente novamente.')
              }
            }}>
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
