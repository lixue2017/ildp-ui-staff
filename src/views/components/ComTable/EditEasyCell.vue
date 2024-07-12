<template>
  <div>
    <template>
      <el-input
        v-if="fieldItem.type === 'text'"
        type="text"
        :size="fieldItem.size || 'mini'"
        v-model="formModel[fieldItem.id]"
        :placeholder="fieldItem.placeholder"
        :maxlength="fieldItem.maxlength || 50"
        @change="
          (val) => {
            formModel[fieldItem.id] = val.trim();
          }
        "
      />
      <el-input
        v-if="fieldItem.type === 'textarea'"
        type="textarea"
        :size="fieldItem.size || 'mini'"
        v-model="formModel[fieldItem.id]"
        :placeholder="fieldItem.placeholder"
        :maxlength="fieldItem.maxlength || 200"
        :autosize="
          fieldItem.autosize || {
            minRows: fieldItem.minRows || 2,
            maxRows: fieldItem.maxRows || 5,
          }
        "
        show-word-limit
        :resize="fieldItem.resize || 'none'"
        @change="
          (val) => {
            formModel[fieldItem.id] = val.trim();
            fieldItem.onAreaChange && fieldItem.onAreaChange(formModel);
          }
        "
      />
      <el-input-number
        v-if="fieldItem.type == 'inputNumber'"
        :size="fieldItem.size || 'mini'"
        v-model="formModel[fieldItem.id]"
        v-input-number-limit="{
          value: fieldItem.decimal || 0, // 几位小数限制
          maxNumber: fieldItem.max, // 最大值限制 - 动态取值不生效（联动数据maxNumKey，输入的小值限制后，无法实时改变最大值），使用:max限制
        }"
        :max="
          fieldItem.maxNumKey
            ? minMaxNumber(formModel[fieldItem.maxNumKey], 'max')
            : fieldItem.max
        "
        :min="
          fieldItem.minNumKey
            ? minMaxNumber(formModel[fieldItem.minNumKey])
            : fieldItem.minGreaterZero
            ? minLimitNumber(fieldItem.decimal || 0)
            : fieldItem.min || 0
        "
        :precision="fieldItem.precision"
        :controls="fieldItem.controls || false"
        :controls-position="fieldItem.postition || 'right'"
        :placeholder="fieldItem.placeholder"
        :disabled="disableInput()"
        @change="(val) => changeNumber(val, fieldItem)"
      />
      <template v-if="fieldItem.type == 'select'">
        <el-select
          :multiple="fieldItem.multiple || false"
          :collapse-tags="fieldItem.collapseTags || false"
          v-model="formModel[fieldItem.id]"
          :placeholder="
            overseaLangObj.yu_yan_lang === 'en-us'
              ? 'Select'
              : fieldItem.placeholder
          "
          :disabled="fieldItem.disabled"
          style="width: 100%"
          size="mini"
          :clearable="fieldItem.clearable !== false"
          @change="
            (val) => {
              fieldItem.onSelectChange && fieldItem.onSelectChange(formModel);
            }
          "
        >
          <el-option
            v-for="selectItem in dictTypeList()"
            :key="selectItem.value"
            :label="selectItem.nameCn"
            :value="
              fieldItem.isShowNumber // 是否转为Number类型
                ? Number(selectItem.value)
                : selectItem.value
            "
          />
        </el-select>
      </template>
      <template v-if="fieldItem.type === 'autocomplete'">
        <AutoComplete
          :formModel="formModel"
          :fieldItem="{
            size: 'mini',
            noClearable: !!fieldItem.required,
            ...fieldItem,
            handle: (val, rItem) => {
              fieldItem.handle && fieldItem.handle(val, formModel, rItem);
            },
          }"
          :additionalParam="selectParamsFn()"
        />
      </template>
      <template v-if="fieldItem.type === 'attachList'">
        <!-- 图片 -->
        <div
          class="custom-preview-image"
          v-if="
            formModel[fieldItem.editUploadKey] ||
            (formModel[fieldItem.id] && formModel[fieldItem.id].length)
          "
        >
          <template v-for="(imgItem, imgIndex) in formModel[fieldItem.id]">
            <div :key="imgIndex" class="attach-img">
              <i
                v-if="formModel[fieldItem.editUploadKey]"
                class="el-icon-error"
                @click="() => handleCloseImg(imgIndex)"
              ></i>
              <el-image
                lazy
                :src="imgItem.filePath"
                :preview-src-list="[imgItem.filePath]"
              >
                <div slot="error" class="img-err-slot">
                  <PreviewOrDownload
                    :btnConf="{ btnSlot: true }"
                    :previewDownloadConf="getPreviewConfig(imgItem)"
                  >
                    <img
                      class="default-img"
                      src="@/assets/image/product_default.svg"
                    />
                  </PreviewOrDownload>
                  <!-- <div class="img-name">{{ imgItem.name }}</div> -->
                </div>
              </el-image>
            </div>
          </template>
          <div
            class="base-flex-center row-upload-icon"
            v-if="
              formModel[fieldItem.editUploadKey] &&
              (formModel[fieldItem.id] || []).length < (fieldItem.maxLimit || 5)
            "
            @click="
              () => {
                $emit('onRowUpload');
              }
            "
          >
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <template v-else>--</template>
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { isNumberStr } from "@/utils/index";
import { customMessageBox } from "@/utils/confirmBox.js";
export default {
  props: {
    formModel: {
      type: Object,
      default: () => ({}),
    },
    fieldItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },

  methods: {
    minMaxNumber(val, type) {
      if (isNumberStr(val)) {
        return Number(val);
      }
      if (type === "max") {
        return 99999999999;
      }
      return 0;
    },
    changeNumber(val, col) {
      if (col.requiredKeyArr) {
        // 必填时-清空后默认为最小值
        if (col.requiredKeyArr.includes(col.id) && !val) {
          this.$nextTick(() => {
            this.formModel[col.id] = this.minLimitNumber(col.decimal || 0); // 视图更新后重置
            col.onNumberChange && col.onNumberChange(this.formModel);
          });
        } else {
          col.onNumberChange && col.onNumberChange(this.formModel);
        }
      } else {
        col.onNumberChange && col.onNumberChange(this.formModel);
      }
    },
    handleCloseImg(idx) {
      if (this.fieldItem.httpDelImgRequest) {
        // 删除提示
        customMessageBox(
          this,
          {
            msgTxtColor: "#FF6767",
            httpMsgRequest: () =>
              this.fieldItem.httpDelImgRequest(this.formModel, idx),
          },
          () => {
            this.msgSuccess("删除成功");
            this.formModel[this.fieldItem.id].splice(idx, 1);
          }
        );
      } else {
        this.formModel[this.fieldItem.id].splice(idx, 1);
      }
    },
    selectParamsFn() {
      if (this.fieldItem.selectKeyArr) {
        return this.fieldItem.selectKeyArr.reduce((opt, key) => {
          opt[key] = this.fieldItem.selectObjKey
            ? this.formModel[this.fieldItem.selectObjKey[key]]
            : this.formModel[key];
          return opt;
        }, this.fieldItem.selectParamObj || {});
      }
      return this.fieldItem.selectParamObj || {};
    },
    disableInput() {
      return (
        this.formModel[this.fieldItem.disableKey] || this.fieldItem.disable
      );
    },
    dictTypeList() {
      const { basicType } = this.fieldItem;
      return basicType ? this.dictObj[basicType] || [] : [];
    },
    getPreviewConfig(imgItem) {
      return {
        title: imgItem.name,
        previewHttp: () => {
          return new Promise((resolve) => {
            resolve({
              data: imgItem.filePath,
            });
          });
        },
      };
    },
  },
  computed: {
    ...mapState({
      dictObj: (state) => state.dictionary.dicsData,
    }),
  },
  components: {
    AutoComplete: () => import("_comp/ComForm/AutoComplete"),
    PreviewOrDownload: () => import("_comp/ComFileTable/previewOrDownload.vue"),
  },
};
</script>
<style lang="scss" scoped>
.custom-preview-image {
  margin-bottom: 0;
  .attach-img {
    position: relative;
    &:not(:last-child) {
      margin-right: 5px;
    }
    .el-icon-error {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 3;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      cursor: pointer;
    }
  }
  .el-image {
    width: 36px;
    height: 36px;
    border: none;
    margin: 0;
  }
  .row-upload-icon {
    width: 36px;
    height: 36px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
  }
  /deep/ .img-err-slot {
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    & > span {
      height: 36px;
    }
    .default-img {
      width: 36px;
      height: 36px;
    }
    // .img-name {
    //   white-space: nowrap;
    //   text-overflow: ellipsis;
    //   overflow: hidden;
    //   max-width: 100%;
    // }
  }
}
</style>
