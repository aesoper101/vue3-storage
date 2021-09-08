import { App } from "vue";

import { StorageClass } from "./storage";
import { StorageInterface, StorageConfig, StorageType } from "./types";

let webStorage: StorageClass = new StorageClass();

const Vue3Storage = {
  install: (app: App, options: StorageConfig) => {
    const _options: StorageConfig = {
      storage: options?.storage || StorageType.Local,
      namespace: options?.namespace || "pro_"
    };

    if (typeof window === "undefined") {
      throw new Error(
        `Vue3Storage: Storage "${_options.storage}" is not supported`
      );
    }

    let storage: Storage;
    switch (
            _options.storage // eslint-disable-line
    ) {
      case StorageType.Local:
        storage = window.localStorage;
        break;

      case StorageType.Session:
        storage = window.sessionStorage;
        break;

      default:
        // storage = window.localStorage;
        throw new Error(
          `Vue3Storage: Storage "${_options.storage}" is not supported yet`
        );
    }

    webStorage = new StorageClass(storage);
    webStorage.config(_options.namespace);

    app.config.globalProperties.$storage = webStorage;
  }
};

export const useStorage = (): StorageInterface => {
  return webStorage;
};

export default Vue3Storage;
