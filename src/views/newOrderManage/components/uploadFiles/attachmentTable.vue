<template>
  <div v-if="fileArr.length > 0">
    <div v-if="uploadFilesModelConfig.tableShowTable" class="file-title">
      附件资料({{ fileArr.length }})
    </div>
    <ComTable
      ref="fileComRef"
      :extraConfig="{
        showHeader: false,
      }"
      :columnConfig="tableTabConfig()"
      :columnData="fileArr"
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
                <span class="attach-file text-theme-color" slot="reference">
                  {{ slotProps.row.name }}
                </span>
              </el-popover>

              <!-- 客户端的订单列表不显示附件上传信息 -->
              <!-- <div class="conts">
								{{
									`${slotProps.row.fileSize}.${
										slotProps.row.createBy || "--"
									}.${slotProps.row.createTime}`
								}}
							</div> -->
            </div>
          </div>
        </template>

        <template v-if="slotProps.prop === 'attachSlotType'">
          <span class="tag-orange-color">{{ slotProps.row.typeName }}</span>
        </template>

        <template v-if="slotProps.column.customSlot">
          <slot :name="slotProps.column.prop" :slotProps="slotProps" />
        </template>

        <template v-if="slotProps.prop === 'operation'">
          <!-- <el-button
            size="small"
            type="text"
            class="operate-icon"
            @click="handlePreviewDownload(slotProps.row, 'download')"
            >资料下载</el-button
          > -->
          <template v-for="(item, index) in uploadFilesModelConfig.fileBtnArr">
            <el-button
              :key="`f_${index}`"
              size="small"
              type="text"
              v-debounce
              @click="
                handlePreviewDownload(
                  {
                    ...slotProps.row,
                    rowIndex: slotProps.rowIndex,
                  },
                  item.btnOpnType
                )
              "
              >{{ item.text }}</el-button
            >
          </template>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { filesPreview } from "@/utils/index";
import { download } from "@/utils/download.js";
import productDefaultLogo from "@/assets/image/product_default.svg";
import { attachTableCols } from "./model.js";
export default {
  props: {
    uploadFilesModelConfig: {
      type: Object,
      default: () => {
        return {
          fileBtnArr: [
            {
              text: "资料下载",
              btnOpnType: "download",
            },
          ],
          tableShowTable: true,
        };
      },
    },
    uploadFilesModelData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      fileArr: [],
    };
  },
  methods: {
    handlePreviewDownload(row, btnType) {
      //操作按钮
      if (!row.filePath) return;
      if (btnType === "download") {
        download(row.filePath, row.name);
      } else if (btnType === "delete") {
        this.fileArr.splice(row.rowIndex, 1);
        let { filesIds } = this.uploadFilesModelData;
        if (typeof filesIds == "string") {
          filesIds = filesIds.split(",").map(Number);
        }
        const remainFilesIds = this.fileArr.map((e) => {
          return e.id;
        });
        const delIds = filesIds.filter((e) => {
          return !remainFilesIds.includes(e);
        });
        console.log("delIds", delIds);
        this.setFileList(this.fileArr);
        this.$emit("deleteFile", this.fileArr, delIds);
      } else {
        filesPreview(row.filePath);
      }
    },
    setFileList(list = []) {
      this.fileArr = list;
      this.$refs.fileComRef?.setNewTableData(this.fileArr);
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
      return attachTableCols();
    },
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
	flex: 0 0 36px;
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
