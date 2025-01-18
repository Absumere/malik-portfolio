import { ReactNode } from 'react';
import { MobileDebug } from '../debug/MobileDebug';

interface MobileOptimizedLayoutProps {
  children: ReactNode;
  className?: string;
}

export const MobileOptimizedLayout = ({
  children,
  className = '',
}: MobileOptimizedLayoutProps) => {
  return (
    <div className={`min-h-screen w-full ${className}`}>
      {children}
      <MobileDebug />
    </div>
  );
};

// Higher-order component for mobile optimization
export const withMobileOptimization = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithMobileOptimization(props: P) {
    return (
      <MobileOptimizedLayout>
        <WrappedComponent {...props} />
      </MobileOptimizedLayout>
    );
  };
};
