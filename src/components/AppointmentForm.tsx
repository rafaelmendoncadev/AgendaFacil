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
import { useAppointments } from '@/hooks/useAppointments';
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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    time: '',
    reminder: true,
  });

  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        title: editingAppointment.title,
        description: editingAppointment.description,
        date: editingAppointment.date,
        time: editingAppointment.time,
        reminder: editingAppointment.reminder || false,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '',
        reminder: true,
      });
    }
  }, [editingAppointment, selectedDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.time.trim()) {
      alert('Por favor, preencha o título e horário do compromisso.');
      return;
    }

    if (editingAppointment) {
      updateAppointment(editingAppointment.id, formData);
    } else {
      addAppointment(formData);
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="flex items-center space-x-2">
            <input
              id="reminder"
              name="reminder"
              type="checkbox"
              checked={formData.reminder}
              onChange={handleChange}
              className="rounded border-input"
            />
            <Label htmlFor="reminder">Ativar lembrete</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingAppointment ? 'Salvar Alterações' : 'Criar Compromisso'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentForm;