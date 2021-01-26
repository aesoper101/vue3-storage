<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import { useStorage } from "../../packages";
import { useStorage } from "../../dist/vue3-storage.esm.js";

@Options({
  components: {}
})
export default class Home extends Vue {
  created() {
    const testdata = { a: 11, b: 221 };

    const storage = useStorage();
    // storage?.setStorageSync("test", testdata);
    //
    storage?.setStorage({
      key: "ss",
      data: testdata,
      success: () => {
        console.log("========");
      }
    });

    // const val = storage?.getStorageSync("test");
    // console.log("val", val);

    storage
      ?.getStorage({
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
  }
}
</script>
