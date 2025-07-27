import { requireNativeView } from 'expo';
import * as React from 'react';

import { ScannerModuleViewProps } from './ScannerModule.types';

const NativeView: React.ComponentType<ScannerModuleViewProps> =
  requireNativeView('ScannerModule');

export default function ScannerModuleView(props: ScannerModuleViewProps) {
  return <NativeView {...props} />;
}
