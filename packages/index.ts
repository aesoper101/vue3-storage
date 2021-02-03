import { App, ref } from "vue";

import { StorageClass } from "./storage";
import { StorageInterface, StorageConfig, StorageType } from "./types";

const webStorage = ref<StorageClass | null>(null);

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

    webStorage.value = new StorageClass(storage);
    webStorage.value.config(_options.namespace);

    app.config.globalProperties.$storage = webStorage.value;
  }
};

export const useStorage = (): StorageInterface | null => {
  return webStorage.value;
};

export default Vue3Storage;
