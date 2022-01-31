import React from 'react';
import { useDynamicScript, DynamicScriptOptions, defaultDynamicScriptOptions } from './useDynamicScript';

const resolveModule = async <T extends {}>(scope: string, module: string) => new Promise<T>(
  (moduleResolve) => {
    new Promise((containerResolve) => {
      containerResolve(window[scope].init({}));
    }).then(() => {
      window[scope].get(module).then((factory: any) => {
        moduleResolve(factory());
      });
    });
  },
);

const transferModule = async <T extends {}>(scope: string, module: string) => {
  const resolvedObject = await resolveModule<T>(scope, module);
  return resolvedObject;
};

export interface UseFederatedModuleOptions {
  dynamicScriptOptions?: DynamicScriptOptions;
  errorCallback?: ((e: any) => void) | ((e: any) => any) | null | undefined;
}

const defaultFederatedModuleOptions: UseFederatedModuleOptions = {
  dynamicScriptOptions: defaultDynamicScriptOptions,
  errorCallback: null,
};

export const useFederatedModule = <T extends {} = {}>(
  url: string,
  scope: string,
  module: string,
  options: UseFederatedModuleOptions = defaultFederatedModuleOptions,
) => {
  const appendingDynamicScriptError = `issue appending script with a url of ${url}`;
  const { ready, failed } = useDynamicScript(url, options.dynamicScriptOptions);
  const [error, setError] = React.useState(false);
  const [target, setTarget] = React.useState<T | any | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const errFunc = options.errorCallback
    ? options!.errorCallback
    : (e: any) => console.error(JSON.stringify(e));

  React.useEffect(() => {
    if (failed) {
      errFunc(appendingDynamicScriptError);
      setError(true);
      setIsLoading(false);
    }

    if (!ready && !failed) {
      setIsLoading(true);
    }

    if (ready) {
      (async () => {
        const loadedModule = await transferModule<T>(scope, module);
        setTarget(loadedModule);
        setIsLoading(false);
      })();
    }
  }, [ready, failed]);

  return {
    scriptReady: ready,
    scriptFailed: failed,
    error,
    isLoading,
    data: target,
  };
};
