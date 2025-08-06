import React from 'react';
import { Edit, Trash2, Calendar, Clock, AlertCircle, CheckCircle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void> | void;
  onStatusChange: (id: string, status: Task['status']) => Promise<void> | void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'border-l-red-500 bg-red-50 dark:bg-red-950/20',
          badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: AlertCircle,
          text: 'Alta'
        };
      case 'medium':
        return {
          color: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
          badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: Clock,
          text: 'Média'
        };
      case 'low':
        return {
          color: 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
          badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: Clock,
          text: 'Baixa'
        };
      default:
        return {
          color: 'border-l-gray-500',
          badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: Clock,
          text: 'Média'
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: CheckCircle,
          text: 'Concluída'
        };
      case 'in_progress':
        return {
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          icon: PlayCircle,
          text: 'Em Andamento'
        };
      case 'pending':
        return {
          badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: Clock,
          text: 'Pendente'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          icon: Clock,
          text: 'Pendente'
        };
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < today && task.status !== 'completed';
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const PriorityIcon = priorityConfig.icon;
  const StatusIcon = statusConfig.icon;
  const overdue = isOverdue(task.due_date);

  return (
    <Card className={cn(
      "border-l-4 transition-all hover:shadow-md",
      priorityConfig.color,
      task.status === 'completed' && "opacity-75"
    )}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-lg font-semibold truncate",
              task.status === 'completed' && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => await onDelete(task.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            priorityConfig.badge
          )}>
            <PriorityIcon size={12} className="mr-1" />
            {priorityConfig.text}
          </span>
          
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            statusConfig.badge
          )}>
            <StatusIcon size={12} className="mr-1" />
            {statusConfig.text}
          </span>

          {task.due_date && (
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              overdue
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            )}>
              <Calendar size={12} className="mr-1" />
              {formatDate(task.due_date)}
              {overdue && " (Atrasada)"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {task.status !== 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => await onStatusChange(task.id, 'pending')}
                className="text-xs"
              >
                Pendente
              </Button>
            )}
            {task.status !== 'in_progress' && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => await onStatusChange(task.id, 'in_progress')}
                className="text-xs"
              >
                Em Andamento
              </Button>
            )}
            {task.status !== 'completed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => await onStatusChange(task.id, 'completed')}
                className="text-xs"
              >
                Concluir
              </Button>
            )}
          </div>

          <span className="text-xs text-muted-foreground">
            Criada em {formatDate(task.created_at)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;