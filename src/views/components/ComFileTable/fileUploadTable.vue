<template>
  <div class="upload-table-box">
    <!-- <div @click="() => handleUploadSuccess({ data: [7625] })">添加</div> -->
    <template v-if="uploadTableConfig.webEditUpload !== false">
      <div class="top base-flex-between">
        <div
          :class="`title ${uploadTableConfig.required ? 'rules-required' : ''}`"
        >
          {{ overseaLangObj.fj_zl || "附件资料" }}
        </div>
        <div class="sub-title">
          <template v-if="overseaLangObj.yu_yan_lang === 'en-us'">
            SUPPORTED FOR EXTENSIONS:
            {{ fUploadConfig.accept.split(",").join(" ") }}，SUPPORT A SINGLE
            FILE SIZE OF UP TO {{ fUploadConfig.size }}M AND UPLOAD UP TO
            {{ fUploadConfig.limit }} ATTACHMENTS
          </template>
          <template v-else
            >支持扩展名：{{
              fUploadConfig.accept.split(",").join(" ")
            }}，单个文件大小支撑到最大{{ fUploadConfig.size }}M，最多上传{{
              fUploadConfig.limit
            }}个附件</template
          >
        </div>
      </div>

      <div class="tabs-upload" v-if="isFileInitRes">
        <div
          class="base-flex-align upload-type-tab"
          v-if="defaultConfig.webFileType === 'F101' && showFileTabs.length"
        >
          <span style="flex: 0 0 76px"
            >{{ overseaLangObj.fj_type || "附件类型" }}：</span
          >
          <div class="custom-tabs-btn">
            <template v-for="(item, fIdx) in showFileTabs">
              <el-button
                size="small"
                plain
                :key="`f_${fIdx}i`"
                @click="() => changeTabs(item, fIdx)"
                :type="activeIndex == fIdx ? 'activation' : ''"
                >{{ item.label }}</el-button
              >
            </template>
          </div>
        </div>

        <div
          :class="
            defaultConfig.webFileType === 'F202' && 'receivable-file-type'
          "
        >
          <ComUpload
            :uploadConfig="fUploadConfig"
            @handleSuccess="handleUploadSuccess"
          >
          </ComUpload>
          <div class="type-txt" v-if="defaultConfig.webFileType === 'F202'">
            {{ overseaLangObj.fj_type || "附件类型" }}：{{
              overseaLangObj.mr_default || "默认"
            }}
            <span class="text-theme-color">{{ showFileTabs[0].label }}</span>
          </div>
        </div>
      </div>
    </template>

    <template v-if="uploadTableConfig.showSlot">
      <slot />
    </template>

    <template v-if="uploadTableConfig.showFlitTable !== false && isFileInitRes">
      <ComFileAttachTable
        v-loading="fileTableLoading"
        ref="attachTableRef"
        :fileTableConfig="{
          fileHeader: uploadTableConfig.webEditUpload === false, // 编辑时默认不显示头部信息
          showBtnTypeArr:
            uploadTableConfig.webEditUpload === false
              ? ['download']
              : ['delete', 'download'],
          attachList: [...(uploadTableConfig.attachList || [])], // 防止改变原数据, 获取不到删除值
          delShowFileRowType: uploadTableConfig.isGetUploadFileTypes
            ? getCurDictFileType().expandVal
            : null,
          isRequestDeletion:
            uploadTableConfig.httpDelFileRequest &&
            (uploadTableConfig.httpGetFileRequest ||
              uploadTableConfig.isDelGetAttachList),
          ...uploadFileTableConfig,
        }"
        @onFileDelete="handleFileDelete"
      />
    </template>
  </div>
</template>

<script>
import { defaultTextParams, fileTypeUploadUrl } from "_comp/ComUpload/model";
import { deleteOrAddArr } from "@/utils/instructions";
import { getAttachList } from "@/api/overseas/fbaOrder.js";
import { mapActions, mapState } from "vuex";
export default {
  props: {
    uploadTableConfig: {
      type: Object,
      default: () => ({
        // showFileTypeArr: ["30", "131", "100"], // 显示上传类型的顺序
        // webFileTypeArr: [
        //   {
        //     label: "应收账单合同",
        //     btnFileParams: {
        //       type: "131",
        //     },
        //   },
        // ],
        // resetAdditionalKeys: ["beforeCheckCallBack"],
        // additionalFileArr: [
        //   {
        //     value: "92",
        //     uploadOtherConfig: {
        //       beforeCheckCallBack: (file) => {
        //         console.log("==x", file);
        //         if (!file.name.includes("报关资料")) {
        //           this.msgError(`客户报关资料文件名需要有‘报关资料’字符`);
        //           return false;
        //         }
        //       },
        //     },
        //   },
        // ],
      }),
    },
    uploadFileTableConfig: {
      type: Object,
      default: () => ({
        // showBtnTypeArr: ["delete", "download"], // 显示的按钮类型
      }),
    },
  },
  data() {
    return {
      fUploadConfig: {
        ...defaultTextParams,
        drag: true,
        pasteUpload: true,
        fileList: [],
        url: fileTypeUploadUrl,
        uploadData: {},
      },
      fileTypeTabs: [
        {
          label: "客户报关资料",
          btnFileParams: {
            type: "100",
          },
        },
        {
          label: "清关资料",
          btnFileParams: {
            type: "160",
          },
        },
        {
          label: "报关放行资料", // 报关资料
          btnFileParams: {
            type: "60",
          },
        },
        {
          label: "清关资料",
          btnFileParams: {
            type: "160",
          },
        },
      ],
      showFileTabs: [], // 显示的按钮
      attachAllList: [], // 附件ID
      defaultConfig: {
        // 初始化默认值
        // showSlot: false,
        // showFlitTable: true,
        // webEditUpload: true,
        // required: false, // 必填星号
        // webFileType: "F101",
      },
      activeIndex: 0,
      isFileInitRes: false,
      fileTableLoading: false,
    };
  },
  methods: {
    changeTabs(valObj, i) {
      this.activeIndex = i;
      if (this.uploadTableConfig.resetAdditionalKeys?.length) {
        this.uploadTableConfig.resetAdditionalKeys.forEach((ele) => {
          // 切换类型重置附加属性
          delete this.fUploadConfig[ele];
        });
      }
      Object.assign(this.fUploadConfig.uploadData, valObj?.btnFileParams || {});
      Object.assign(this.fUploadConfig, valObj?.uploadOtherConfig || {});
    },
    async handleUploadSuccess(res) {
      //上传附件成功
      if (res.data) {
        this.attachAllList.push(...res.data);
        const {
          onFileChange,
          httpSaveFileRequest,
          isAttachIdGetList = true,
          httpGetFileRequest,
        } = this.uploadTableConfig;
        onFileChange && onFileChange(this.attachAllList);
        if (httpSaveFileRequest) {
          await httpSaveFileRequest({
            attachAllList: this.attachAllList,
            ...this.getAttachmentParams(),
          });
          if (httpGetFileRequest) {
            this.getAttachRequestFiles();
          }
        }
        if (isAttachIdGetList) {
          this.getAttachListFiles({
            attachId: this.attachAllList.join(","),
          });
        }
      }
    },
    async handleFileDelete(arr) {
      this.attachAllList = (arr || []).map((e) => e.id);
      const {
        onFileChange,
        httpDelFileRequest,
        isDelGetAttachList,
        httpGetFileRequest,
      } = this.uploadTableConfig;
      onFileChange && onFileChange(this.attachAllList);
      if (httpDelFileRequest) {
        await httpDelFileRequest({
          attachAllList: this.attachAllList,
          ...this.getAttachmentParams({
            isGetDeleteIds: true,
          }),
        });
        if (httpGetFileRequest) {
          this.getAttachRequestFiles();
        }
        if (isDelGetAttachList) {
          this.getAttachListFiles({
            attachId: this.attachAllList.join(","),
          });
        }
      }
      this.msgSuccess("删除成功");
    },
    getAttachmentParams(obj) {
      const { isGetDeleteIds } = obj || {};
      // 父组件调用
      let params = {
        attachId: this.attachAllList.join(","),
      };
      if (isGetDeleteIds) {
        params.deleteAttachIdList = deleteOrAddArr(
          this.attachAllList,
          (this.uploadTableConfig.attachList || []).map((e) => e.id) // 初始附件ID
        );
      }
      return params;
    },
    showFileTypeFilter() {
      const {
        showFileTypeArr = [], // 不要与hideDictFiles同时使用, 会重复执行监听事件
        webFileTypeArr = [],
        hideDictFiles = [], // 取字典附件时, 动态隐藏类型
        additionalFileArr,
        isGetUploadFileTypes,
      } = this.uploadTableConfig;
      let nFileTabs = [];
      if (isGetUploadFileTypes) {
        //如果需要动态获取可上传附件类型，就传入onGetUploadFileTypes:true   onGetFileType(数据字典：attachConfig的code或KHD)这两个字段
        const { expandVal } = this.getCurDictFileType();
        const fileDictArr = (expandVal || "").split(",") || [];
        fileDictArr.forEach((ele) => {
          let fRow = this.attachType.find((r) => r.value == ele);
          if (fRow && !hideDictFiles.includes(fRow.value)) {
            if (additionalFileArr) {
              fRow.additional_file = additionalFileArr.find(
                (e) => e.value == ele
              );
            }

            nFileTabs.push({
              ...(fRow.additional_file || {}),
              label: fRow.nameCn,
              btnFileParams: {
                type: fRow.value,
              },
            });
          }
        });
      } else {
        const fileAllList = [...webFileTypeArr, ...this.fileTypeTabs];
        showFileTypeArr.forEach((ele) => {
          // 类型一样时, 使用传入的附件类型
          const fileTab = fileAllList.find(
            (f) => ele === f.btnFileParams?.type
          );
          if (fileTab) {
            nFileTabs.push(fileTab); // 根据传入值重置显示顺序
          }
        });
      }
      this.defaultConfig.webFileType = nFileTabs.length === 1 ? "F202" : "F101";
      return nFileTabs;
    },
    getCurDictFileType() {
      // 字典词 上传类型: expandVal 显示类型: explains
      const { onGetFileType } = this.uploadTableConfig;
      return this.attachConfig.find((e) => e.nameEn == onGetFileType) || {};
    },
    refSetTableFiles(arr) {
      this.uploadTableConfig.attachList = arr || []; // 初始数据, 删除时的对比值
      this.attachAllList = (arr || []).map((e) => e.id);
      setTimeout(() => {
        this.$refs.attachTableRef?.setFileList([...(arr || [])]); // 防止改变初始值
      }, 20);
    },
    getAttachListFiles(row = {}) {
      let opt = {
        attachId: row.attachId,
        ...(this.uploadTableConfig.attachParams || {}),
      };
      if (this.uploadTableConfig.isGetUploadFileTypes) {
        const { explains } = this.getCurDictFileType();
        opt.queryTypeList = explains;
      }
      this.fileTableLoading = true;
      getAttachList(opt).then((res) => {
        this.refSetTableFiles(res.data);
        this.fileTableLoading = false;
      });
    },
    getAttachRequestFiles() {
      const { httpGetFileRequest } = this.uploadTableConfig;
      const { explains } = this.getCurDictFileType();
      this.fileTableLoading = true;
      httpGetFileRequest({ explains }).then((res) => {
        this.refSetTableFiles(res.data);
        this.fileTableLoading = false;
      });
    },
    async initFileType() {
      if (this.uploadTableConfig.isGetUploadFileTypes) {
        await this["dictionary/getDictionary"](["attachType", "attachConfig"]);
      }
      this.showFileTabs = this.showFileTypeFilter();
      this.isFileInitRes = true;
      const {
        attachList,
        attachId,
        showFileList = false,
      } = this.uploadTableConfig;
      Object.assign(this.fUploadConfig, {
        uploadData: {
          ...(this.showFileTabs[this.activeIndex]?.btnFileParams || {}),
        },
        ...(this.showFileTabs[this.activeIndex]?.uploadOtherConfig || {}),
        showFileList,
      });
      if (attachList) {
        this.attachAllList = (attachList || []).map((e) => e.id);
      } else if (attachId) {
        this.getAttachListFiles({ attachId });
      } else if (this.uploadTableConfig.httpGetFileRequest) {
        this.getAttachRequestFiles();
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  mounted() {
    this.initFileType();
  },
  watch: {
    "uploadTableConfig.showFileTypeArr"() {
      this.showFileTabs = this.showFileTypeFilter();
      this.changeTabs(this.showFileTabs[0], 0);
    },
    "uploadTableConfig.hideDictFiles"() {
      this.showFileTabs = this.showFileTypeFilter();
      this.changeTabs(this.showFileTabs[0], 0);
    },
  },
  computed: {
    ...mapState({
      attachType: (state) => state.dictionary.dicsData.attachType || [],
      attachConfig: (state) => state.dictionary.dicsData.attachConfig || [],
    }),
  },
  components: {
    ComUpload: () => import("_comp/ComUpload"),
    ComFileAttachTable: () => import("./fileAttachmentTable.vue"),
  },
};
</script>

<style lang="scss" scoped>
.upload-table-box {
  .top {
    padding: 16px 0 10px;

    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .rules-required:before {
      content: "*";
      color: #fa7a7a;
      margin-right: 4px;
    }
    .sub-title {
      flex: 1;
      margin: 0 15px;
      color: #8b8b8b;
    }
  }
  .tabs-upload {
    padding-bottom: 10px;
    .custom-tabs-btn {
      border-bottom: none;
      margin-left: 10px;
    }
  }
  .receivable-file-type {
    display: flex;
    .type-txt {
      margin-left: 18px;
      line-height: 36px;
    }
  }
}
</style>
