# vue3-storage

## Getting Started

### Installation

```sh
# install with yarn
yarn add vue3-storage

# install with npm
npm install vue3-storage
```

### Vue version support
The main version Supports Vue 3.x only


## Usage

### The First Step
Register 
```js
import Vue3Storage from "vue3-storage";

const app = createApp(App);
app.use(Vue3Storage)
```

### Teh Second step
use Global ComponentCustomProperties ```this.$storage```

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {}
})
export default class Home extends Vue {
  created() {
    this.$storage.setStorageSync("test-key", "testdata");
  }
}
</script>

```

You can still use it like this:
````vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStorage } from "vue3-storage";

export default defineComponent({
  setup() {
    const storage = useStorage();

    storage?.setStorageSync("test-key", "testdata22");
    return {};
  }
});
</script>
````

You can still use it like this:
```vue
<script lang="ts">
import { defineComponent } from "vue";
import { useStorage } from "vue3-storage";
import { CallbackResult } from "vue3-storage/dist/lib/types";

export default defineComponent({
  setup() {
    const storage = useStorage();

    storage?.setStorage({
      key: "test-key",
      data: "testdata22",
      success: (callback: CallbackResult) => {
        console.log(callback.errMsg);
      }
    });
    return {};
  }
});
</script>
```

Use promise
```js
<script lang="ts">
import { defineComponent } from "vue";
import { useStorage } from "vue3-storage";
import { CallbackResult } from "vue3-storage/dist/lib/types";

export default defineComponent({
  setup() {
    const storage = useStorage();

    storage
      ?.setStorage({
        key: "test-key",
        data: "testdata22"
      })
      .then((successCallback: CallbackResult) => {
        console.log(successCallback.errMsg);
      })
      .catch((failCallback: CallbackResult) => {
        console.log(failCallback.errMsg);
      });
    return {};
  }
});
</script>

```

## Storage API

```ts
export interface StorageInterface {
    /**
     * Asynchronous storage
     * @param option
     */
    getStorage<T = any>(option: GetStorageOption<T>): Promise<GetStorageSuccessCallbackResult<T>>;
    
    /**
     * Synchronous storage
     * 
     * @param key 
     *
     */
    getStorageSync<T = any>(key: string): T | undefined;
    
    /**
     * Synchronously obtain the storage content of the corresponding key
     *
     * @param key
     * @param data 
     * @param expire
     */
    setStorageSync(key: string, data: any, expire?: number): void;
    
    /**
     * Asynchronously obtain the storage content of the corresponding key
     *
     * @param option
     */
    setStorage(option: SetStorageOption): Promise<CallbackResult>;
    
    /**
     * Determine whether the data has expired
     * @param key
     */
    isExpire(key: string): boolean;
    
    /**
     * Correspondingly obtained key name index
     * @param index
     */
    key(index: number): string | null;
    
    /**
     * Determine whether the key name exists
     *
     * @param key
     */
    hasKey(key: string): boolean;
    
    /**
     * Asynchronously remove the specified key from the local cache
     *
     * @param option
     */
    removeStorage(option: RemoveStorageOption): Promise<CallbackResult>;
    
    /**
     * Synchronously remove the specified key from the local cache
     *
     * @param name
     */
    removeStorageSync(name: string): void;
    
    /**
     * Get current storage information asynchronously
     *
     * @param option
     */
    getStorageInfo(option?: GetStorageInfoSuccessCallbackOption): Promise<CallbackResult>;
    
    /** Get current storage information synchronously */
    getStorageInfoSync(): GetStorageInfoOption;
    
    /**
     * Clean up local data cache asynchronously
     * @param option
     */
    clearStorage(option?: ClearStorageOption): Promise<CallbackResult>;
    
    /**
     * Synchronously clean the local data cache
     */
    clearStorageSync(): void;
   
    /**
     * Set storage namespace
     * @param namespace
     */
    config(namespace?: string): void;
}
```

## ⚖️ License

MIT
