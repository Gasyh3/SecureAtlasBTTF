import { CheckCircle, XCircle } from 'lucide-react';

interface StatusIndicatorProps {
  isHealthy: boolean;
  status?: string;
}

const StatusIndicator = ({ isHealthy, status }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center space-x-2">
      {isHealthy ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500" />
      )}
      <span className={`status-indicator ${isHealthy ? 'status-success' : 'status-error'}`}>
        {isHealthy ? `✅ ${status || 'OK'}` : '❌ Indisponible'}
      </span>
    </div>
  );
};

export default StatusIndicator; 