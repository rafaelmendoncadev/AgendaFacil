import React from 'react';
import { CheckSquare, Clock, AlertTriangle, Play, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/types';
import { DashboardStats, getTaskStatusColor, getTaskPriorityColor } from '@/utils/dashboardHelpers';

interface TaskSummaryProps {
  tasks: Task[];
  stats: DashboardStats;
  onNewTask: () => void;
  onEditTask: (task: Task) => void;
  onGoToTasks: () => void;
}

const TaskSummary: React.FC<TaskSummaryProps> = ({
  tasks,
  stats,
  onNewTask,
  onEditTask,
  onGoToTasks,
}) => {
  const totalTasks = stats.totalPendingTasks + stats.totalInProgressTasks + stats.totalCompletedTasks;
  const completionRate = totalTasks > 0 ? (stats.totalCompletedTasks / totalTasks) * 100 : 0;
  
  const recentTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => {
      // Sort by priority first (high -> medium -> low), then by updated date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    .slice(0, 4);

  const statusItems = [
    {
      label: 'Pendentes',
      value: stats.totalPendingTasks,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
      label: 'Em Andamento',
      value: stats.totalInProgressTasks,
      icon: Play,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      label: 'Concluídas',
      value: stats.totalCompletedTasks,
      icon: CheckSquare,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'in_progress': return Play;
      case 'completed': return CheckSquare;
      default: return Clock;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em andamento';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      default: return priority;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Resumo de Tarefas
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onGoToTasks}
            className="text-xs"
          >
            Ver Todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Task Statistics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Taxa de Conclusão</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(completionRate)}% ({stats.totalCompletedTasks}/{totalTasks})
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          {statusItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={`p-3 rounded-lg ${item.bgColor}`}>
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className={`text-lg font-bold ${item.color}`}>
                    {item.value}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            );
          })}
        </div>

        {/* Overdue/High Priority Alert */}
        {(stats.overdueTasks > 0 || stats.highPriorityTasks > 0) && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                Atenção Necessária
              </span>
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 space-y-1">
              {stats.overdueTasks > 0 && (
                <p>{stats.overdueTasks} tarefa{stats.overdueTasks > 1 ? 's' : ''} atrasada{stats.overdueTasks > 1 ? 's' : ''}</p>
              )}
              {stats.highPriorityTasks > 0 && (
                <p>{stats.highPriorityTasks} tarefa{stats.highPriorityTasks > 1 ? 's' : ''} de alta prioridade</p>
              )}
            </div>
          </div>
        )}

        {/* Recent Active Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Tarefas Ativas</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewTask}
              className="h-6 px-2"
            >
              <Plus className="h-3 w-3 mr-1" />
              Nova
            </Button>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <CheckSquare className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma tarefa ativa</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onNewTask}
                className="mt-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                Criar Tarefa
              </Button>
            </div>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {recentTasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status);
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 rounded border cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onEditTask(task)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <StatusIcon className={`h-3 w-3 ${getTaskStatusColor(task.status)}`} />
                        <span className="text-sm font-medium truncate">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-muted/50 ${getTaskPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-muted/50 ${getTaskStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummary;