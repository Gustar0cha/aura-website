"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Plus, Eye, Loader2, CreditCard, Pencil, Trash2 } from "lucide-react"
import { MemberCard, MemberCardBack } from "@/components/member-card"
import { DependentCard, DependentCardBack } from "@/components/dependent-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
    cpf: string
    nome: string
    tipo: 'admin' | 'colaborador'
    status: 'ativo' | 'inativo' | 'desativado'
    isDependente: boolean
    titularCpf?: string
    dataValidade?: string
}

export default function AdminCarteirasPage() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        cpf: '',
        nome: '',
        password: '',
        tipo: 'colaborador' as 'admin' | 'colaborador',
        status: 'ativo' as 'ativo' | 'inativo' | 'desativado',
        isDependente: false,
        titularCpf: undefined as string | undefined,
        dataValidade: '',
    })
    const [editFormData, setEditFormData] = useState({
        cpf: '',
        nome: '',
        status: 'ativo' as 'ativo' | 'inativo' | 'desativado',
        isDependente: false,
        titularCpf: undefined as string | undefined,
        dataValidade: '',
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const auth = localStorage.getItem('aura_auth')
            const response = await fetch('/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${auth}`
                }
            })

            if (!response.ok) {
                throw new Error('Erro ao carregar usuários')
            }

            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error('Erro:', error)
            alert('Erro ao carregar usuários')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateUser = async () => {
        setIsSubmitting(true)
        try {
            const auth = localStorage.getItem('aura_auth')

            // Calcula validade padrão (12 meses)
            const validade = new Date()
            validade.setMonth(validade.getMonth() + 12)
            const validadeFormatted = validade.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })

            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    dataValidade: formData.dataValidade || validadeFormatted,
                })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Erro ao criar usuário')
            }

            alert('Usuário criado com sucesso!')
            setShowCreateModal(false)
            setFormData({
                cpf: '',
                nome: '',
                password: '',
                tipo: 'colaborador',
                status: 'ativo',
                isDependente: false,
                titularCpf: undefined,
                dataValidade: '',
            })
            fetchUsers()
        } catch (error: any) {
            console.error('Erro:', error)
            alert(error.message || 'Erro ao criar usuário')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditUser = async () => {
        setIsSubmitting(true)
        try {
            const auth = localStorage.getItem('aura_auth')

            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editFormData)
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Erro ao atualizar usuário')
            }

            alert('Carteira atualizada com sucesso!')
            setShowEditModal(false)
            fetchUsers()
        } catch (error: any) {
            console.error('Erro:', error)
            alert(error.message || 'Erro ao atualizar usuário')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePreview = (user: User) => {
        setSelectedUser(user)
        setShowPreviewModal(true)
    }

    const handleEdit = (user: User) => {
        setEditFormData({
            cpf: user.cpf,
            nome: user.nome,
            status: user.status,
            isDependente: user.isDependente,
            titularCpf: user.titularCpf,
            dataValidade: user.dataValidade || '',
        })
        setShowEditModal(true)
    }

    const generateRegistro = (cpf: string, tipo: 'titular' | 'dependente') => {
        const prefix = tipo === 'titular' ? 'TIT' : 'DEP'
        const cpfShort = cpf.replace(/\D/g, '').slice(-4)
        const random = Math.random().toString(36).substring(2, 4).toUpperCase()
        return `${prefix}-AURA-G-${cpfShort}${random}`
    }

    const titulares = users.filter(u => !u.isDependente && u.cpf && u.cpf.trim() !== '')

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gerenciar Carteiras</h1>
                    <p className="text-gray-600 mt-1">Crie e gerencie carteiras de associados e dependentes</p>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Associado
                </Button>
            </div>

            <Card className="bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Validade</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.cpf}>
                                <TableCell className="font-medium">{user.nome}</TableCell>
                                <TableCell>{user.cpf}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isDependente
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {user.isDependente ? 'Dependente' : 'Titular'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'ativo'
                                        ? 'bg-green-100 text-green-800'
                                        : user.status === 'inativo'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </TableCell>
                                <TableCell>{user.dataValidade || '-'}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handlePreview(user)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(user)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Modal de Criação */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Criar Novo Associado</DialogTitle>
                        <DialogDescription>
                            Preencha os dados abaixo para criar uma nova carteira
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome Completo *</Label>
                                <Input
                                    id="nome"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    placeholder="João Silva"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF *</Label>
                                <Input
                                    id="cpf"
                                    value={formData.cpf}
                                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                    placeholder="000.000.000-00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Senha de acesso"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo de Carteira *</Label>
                                <Select
                                    value={formData.isDependente ? 'dependente' : 'titular'}
                                    onValueChange={(value) => setFormData({
                                        ...formData,
                                        isDependente: value === 'dependente',
                                        titularCpf: value === 'titular' ? undefined : formData.titularCpf
                                    })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="titular">Titular</SelectItem>
                                        <SelectItem value="dependente">Dependente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
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
                        </div>

                        {formData.isDependente && (
                            <div className="space-y-2">
                                <Label htmlFor="titular">Titular *</Label>
                                {titulares.length === 0 ? (
                                    <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                                        ⚠️ Nenhum titular cadastrado. Crie um titular primeiro antes de adicionar dependentes.
                                    </div>
                                ) : (
                                    <Select
                                        value={formData.titularCpf}
                                        onValueChange={(value) => setFormData({ ...formData, titularCpf: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o titular" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {titulares.map((titular) => (
                                                <SelectItem key={titular.cpf} value={titular.cpf}>
                                                    {titular.nome} - {titular.cpf}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="validade">Validade (opcional)</Label>
                            <Input
                                id="validade"
                                value={formData.dataValidade}
                                onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
                                placeholder="MM/AAAA (ex: 12/2025)"
                            />
                            <p className="text-xs text-gray-500">Se não informado, será gerado automaticamente (12 meses)</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateUser}
                            disabled={
                                isSubmitting ||
                                !formData.nome ||
                                !formData.cpf ||
                                !formData.password ||
                                (formData.isDependente && !formData.titularCpf)
                            }
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Criar Carteira
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Edição */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Carteira</DialogTitle>
                        <DialogDescription>
                            Atualize os dados da carteira do associado
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-nome">Nome Completo *</Label>
                                <Input
                                    id="edit-nome"
                                    value={editFormData.nome}
                                    onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                                    placeholder="João Silva"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-cpf">CPF</Label>
                                <Input
                                    id="edit-cpf"
                                    value={editFormData.cpf}
                                    disabled
                                    className="bg-gray-100"
                                />
                                <p className="text-xs text-gray-500">O CPF não pode ser alterado</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-tipo">Tipo de Carteira</Label>
                                <Select
                                    value={editFormData.isDependente ? 'dependente' : 'titular'}
                                    onValueChange={(value) => setEditFormData({
                                        ...editFormData,
                                        isDependente: value === 'dependente',
                                        titularCpf: value === 'titular' ? undefined : editFormData.titularCpf
                                    })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="titular">Titular</SelectItem>
                                        <SelectItem value="dependente">Dependente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Status *</Label>
                                <Select
                                    value={editFormData.status}
                                    onValueChange={(value: any) => setEditFormData({ ...editFormData, status: value })}
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
                        </div>

                        {editFormData.isDependente && (
                            <div className="space-y-2">
                                <Label htmlFor="edit-titular">Titular *</Label>
                                <Select
                                    value={editFormData.titularCpf}
                                    onValueChange={(value) => setEditFormData({ ...editFormData, titularCpf: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o titular" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {titulares.map((titular) => (
                                            <SelectItem key={titular.cpf} value={titular.cpf}>
                                                {titular.nome} - {titular.cpf}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="edit-validade">Validade</Label>
                            <Input
                                id="edit-validade"
                                value={editFormData.dataValidade}
                                onChange={(e) => setEditFormData({ ...editFormData, dataValidade: e.target.value })}
                                placeholder="MM/AAAA (ex: 12/2025)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditModal(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEditUser}
                            disabled={isSubmitting || !editFormData.nome}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Alterações'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Preview */}
            <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Preview da Carteira - {selectedUser?.nome}</DialogTitle>
                        <DialogDescription>
                            Visualização da carteira do associado
                        </DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <Tabs defaultValue="frente" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="frente">Frente</TabsTrigger>
                                <TabsTrigger value="verso">Verso</TabsTrigger>
                            </TabsList>
                            <TabsContent value="frente" className="mt-4">
                                {selectedUser.isDependente ? (
                                    <DependentCard
                                        nome={selectedUser.nome}
                                        cpf={selectedUser.cpf}
                                        registro={generateRegistro(selectedUser.cpf, 'dependente')}
                                        titularNome={users.find(u => u.cpf === selectedUser.titularCpf)?.nome || ''}
                                    />
                                ) : (
                                    <MemberCard
                                        nome={selectedUser.nome}
                                        cpf={selectedUser.cpf}
                                        registro={generateRegistro(selectedUser.cpf, 'titular')}
                                    />
                                )}
                            </TabsContent>
                            <TabsContent value="verso" className="mt-4">
                                {selectedUser.isDependente ? (
                                    <DependentCardBack
                                        nome={selectedUser.nome}
                                        cpf={selectedUser.cpf}
                                        titularNome={users.find(u => u.cpf === selectedUser.titularCpf)?.nome || ''}
                                    />
                                ) : (
                                    <MemberCardBack
                                        nome={selectedUser.nome}
                                        cpf={selectedUser.cpf}
                                    />
                                )}
                            </TabsContent>
                        </Tabs>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setShowPreviewModal(false)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
