import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Result } from '@zxing/library';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

import { delay, isMediaDevicesSupported, isValidType } from '../lib/utils';

type DecodeResult = Result | null | undefined;

interface UseQrReaderHookProps {
  defaultDeviceId?: 0 | 1;
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
  defaultDeviceId = 0,
  scanDelay = 200,
  onResult,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const control = useRef<IScannerControls | null>();
  const previousScan = useRef<Result | null>();
  const [deviceIdIndex, setDeviceIdIndex] = useState<0 | 1>(defaultDeviceId);

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
    const deviceId = await gerDeviceId(deviceIdIndex);
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
  }, [deviceIdIndex, scanDelay, reader, onResult, onError]);

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

  const changeDevice = useCallback(() => {
    setDeviceIdIndex((prev) => (prev === 0 ? 1 : 0));
  }, []);

  return {
    videoRef,
    changeDevice,
  };
};
async function gerDeviceId(value: 0 | 1) {
  const deviceList = await BrowserQRCodeReader.listVideoInputDevices();
  const device = deviceList?.[value];
  if (device) {
    return device.deviceId;
  }
  throw new Error('No device found');
}
