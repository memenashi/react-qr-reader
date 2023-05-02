import { MutableRefObject, useEffect, useRef } from 'react';
import { isMediaDevicesSupported, isValidType } from '../lib/utils';
import { UseQrReaderHook } from '../type/type';
import { IScannerControls } from '@zxing/browser/esm/common/IScannerControls';
import { BrowserQRCodeReader } from '@zxing/browser/esm/readers/BrowserQRCodeReader';

// TODO: add support for debug logs
export const useQrReader: UseQrReaderHook = ({
  scanDelay: delayBetweenScanAttempts,
  constraints: video,
  onResult,
  videoId,
}) => {
  const controlsRef: MutableRefObject<IScannerControls | undefined> = useRef();

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts,
    });

    if (
      !isMediaDevicesSupported() &&
      isValidType(onResult, 'onResult', 'function')
    ) {
      const message =
        'MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"';

      onResult?.(null, new Error(message), codeReader);
    }

    codeReader
      .decodeFromConstraints({ video }, videoId, (result, error) => {
        onResult?.(result, error, codeReader);
      })
      .then((controls: IScannerControls) => (controlsRef.current = controls))
      .catch((error: Error) => {
        onResult?.(null, error, codeReader);
      });

    return () => controlsRef.current?.stop();
  }, []);
};
