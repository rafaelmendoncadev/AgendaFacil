import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppointments } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { Appointment } from '@/types';
import { format } from 'date-fns';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  editingAppointment?: Appointment | null;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  isOpen,
  onClose,
  selectedDate,
  editingAppointment,
}) => {
  const { addAppointment, updateAppointment } = useAppointments();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    time: '',
  });

  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        title: editingAppointment.title,
        description: editingAppointment.description,
        date: editingAppointment.date,
        time: editingAppointment.time,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '',
      });
    }
  }, [editingAppointment, selectedDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.time.trim()) {
      alert('Por favor, preencha o título e horário do compromisso.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, formData);
        toast({
          title: "Sucesso!",
          description: "Compromisso atualizado com sucesso!",
          variant: "success",
        });
      } else {
        await addAppointment(formData);
        toast({
          title: "Sucesso!",
          description: "Compromisso criado com sucesso!",
          variant: "success",
        });
        
        // Pequeno delay para garantir que o estado foi atualizado antes de fechar
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar compromisso:', error);
      toast({
        title: "Erro!",
        description: "Erro ao salvar compromisso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingAppointment ? 'Editar Compromisso' : 'Novo Compromisso'}
          </DialogTitle>
          <DialogDescription>
            {editingAppointment 
              ? 'Faça as alterações necessárias no seu compromisso.'
              : 'Preencha os detalhes do seu novo compromisso.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Reunião de equipe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalhes do compromisso..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? 'Salvando...' : (editingAppointment ? 'Salvar Alterações' : 'Criar Compromisso')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;