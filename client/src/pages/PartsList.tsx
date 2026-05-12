import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { partsApi } from '@/api/client';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { PartStatus, type CreatePartDto, type Part } from '@/types';

export default function PartsList() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const [formData, setFormData] = useState<CreatePartDto>({
    partNumber: '',
    description: '',
    status: PartStatus.AVAILABLE,
    quantity: 0,
    location: '',
  });

  const { data: parts, isLoading } = useQuery({
    queryKey: ['parts'],
    queryFn: partsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: partsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Peça criada com sucesso');
      setIsCreateOpen(false);
      resetForm();
    },
    onError: () => {
      toast.error('Falha ao criar peça');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Part> }) =>
      partsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Peça atualizada com sucesso');
      setIsEditOpen(false);
      setSelectedPart(null);
      resetForm();
    },
    onError: () => {
      toast.error('Falha ao atualizar peça');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: partsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success('Peça excluída com sucesso');
    },
    onError: () => {
      toast.error('Falha ao excluir peça');
    },
  });

  const resetForm = () => {
    setFormData({
      partNumber: '',
      description: '',
      status: PartStatus.AVAILABLE,
      quantity: 0,
      location: '',
    });
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleEdit = (part: Part) => {
    setSelectedPart(part);
    setFormData({
      partNumber: part.partNumber,
      description: part.description,
      status: part.status,
      quantity: part.quantity,
      location: part.location || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (selectedPart) {
      updateMutation.mutate({ id: selectedPart.id, data: formData });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza de que deseja excluir esta peça?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: PartStatus) => {
    const colors = {
      [PartStatus.AVAILABLE]: 'bg-green-500',
      [PartStatus.IN_USE]: 'bg-blue-500',
      [PartStatus.MAINTENANCE]: 'bg-yellow-500',
      [PartStatus.RETIRED]: 'bg-gray-500',
    };
    return colors[status];
  };

  const getStatusLabel = (status: PartStatus) => {
    const labels = {
      [PartStatus.AVAILABLE]: 'Disponível',
      [PartStatus.IN_USE]: 'Em Uso',
      [PartStatus.MAINTENANCE]: 'Manutenção',
      [PartStatus.RETIRED]: 'Aposentado',
    };
    return labels[status];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Gestão de Peças</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Peça
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Peça</DialogTitle>
              <DialogDescription>
                Adicione uma nova peça ao seu inventário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="partNumber">Número da Peça</Label>
                <Input
                  id="partNumber"
                  value={formData.partNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, partNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as PartStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PartStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {getStatusLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Criar Peça
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número da Peça</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts?.map((part) => (
              <TableRow key={part.id}>
                <TableCell className="font-medium">{part.partNumber}</TableCell>
                <TableCell>{part.description}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(part.status)}>
                    {getStatusLabel(part.status)}
                  </Badge>
                </TableCell>
                <TableCell>{part.quantity}</TableCell>
                <TableCell>{part.location || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(part)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(part.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Peça</DialogTitle>
            <DialogDescription>Atualizar informações da peça</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-partNumber">Número da Peça</Label>
              <Input
                id="edit-partNumber"
                value={formData.partNumber}
                onChange={(e) =>
                  setFormData({ ...formData, partNumber: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as PartStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PartStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-quantity">Quantidade</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Localização</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Atualizar Peça
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
