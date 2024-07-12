<template>
  <div>
    <div class="temp-test-box">
      <p @click="clickEvt" style="height: 1300px">临时文件，用于自测Demo</p>
    </div>
    <el-backtop target=".temp-test-box"></el-backtop>
  </div>
</template>

<script>
/**
 * http://localhost/temp
 */
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      formData: {},
    };
  },
  methods: {
    clickEvt() {},
    // ...mapActions(["dictionary/getDictionary"]),
  },
  created() {
    // this["dictionary/getDictionary"]("predictionManage");
  },
  components: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.temp-test-box {
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>
