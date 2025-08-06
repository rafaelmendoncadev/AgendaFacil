import React from 'react';
import { Plus, Calendar, CheckSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface QuickActionsProps {
  onNewAppointment: () => void;
  onNewAppointmentToday?: () => void;
  onNewAppointmentTomorrow?: () => void;
  onNewTask: () => void;
  onNewHighPriorityTask?: () => void;
  onGoToCalendar: () => void;
  onGoToTasks: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onNewAppointment,
  onNewAppointmentToday,
  onNewAppointmentTomorrow,
  onNewTask,
  onNewHighPriorityTask,
  onGoToCalendar,
  onGoToTasks,
}) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);

  const quickActionItems = [
    {
      title: 'Compromissos',
      description: 'Gerencie seus compromissos',
      actions: [
        {
          label: 'Novo Compromisso',
          onClick: onNewAppointment,
          icon: Plus,
          variant: 'default' as const,
        },
        {
          label: `Para Hoje (${format(today, 'd/MM', { locale: ptBR })})`,
          onClick: onNewAppointmentToday || onNewAppointment,
          icon: Calendar,
          variant: 'outline' as const,
        },
        {
          label: `Para Amanhã (${format(tomorrow, 'd/MM', { locale: ptBR })})`,
          onClick: onNewAppointmentTomorrow || onNewAppointment,
          icon: Calendar,
          variant: 'outline' as const,
        },
      ],
    },
    {
      title: 'Tarefas',
      description: 'Organize suas atividades',
      actions: [
        {
          label: 'Nova Tarefa',
          onClick: onNewTask,
          icon: Plus,
          variant: 'default' as const,
        },
        {
          label: 'Alta Prioridade',
          onClick: onNewHighPriorityTask || onNewTask,
          icon: CheckSquare,
          variant: 'outline' as const,
        },
      ],
    },
  ];

  const navigationActions = [
    {
      label: 'Ir para Calendário',
      onClick: onGoToCalendar,
      icon: Calendar,
      description: 'Visualizar calendário completo',
    },
    {
      label: 'Ir para Tarefas',
      onClick: onGoToTasks,
      icon: CheckSquare,
      description: 'Gerenciar todas as tarefas',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {quickActionItems.map((section, index) => (
            <div key={index} className="space-y-3">
              <div>
                <h3 className="font-medium text-sm text-foreground">{section.title}</h3>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {section.actions.map((action, actionIndex) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={actionIndex}
                      variant={action.variant}
                      size="sm"
                      onClick={action.onClick}
                      className="justify-start h-9"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Navegação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {navigationActions.map((nav, index) => {
            const Icon = nav.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={nav.onClick}
                className="w-full justify-start h-auto p-3 hover:bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{nav.label}</div>
                    <div className="text-xs text-muted-foreground">{nav.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;