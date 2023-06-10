import { MutableRefObject, useEffect, useRef } from 'react';
import { isMediaDevicesSupported, isValidType } from '../lib/utils';
import { UseQrReaderHook } from '../type/type';
import { Result } from '@zxing/library';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

let codeReader: BrowserQRCodeReader | undefined = undefined;

// TODO: add support for debug logs
export const useQrReader: UseQrReaderHook = ({
  scanDelay: delayBetweenScanAttempts,
  constraints: video,
  onResult,
  videoId,
}) => {
  const controlsRef: MutableRefObject<IScannerControls | undefined> = useRef();

  useEffect(() => {
    if (!codeReader) {
      codeReader = new BrowserQRCodeReader(undefined, {
        delayBetweenScanAttempts,
      });
    }

    if (
      !isMediaDevicesSupported() &&
      isValidType(onResult, 'onResult', 'function')
    ) {
      const message =
        'MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"';

      onResult?.(null, new Error(message), codeReader);
    }

    codeReader
      .decodeFromConstraints({ video }, videoId, (result: Result | null | undefined, error: Error | null | undefined) => {
        onResult?.(result, error, codeReader);
      })
      .then((controls: IScannerControls) => (controlsRef.current = controls))
      .catch((error: Error) => {
        onResult?.(null, error, codeReader);
      });

    return () => controlsRef.current?.stop();
  }, []);
};
