import React from 'react';

interface Props {
  text: string;
  type?: 'severity' | 'status' | 'state';
}

export const StatusBadge: React.FC<Props> = ({ text, type = 'status' }) => {
  let bgColor = 'bg-gray-800';
  let textColor = 'text-gray-300';
  let borderColor = 'border-gray-700';

  const lowerText = text.toLowerCase();

  if (type === 'severity') {
    if (lowerText === 'critical') { bgColor = 'bg-red-950/50'; textColor = 'text-red-400'; borderColor = 'border-red-900/50'; }
    if (lowerText === 'high') { bgColor = 'bg-orange-950/50'; textColor = 'text-orange-400'; borderColor = 'border-orange-900/50'; }
    if (lowerText === 'medium') { bgColor = 'bg-yellow-950/50'; textColor = 'text-yellow-400'; borderColor = 'border-yellow-900/50'; }
    if (lowerText === 'low') { bgColor = 'bg-green-950/50'; textColor = 'text-green-400'; borderColor = 'border-green-900/50'; }
  } else if (type === 'state') {
    if (lowerText === 'approved') { bgColor = 'bg-green-950/50'; textColor = 'text-green-400'; borderColor = 'border-green-900/50'; }
    if (lowerText === 'rejected') { bgColor = 'bg-red-950/50'; textColor = 'text-red-400'; borderColor = 'border-red-900/50'; }
    if (lowerText === 'hold') { bgColor = 'bg-yellow-950/50'; textColor = 'text-yellow-400'; borderColor = 'border-yellow-900/50'; }
    if (lowerText === 'pending') { bgColor = 'bg-blue-950/50'; textColor = 'text-blue-400'; borderColor = 'border-blue-900/50'; }
  } else {
    // general status
    if (['offline', 'restricted', 'escalated'].includes(lowerText)) { bgColor = 'bg-red-950/50'; textColor = 'text-red-400'; borderColor = 'border-red-900/50'; }
    if (['degraded', 'at risk'].includes(lowerText)) { bgColor = 'bg-orange-950/50'; textColor = 'text-orange-400'; borderColor = 'border-orange-900/50'; }
    if (['operational', 'normal', 'resolved', 'available'].includes(lowerText)) { bgColor = 'bg-green-950/50'; textColor = 'text-green-400'; borderColor = 'border-green-900/50'; }
    if (['assigned', 'en route', 'triaged'].includes(lowerText)) { bgColor = 'bg-blue-950/50'; textColor = 'text-blue-400'; borderColor = 'border-blue-900/50'; }
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${bgColor} ${textColor} ${borderColor}`}>
      {text}
    </span>
  );
};
