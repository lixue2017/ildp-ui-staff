<template>
  <div class="top-from">
    <Card :config="cardConfig(formData.type)" :formData="formData" />
    <ComForm
      ref="formRef"
      :formConfig="{
        ...formConfig,
        formModel: formData,
      }"
    >
      <template v-slot:attachList>
        <div class="demo-image__preview" v-if="urlList.length">
          <div class="img-item" v-for="url in urlList" :key="url">
            <el-image class="img-preview" :src="url" :lazy="true">
              <div slot="error" class="image-slot">
                <img :src="loadError" />
              </div>
            </el-image>
            <el-image class="img-top" :src="url" :preview-src-list="urlList" />
          </div>
        </div>
        <span v-else>--</span>
      </template>
    </ComForm>
  </div>
</template>

<script>
import { cardConfig, formConfig } from "./model";
import loadError from "@/assets/image/load-error.svg";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Card: () => import("@/views/enquiryManage/components/Card"),
    ComForm: () => import("_comp/ComForm"),
  },
  data() {
    return {
      loadError,
      cardConfig,
      formConfig: {
        labelWidth: "98px",
        ...formConfig,
      },
      urlList: [],
    };
  },
  watch: {
    "formData.attachList"(attachList = []) {
      this.urlList = attachList.map((item) => item.filePath);
    },
  },
  created() {
    const { attachList } = this.formData;
    this.urlList = (attachList || []).map((item) => item.filePath);
  },
};
</script>

<style lang="scss" scoped>
.top-from {
  padding-bottom: 5px;
  // border-bottom: 1px solid #e2e2e2;
}
/deep/ {
  .el-form-item {
    margin-bottom: 5px;
  }
}
.demo-image__preview {
  display: flex;
  .img-item {
    position: relative;
    width: 50px;
    height: 50px;
    margin-right: 10px;
    cursor: pointer;
    &:hover {
      .img-preview::after {
        display: block;
      }
    }
    .img-preview {
      width: 50px;
      height: 50px;
      &::after {
        content: "查看";
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 4px;
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
      }
      /deep/ {
        .el-image__inner {
          border-radius: 4px;
          border: 1px solid #d2d2d2;
        }
      }
    }
    .img-top {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1009;
      /deep/ {
        .el-image__error {
          opacity: 0;
        }
        .el-image__preview {
          opacity: 0;
        }
      }
    }
  }
}
</style>
