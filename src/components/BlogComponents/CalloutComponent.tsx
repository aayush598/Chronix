import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CalloutComponentProps {
  content: {
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
  };
}

export const CalloutComponent: React.FC<CalloutComponentProps> = ({ content }) => {
  const { type, title, message } = content;

  const config = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900',
      textColor: 'text-orange-800'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-800'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-800'
    }
  };

  const { icon: Icon, bgColor, borderColor, iconColor, titleColor, textColor } = config[type];

  return (
    <div className={`my-6 ${bgColor} ${borderColor} border-l-4 p-4 rounded-r-lg`}>
      <div className="flex items-start space-x-3">
        <Icon className={`${iconColor} mt-0.5 flex-shrink-0`} size={20} />
        <div>
          <h4 className={`font-semibold ${titleColor} mb-1`}>{title}</h4>
          <p className={`${textColor} leading-relaxed`}>{message}</p>
        </div>
      </div>
    </div>
  );
};