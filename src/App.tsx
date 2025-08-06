import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CalendarView from '@/components/CalendarView';
import AppointmentList from '@/components/AppointmentList';
import AppointmentForm from '@/components/AppointmentForm';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/types';

function App() {
  const [activeView, setActiveView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button onClick={handleNewAppointment}>
                <Plus size={16} className="mr-2" />
                Novo Compromisso
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              <AppointmentList selectedDate={selectedDate} onEditAppointment={handleEditAppointment} />
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Calendário</h1>
              <Button onClick={handleNewAppointment}>
                <Plus size={16} className="mr-2" />
                Novo Compromisso
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              <AppointmentList selectedDate={selectedDate} onEditAppointment={handleEditAppointment} />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Sobre o AgendaFácil</h2>
              <p className="text-muted-foreground">
                Este é um MVP de agenda de compromissos desenvolvido com React e Tailwind CSS.
                Os dados são armazenados localmente no seu navegador.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="lg:ml-64 p-4 lg:p-8">
        {renderMainContent()}
      </main>
      
      <AppointmentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        selectedDate={selectedDate}
        editingAppointment={editingAppointment}
      />
    </div>
  );
}

export default App;
