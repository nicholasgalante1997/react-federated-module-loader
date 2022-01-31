import React from 'react';

export interface DynamicScriptOptions {
    errorCallback?: ((e: any) => void) | null;
    consoleErrorOff?: boolean;
}

export const defaultDynamicScriptOptions = {
  consoleErrorOff: false,
  errorCallback: null,
};

export const useDynamicScript = (
  url: string,
  options: DynamicScriptOptions = defaultDynamicScriptOptions,
) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const { consoleErrorOff, errorCallback } = options;

  const defaultErrorHandling = () => {
    const logError = consoleErrorOff ? null : () => console.error(`Dynamic Script Error: ${url}`);
    if (logError) logError();
    setReady(false);
    setFailed(true);
  };

  const adjustedErrorCallback = (e: any) => {
    if (errorCallback) errorCallback(e);
    setReady(false);
    setFailed(true);
  };

  React.useEffect(() => {
    if (!url) {
      return;
    }

    const element = document.createElement('script');
    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      setReady(true);
    };

    element.onerror = errorCallback ? adjustedErrorCallback : defaultErrorHandling;

    document.head.appendChild(element);

    return () => {
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    ready,
    failed,
  };
};
