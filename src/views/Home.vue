<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { useStorage } from "vue3-storage";

@Options({
  components: {}
})
export default class Home extends Vue {
  created() {
    const testdata = { a: 11, b: 221 };

    const storage = useStorage();

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
  }
}
</script>
