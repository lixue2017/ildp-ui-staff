<template>
  <div v-if="!defaultFileConfig.noLengthHide || fileArr.length">
    <div
      v-if="defaultFileConfig.fileHeader !== false"
      class="base-flex-between"
    >
      <div class="file-title" v-if="defaultFileConfig.fileTitle">
        {{ defaultFileConfig.fileTitle }}({{ fileArr.length }})
      </div>
      <div>
        <template v-for="(hBtn, index) in fileTableConfig.fileHeadBtnArr || []">
          <el-button
            :key="`h_${index}`"
            size="small"
            type="primary"
            plain
            round
            v-debounce
            @click="() => handleHeadUpload(hBtn)"
            >{{ hBtn.text }}</el-button
          >
        </template>
      </div>
    </div>

    <ComTable
      ref="fileComRef"
      :extraConfig="{
        showHeader: false,
      }"
      :columnConfig="tableTabConfig()"
      :columnData="fileArr"
      :rowOperationBtnListFn="(r) => tableButtonList(r)"
      :colShowBtnFn="(btnItem, r) => operationRowBtnFn(btnItem, r)"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'attachSlotName'">
          <div class="attach-box base-flex-align">
            <div class="attach-img base-flex-center">
              <img
                class="max-w-h-img"
                :src="handleFile(slotProps.row.filePath)"
              />
            </div>
            <div class="attach-content">
              <el-popover
                placement="top"
                width="97"
                popper-class="file-preview-popper"
                trigger="hover"
              >
                <div class="base-flex-center">
                  <i
                    class="el-icon-view"
                    @click="handlePreviewDownload(slotProps.row, 'preview')"
                  />
                  <i
                    class="el-icon-download"
                    @click="handlePreviewDownload(slotProps.row, 'download')"
                  />
                </div>
                <span class="attach-file primary-text-color" slot="reference">
                  {{
                    slotProps.row.name ||
                    (slotProps.row.filePath || "").split("/").reverse()[0]
                  }}
                </span>
              </el-popover>

              <div
                class="conts"
                v-if="
                  !['ecOrder', 'trOrder'].includes(fileTableConfig.viewSource)
                "
              >
                <!-- 订单详情不显示 -->
                {{
                  `${slotProps.row.fileSize}.${
                    slotProps.row.createBy || "--"
                  }.${slotProps.row.createTime}`
                }}
              </div>
            </div>
          </div>
        </template>

        <template v-if="slotProps.prop === 'attachSlotType'">
          <span class="tag-green-color">{{
            slotProps.row.typeName || "--"
          }}</span>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { filesPreview } from "@/utils/index";
import { download } from "@/utils/download.js";
import productDefaultLogo from "@/assets/image/product_default.svg";
import { getAttachList } from "@/api/overseas/fbaOrder.js";
import { attachTableCols } from "./model";
export default {
  props: {
    fileTableConfig: {
      type: Object,
      default: () => ({
        // fileHeadBtnArr: [
        //   {
        //     text: "新增",
        //     btnType: "add",
        //   },
        // ],
      }),
    },
    fileTableBtnArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      defaultFileConfig: {
        // 初始化默认值
        fileTitle: "附件资料",
        // fileHeader: true, // 是否显示头部信息
        showBtnTypeArr: ["delete", "download"], // 显示的按钮类型
        noLengthHide: true, // 没有数据时隐藏
      },
      fileArr: [],
      defaultFileBtnArr: [
        {
          text: "删除",
          btnRowType: "delete",
          handleClick: (row) => {
            const rIndex = this.fileArr.findIndex(
              (e) => e.temp_secondId === row.temp_secondId
            );
            if (rIndex > -1) {
              const delFiles = [...this.fileArr];
              delFiles.splice(rIndex, 1);
              if (!this.fileTableConfig.isRequestDeletion) {
                this.setFileList(delFiles);
              }
              this.$emit("onFileDelete", delFiles);
            }
          },
        },
        {
          text: "资料下载",
          btnRowType: "download",
          handleClick: (row) => {
            this.handlePreviewDownload(row, "download");
          },
        },
        // {
        //   text: "自定义按钮",
        //   btnRowType: "customizeEvt", // 单独处理
        //   handleClick: (row) => {
        //     handleBtnEvent && handleBtnEvent(row);
        //   },
        // },
      ],
    };
  },
  methods: {
    /** 头部操作项 */
    handleHeadUpload(hBtn) {
      // console.log("hBtn==", hBtn);
      switch (hBtn.btnType) {
        case "add":
          hBtn.handleClick && hBtn.handleClick();
          break;
        default:
          break;
      }
    },
    /** 预览与下载 */
    handlePreviewDownload(row, btnType) {
      if (!row.filePath) return;
      if (btnType === "download") {
        download(row.filePath, row.name);
      } else {
        filesPreview(row.filePath);
      }
    },
    setFileList(list) {
      this.fileArr = list || [];
      this.$refs.fileComRef?.setNewTableData(this.fileArr);
    },
    /** 附件ID查询附件, 父组件调用 */
    attachRequestTable(fileParams) {
      const { attachId, isFileDictAuthority, showFileType } = fileParams || {};
      if (attachId) {
        let opt = {
          attachId,
        };
        if (isFileDictAuthority) {
          // 字典词 显示类型: explains
          const { explains } =
            this.attachDictConf.find((e) => e.nameEn == showFileType) || {};
          opt.queryTypeList = explains;
        }
        getAttachList(opt).then((res) => {
          this.setFileList(res.data);
        });
      }
    },
    tableButtonList(r) {
      const btnAllList = [...this.fileTableBtnArr, ...this.defaultFileBtnArr];
      const { showBtnTypeArr } = this.defaultFileConfig;
      let nRowBtnList = [];
      if (showBtnTypeArr) {
        showBtnTypeArr.forEach((ele) => {
          const rBtn = btnAllList.find((t) => ele === t.btnRowType);
          if (rBtn) {
            nRowBtnList.push(rBtn); // 根据传入值重置显示顺序
          }
        });
      }
      return nRowBtnList;
    },
    operationRowBtnFn(btnItem, row) {
      const { delShowFileRowType } = this.defaultFileConfig;
      if (delShowFileRowType && btnItem.btnRowType === "delete") {
        if (typeof delShowFileRowType === "string") {
          return delShowFileRowType.includes(row.type);
        }
        return delShowFileRowType.map((val) => +val).includes(+row.type); // 是否显示删除按钮
      }
      return true;
    },
    handleFile(url) {
      if (
        url &&
        (url.includes(".jpg") || url.includes(".png") || url.includes(".jpeg"))
      ) {
        return url;
      }
      return productDefaultLogo;
    },
    tableTabConfig() {
      return attachTableCols(true, { isColumnOperation: true });
    },
  },
  mounted() {
    if (this.fileTableConfig.attachList) {
      setTimeout(() => {
        // 子组件加载完后赋值
        this.setFileList(this.fileTableConfig.attachList);
      }, 20);
    }
  },
  created() {
    Object.assign(this.defaultFileConfig, this.fileTableConfig || {});
  },
  computed: {
    ...mapState({
      attachDictConf: (state) => state.dictionary.dicsData.attachConfig || [],
    }),
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.file-title {
  padding: 20px 0 15px;
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
}
.attach-img {
  width: 36px;
  height: 36px;
  overflow: hidden;
  margin: 0 20px;
  .max-w-h-img {
    max-width: 100%;
    max-height: 100%;
  }
}
.attach-file {
  cursor: pointer;
}
</style>
