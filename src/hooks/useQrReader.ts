import { RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { Result } from '@zxing/library';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

import { delay, isMediaDevicesSupported, isValidType } from '../lib/utils';

type DecodeResult = Result | null | undefined;

interface UseQrReaderHookProps {
  /**
   * Media constraints object, to specify which camera and capabilities to use
   */
  constraints?: MediaTrackConstraints;
  /**
   * Callback for retrieving the result
   */
  onResult: OnResultFunction;
  /**
   * Callback for retrieving the error
   */
  onError?: OnErrorFunction;
  /**
   * Property that represents the scan period
   */
  scanDelay?: number;
  /**
   * Property that represents the ID of the video element
   */
  videoId?: string;
}

interface UseQrReaderReturn {
  videoRef: RefObject<HTMLVideoElement> | undefined;
}

type UseQrReaderHook = (props: UseQrReaderHookProps) => UseQrReaderReturn;

export type OnResultFunction = (
  result: DecodeResult,
  control?: IScannerControls
) => Promise<void>;
export type OnErrorFunction = (
  error: unknown,
  control?: IScannerControls
) => void;

let qrReader: BrowserQRCodeReader | undefined;

export const useQrReader: UseQrReaderHook = ({
  scanDelay = 200,
  onResult,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const control = useRef<IScannerControls | null>();
  const previousScan = useRef<Result | null>();

  const reader = useMemo(() => {
    if (!qrReader) {
      qrReader = new BrowserQRCodeReader(undefined, {
        delayBetweenScanAttempts: scanDelay,
      });
    }
    return qrReader;
  }, [scanDelay]);

  const startScanner = useCallback(async () => {
    if (videoRef.current == null) return;
    const deviceList = await BrowserQRCodeReader.listVideoInputDevices();
    const deviceId = deviceList?.[1].deviceId;
    try {
      delay(scanDelay);
      control.current = await reader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        async (result) => {
          if (
            result?.getText() &&
            result?.getText() !== previousScan.current?.getText()
          ) {
            previousScan.current = result;
            await onResult?.(result);
          }
        }
      );
    } catch (e) {
      onError?.(e);
    }
  }, [scanDelay, onError, onResult, reader]);

  useEffect(() => {
    if (
      !isMediaDevicesSupported() &&
      isValidType(onResult, 'onResult', 'function')
    ) {
      const message =
        'MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"';

      onError?.(new Error(message));
    }
    startScanner();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      videoRef.current?.pause();
      control.current?.stop();
    };
  }, [scanDelay, onError, onResult, startScanner]);

  return {
    videoRef,
  };
};
