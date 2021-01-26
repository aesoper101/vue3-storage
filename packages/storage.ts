import {
  CallbackResult,
  ClearStorageOption,
  GetStorageInfoOption,
  GetStorageInfoSuccessCallbackOption,
  GetStorageOption,
  GetStorageSuccessCallbackResult,
  RemoveStorageOption,
  SetStorageOption,
  StorageData,
  StorageInterface
} from "./types";

export class StorageClass implements StorageInterface {
  protected storage: Storage = window.localStorage;
  protected namespace = "pro_";

  constructor(storage: Storage) {
    console.log("storage", storage)
    this.storage = storage;
  }

  config(namespace?: string | undefined): void {
    if (namespace) {
      this.namespace = namespace;
    }
  }

  clearStorage(option?: ClearStorageOption): Promise<CallbackResult> {
    const res: CallbackResult = { errMsg: "clearStorage:ok" };

    if (option) {
      const { success, fail, complete } = option;
      try {
        this.clearStorageSync();
        success && success(res);
        complete && complete(res);
      } catch {
        const res: CallbackResult = { errMsg: "clearStorage:fail" };
        fail && fail(res);
        complete && complete(res);
        return Promise.reject(res);
      }
    }

    return Promise.resolve(res);
  }

  clearStorageSync(): void {
    const removedKeys: string[] = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (!key) {
        continue;
      }

      const regexp = new RegExp(`^${this.namespace}.+`, "i");

      if (!regexp.test(key)) {
        continue;
      }

      removedKeys.push(key);
    }

    for (const key in removedKeys) {
      this.storage.removeItem(removedKeys[key]);
    }
  }

  getStorage<T = any>(
    option: GetStorageOption<T>
  ): Promise<GetStorageSuccessCallbackResult<T>> {
    const { key, success, fail, complete } = option;
    const res: CallbackResult = { errMsg: "getStorage:ok" };

    const successRes: GetStorageSuccessCallbackResult<any> = {
      errMsg: "getStorage:ok",
      data: ""
    };

    const { result, data } = this.getItem(key);
    if (result) {
      const val = data as StorageData;
      successRes.data = val.value;
    } else {
      res.errMsg = "getStorage:fail data not found";
      fail && fail(res);
      complete && complete(res);
      return Promise.reject(res);
    }

    success && success(successRes);
    complete && complete(successRes);

    return Promise.resolve(successRes);
  }

  getStorageInfo(
    option?: GetStorageInfoSuccessCallbackOption
  ): Promise<CallbackResult> {
    const res = { errMsg: "getStorageInfo:ok" };
    if (option) {
      const { success, complete, fail } = option;
      try {
        const info = this.getStorageInfoSync();

        success && success(info);
        complete && complete(res);
      } catch {
        fail && fail(res);
        complete && complete(res);
      }
    }

    return Promise.resolve(res);
  }

  getStorageInfoSync(): GetStorageInfoOption {
    return {
      keys: Object.keys(this.storage),
      limitSize: 0,
      currentSize: 0,
      keysLength: this.storage.length
    } as GetStorageInfoOption;
  }

  hasKey(key: string): boolean {
    const res = this.getItem(key);

    return res.result;
  }

  isExpire(key: string): boolean {
    const res = this.getItem(key);
    if (res.result) {
      const data = res.data as StorageData;
      if (data.expire === null) {
        return false;
      }

      return data.expire < new Date().getTime();
    }
    return false;
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeStorage(option: RemoveStorageOption): Promise<CallbackResult> {
    const { key, success, fail, complete } = option;
    const res = { errMsg: "removeStorage:ok" };

    if (!this.hasKey(key)) {
      res.errMsg = `key ${key} not exists !`;
      fail && fail(res);
      complete && complete(res);
      return Promise.reject(res);
    }

    this.removeStorageSync(key);

    success && success(res);
    complete && complete(res);

    return Promise.resolve(res);
  }

  removeStorageSync(key: string): void {
    return this.storage.removeItem(this.getItemKey(key));
  }

  setStorage(option: SetStorageOption): Promise<CallbackResult> {
    const { key, data, success, fail, complete } = option;
    const res = { errMsg: "setStorage:ok" };

    try {
      this.setStorageSync(key, data);
      if (this.hasKey(key)) {
        success && success(res);
        complete && complete(res);

        return Promise.resolve(res);
      } else {
        res.errMsg = `key ${key} setStorage2:fail`;
        fail && fail(res);
        complete && complete(res);
        return Promise.reject(res);
      }
    } catch (e) {
      res.errMsg = `key ${key} setStorage:fail`;
      fail && fail(res);
      complete && complete(res);
      return Promise.reject(res);
    }
  }

  setStorageSync(key: string, data: any, expire?: number): void {
    const storeData: StorageData = {
      value: data,
      expire: expire ? new Date().getTime() + expire : null
    };
    const stringifyValue = JSON.stringify(storeData);

    this.storage.setItem(this.getItemKey(key), stringifyValue);
  }

  private getItemKey(key: string) {
    return this.namespace + key;
  }

  private getItem(key: string) {
    try {
      let item;
      const data = this.storage.getItem(this.getItemKey(key));
      if (data !== null) {
        item = JSON.parse(data);
      }

      // 只返回使用 setStorage 存储的数据
      if (
        item &&
        typeof item === "object" &&
        "expire" in item &&
        "value" in item
      ) {
        return { result: true, data: item };
      }
    } catch (e) {
      return { result: false };
    }

    return { result: false };
  }

  getStorageSync<T = any>(key: string): T | undefined {
    const res = this.getItem(key);
    if (res.result) {
      const data = res.data as StorageData;
      if (!this.isExpire(key)) {
        return data.value as T;
      }
    }
    return undefined;
  }
}
