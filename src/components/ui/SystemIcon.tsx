import React from 'react';
import {
  Monitor, Database, ShoppingCart, Truck, BarChart2, Users,
  Settings, Globe, Box, Layers
} from 'lucide-react';
import type { SystemIcon as IconType } from '../../types';

interface SystemIconProps {
  icon: IconType;
  size?: number;
  className?: string;
}

export const SystemIconComponent: React.FC<SystemIconProps> = ({ icon, size = 20, className }) => {
  const props = { size, className };
  switch (icon) {
    case 'monitor':       return <Monitor {...props} />;
    case 'database':      return <Database {...props} />;
    case 'shopping-cart': return <ShoppingCart {...props} />;
    case 'truck':         return <Truck {...props} />;
    case 'bar-chart':     return <BarChart2 {...props} />;
    case 'users':         return <Users {...props} />;
    case 'settings':      return <Settings {...props} />;
    case 'globe':         return <Globe {...props} />;
    case 'box':           return <Box {...props} />;
    case 'layers':        return <Layers {...props} />;
    default:              return <Box {...props} />;
  }
};
