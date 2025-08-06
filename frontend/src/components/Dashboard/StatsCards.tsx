import React from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats } from '@/utils/dashboardHelpers';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Hoje',
      items: [
        {
          label: 'Compromissos',
          value: stats.todayAppointments,
          icon: Calendar,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
        },
        {
          label: 'Tarefas Pendentes',
          value: stats.todayPendingTasks,
          icon: Clock,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-950/50',
        },
        {
          label: 'Tarefas Concluídas',
          value: stats.todayCompletedTasks,
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950/50',
        },
      ],
    },
    {
      title: 'Esta Semana',
      items: [
        {
          label: 'Compromissos',
          value: stats.weeklyAppointments,
          icon: Calendar,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
        },
        {
          label: 'Taxa de Conclusão',
          value: `${stats.weeklyTaskCompletionRate}%`,
          icon: TrendingUp,
          color: stats.weeklyTaskCompletionRate >= 70 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400',
          bgColor: stats.weeklyTaskCompletionRate >= 70 ? 'bg-green-50 dark:bg-green-950/50' : 'bg-yellow-50 dark:bg-yellow-950/50',
        },
        {
          label: 'Tarefas Atrasadas',
          value: stats.overdueTasks,
          icon: AlertTriangle,
          color: stats.overdueTasks > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
          bgColor: stats.overdueTasks > 0 ? 'bg-red-50 dark:bg-red-950/50' : 'bg-green-50 dark:bg-green-950/50',
        },
      ],
    },
    {
      title: 'Resumo Geral',
      items: [
        {
          label: 'Compromissos do Mês',
          value: stats.monthlyAppointments,
          icon: Calendar,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/50',
        },
        {
          label: 'Tarefas Alta Prioridade',
          value: stats.highPriorityTasks,
          icon: AlertTriangle,
          color: stats.highPriorityTasks > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
          bgColor: stats.highPriorityTasks > 0 ? 'bg-red-50 dark:bg-red-950/50' : 'bg-green-50 dark:bg-green-950/50',
        },
        {
          label: 'Tarefas Ativas',
          value: stats.totalPendingTasks + stats.totalInProgressTasks,
          icon: Clock,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-950/50',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {statItems.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="text-lg font-semibold mb-3 text-foreground">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <Card key={itemIndex} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground truncate">
                          {item.label}
                        </p>
                        <p className={`text-2xl font-bold ${item.color}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;