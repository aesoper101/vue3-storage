export enum StorageType {
  Session = "session",
  Local = "local",
  WebSQL = "webSQL",
  IndexDB = "indexDB"
}

export interface StorageConfig {
  namespace?: string | false;
  storage?: StorageType;
}

export interface StorageData {
  value: any;
  expire: number | null;
}

/** 通用错误 */
export interface CallbackResult {
  /** 错误信息 */
  errMsg: string;
}

export interface GetStorageOption<T> {
  /** 本地缓存中指定的 key */
  key: string;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: CallbackResult) => void;
  /** 接口调用失败的回调函数 */
  fail?: (res: CallbackResult) => void;
  /** 接口调用成功的回调函数 */
  success?: (result: GetStorageSuccessCallbackResult<T>) => void;
}

export interface GetStorageSuccessCallbackResult<T> extends CallbackResult {
  /** key对应的内容 */
  data: T;
  /** 调用结果 */
  errMsg: string;
}

export interface SetStorageOption {
  /** 需要存储的内容。只支持原生类型、Date、及能够通过`JSON.stringify`序列化的对象。 */
  data: any;
  /** 本地缓存中指定的 key */
  key: string;
  /** 失效时间 */
  expire?: number;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: CallbackResult) => void;
  /** 接口调用失败的回调函数 */
  fail?: (res: CallbackResult) => void;
  /** 接口调用成功的回调函数 */
  success?: (res: CallbackResult) => void;
}

export interface RemoveStorageOption {
  /** 本地缓存中指定的 key */
  key: string;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: CallbackResult) => void;
  /** 接口调用失败的回调函数 */
  fail?: (res: CallbackResult) => void;
  /** 接口调用成功的回调函数 */
  success?: (res: CallbackResult) => void;
}

export interface ClearStorageOption {
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: CallbackResult) => void;
  /** 接口调用失败的回调函数 */
  fail?: (res: CallbackResult) => void;
  /** 接口调用成功的回调函数 */
  success?: (res: CallbackResult) => void;
}

export interface GetStorageInfoOption {
  /** 当前占用的空间大小, 单位 KB */
  currentSize: number;
  /** 当前 storage 中所有的 key */
  keys: string[];
  /** 限制的空间大小，单位 KB */
  limitSize: number;
  /** keys的长度 */
  keysLength: number;
}

export interface GetStorageInfoSuccessCallbackOption {
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: CallbackResult) => void;
  /** 接口调用失败的回调函数 */
  fail?: (res: CallbackResult) => void;
  /** 接口调用成功的回调函数 */
  success?: (option: GetStorageInfoOption) => void;
}

export interface StorageInterface {
  /**
   * 异步本地缓存中指定的 key
   * @param option
   */
  getStorage<T = any>(
    option: GetStorageOption<T>
  ): Promise<GetStorageSuccessCallbackResult<T>>;

  /**
   *
   * @param key 本地缓存中指定的 key
   *
   */
  getStorageSync<T = any>(key: string): T | undefined;

  /**
   * 同步获取相应key的存储存储内容
   *
   * @param key 本地缓存中指定的 key
   * @param data 需要存储的内容。只支持原生类型、Date、及能够通过`JSON.stringify`序列化的对象。
   * @param expire 失效时间
   */
  setStorageSync(key: string, data: any, expire?: number): void;

  /**
   * 异步获取相应key的存储存储内容
   *
   * @param option
   */
  setStorage(option: SetStorageOption): Promise<CallbackResult>;

  /**
   * 判断是否已过期
   * @param key
   */
  isExpire(key: string): boolean;

  /**
   * 相应获取的键名索引
   * @param index
   */
  key(index: number): string | null;

  /**
   * 判断键名是否存在
   *
   * @param key
   */
  hasKey(key: string): boolean;

  /**
   * 本地缓存中异步移除指定 key
   *
   * @param option
   */
  removeStorage(option: RemoveStorageOption): Promise<CallbackResult>;

  /**
   * 从本地缓存中同步移除指定 key
   *
   * @param name
   */
  removeStorageSync(name: string): void;

  /**
   * 异步获取当前storage的相关信
   *
   * @param option
   */
  getStorageInfo(
    option?: GetStorageInfoSuccessCallbackOption
  ): Promise<CallbackResult>;

  /** 同步获取当前storage的相关信 */
  getStorageInfoSync(): GetStorageInfoOption;

  /**
   * 异步清理本地数据缓存
   * @param option
   */
  clearStorage(option?: ClearStorageOption): Promise<CallbackResult>;

  /**
   * 同步清理本地数据缓存
   */
  clearStorageSync(): void;

  /**
   * 设置存储前缀
   * @param namespace
   */
  config(namespace?: string): void;
}

declare module "@vue/runtime-core" {
  // import { StorageInterface } from "./types";

  interface ComponentCustomProperties {
    $storage: StorageInterface;
  }
}
