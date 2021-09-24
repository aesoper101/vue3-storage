<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button @click="deleteData">Delete</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStorage } from "vue3-storage";

export default defineComponent({
  setup() {
    const testdata = { a: 11, b: 221 };

    const storage = useStorage("test_");

    storage.setStorage({
      key: "szs",
      data: testdata,
      success: () => {
        console.log("========");
      }
    });

    storage
      .getStorage({
        key: "test1",
        success: result => {
          console.log("result.data ", result.data);
        },
        fail: res => {
          console.log("------", res);
        }
      })
      .catch(reason => {
        console.log("reason------", reason);
      });

    const deleteData = () => {
      storage.removeStorageSync("szs");
    };

    return { deleteData };
  }
});
</script>
