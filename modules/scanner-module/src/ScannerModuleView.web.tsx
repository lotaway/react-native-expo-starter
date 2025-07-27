import * as React from 'react';

import { ScannerModuleViewProps } from './ScannerModule.types';

export default function ScannerModuleView(props: ScannerModuleViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
