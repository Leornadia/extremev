import { ReactNode } from 'react';

export default function ConfiguratorLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="h-screen overflow-hidden">{children}</div>;
}
