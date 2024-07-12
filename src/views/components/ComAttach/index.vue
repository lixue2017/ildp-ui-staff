<template>
  <div class="upload-title">
    <div class="top">
      <div class="title">附件资料</div>
      <template v-if="!disable">
        <div class="subTitle">
          支持扩展名：.rar .zip .doc .docx .xls .xlsx .pdf .jpg
          .png，单个文件大小支撑到最大100M，最多上传20个附件
        </div>
        <el-dropdown
          size="small"
          type="primary"
          @command="handleCommand"
          trigger="click"
        >
          <el-button>
            上传附件<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="contract">
              <ComUpload
                :uploadConfig="contractUploadConfig"
                @handleSuccess="uploadSuccess"
              >
              </ComUpload>
            </el-dropdown-item>
            <el-dropdown-item command="busLicense">
              <ComUpload
                :uploadConfig="licenseUploadConfig"
                @handleSuccess="uploadSuccess"
              >
              </ComUpload>
            </el-dropdown-item>
            <el-dropdown-item command="others">
              <ComUpload
                :uploadConfig="othersUploadConfig"
                @handleSuccess="uploadSuccess"
              >
              </ComUpload>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
    <ComTable
      ref="attachTable"
      :columnConfig="attachTable.columnConfig"
      :httpRequest="attachTable.httpRequest"
      :getQueryParams="getQueryParams"
      :extraConfig="attachTable.extraConfig"
      :pagination="false"
      @getResult="getResult"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'content'">
          <ul class="attach-list">
            <li>
              <div class="pics-box">
                <img :src="handleFile(slotProps.row.filePath)" alt="" />
              </div>
              <div class="attach-content">
                <el-row>
                  <span
                    class="cursorPointer attach-file"
                    @click="openUrl(slotProps.row)"
                  >
                    {{ `${slotProps.row.name}${slotProps.row.suffix}` }}
                  </span>
                  <span class="type">
                    类型：{{ getAttachType(slotProps.row.attentmentType) }}
                  </span>
                </el-row>
                <el-row>
                  <span class="conts">
                    {{
                      `${slotProps.row.fileSize}.${
                        slotProps.row.createBy || "--"
                      }.${slotProps.row.createTime}`
                    }}
                  </span>
                </el-row>
              </div>
            </li>
          </ul>
        </template>
        <template v-if="slotProps.prop === 'operation'">
          <div class="operate-btn-list">
            <template v-for="(item, index) in attachTable.btnList">
              <div class="btn" :key="index" v-if="!item.hide">
                <el-button
                  :class="`operate-icon ${
                    item.info ? 'operate-icon-info' : ''
                  }`"
                  size="small"
                  type="text"
                  :icon="item.icon"
                  @click="item.handleClick(slotProps.row)"
                >
                  {{ item.text }}
                </el-button>
              </div>
            </template>
          </div>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { defaultTextParams } from "_comp/ComUpload/model";
import { download } from "@/utils/download";
import productDefaultLogo from "@/assets/image/product_default.svg";
import { tableColumns } from "./model.js";
import { mapState } from "vuex";
import {
  getAttachInfo,
  removeAttach,
  getAttachInfoById,
} from "@/api/customerManage/customerList.js";
import { ATTACH_TYPE } from "@/utils/mixin.js";
export default {
  props: {
    formModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComUpload: () => import("_comp/ComUpload"),
    ComTable: () => import("_comp/ComTable"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    const uploadConfig = {
      ...defaultTextParams,
      url: process.env.VUE_APP_BASE_API + "/crm/attach/fileUpload",
      name: "attachFile",
      showFileList: false,
      fileList: [],
    };
    return {
      attachTable: {
        columnConfig: tableColumns,
        httpRequest: (params) => {
          if (!params.id) {
            return new Promise((resolve, reject) => {
              reject();
            });
          }
          return getAttachInfo(params);
        },
        extraConfig: {
          showHeader: false,
        },
        btnList: [
          {
            text: "附件下载",
            type: "text",
            handleClick: this.openUrl,
          },
          {
            text: "删除",
            info: true,
            type: "delete",
            hide: this.disable,
            handleClick: (rows) => {
              this.handleDelete(rows.id);
            },
          },
        ],
      },
      contractUploadConfig: {
        ...uploadConfig,
        text: {
          btnText: "发票资料",
        },
        uploadData: {
          attentmentType: "invoiceInfo",
          customerId: this.formModel.id || "",
        },
      },
      licenseUploadConfig: {
        ...uploadConfig,
        text: {
          btnText: "财务资料",
        },
        uploadData: {
          attentmentType: "financeInfo",
          customerId: this.formModel.id || "",
        },
      },
      othersUploadConfig: {
        ...uploadConfig,
        text: {
          btnText: "其他资料",
        },
        uploadData: {
          attentmentType: "customerOther",
          customerId: this.formModel.id || "",
        },
        fileList: [],
      },
      pageId: "",
      fileList: [],
      attatchIdList: "",
      filseList: [],
      arr: [],
    };
  },
  watch: {
    formModel: {
      deep: true,
      handler: function (newVal, oldVal) {
        //每次翻页的时候重新获取附件列表
        const { id } = this.$route.query;
        const params = {
          id: id,
          pageNum: 1,
          pageSize: 999,
        };
        this.$refs.attachTable.getTableData(params);
      },
    },
  },
  mounted() {
    console.log("formModel", this.formModel);
    this.pageId = this.$route.query.id;
  },
  methods: {
    handleCommand(command) {
      console.log(command);
    },
    getAttachType(type) {
      const ret = ATTACH_TYPE.find((item) => item.value === type);
      return (ret && ret.label) || "";
    },
    uploadSuccess(res) {
      // console.log('res===', res)
      this.$refs.attachTable.refreshTable(true);
    },
    getQueryParams() {
      const { id = "" } = this.$route.query;
      return {
        id,
      };
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
    handleDelete(id) {
      removeAttach(id).then(() => {
        this.$message("删除成功");
        this.$refs.attachTable.refreshTable(true);
      });
    },
    openUrl(rows) {
      if (!rows.filePath) return;
      const isOpen = /.jpg|.jpeg|.png|.pdf/.test(rows.suffix);
      if (isOpen) {
        window.open(rows.filePath);
      } else {
        download(rows.filePath, `${rows.name}${rows.suffix}`);
      }
    },
    getResult(rows) {},
  },
};
</script>

 <style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
@mixin center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/deep/ .text-uploader .upload-btn {
  border: none;
}
.upload-title {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 17px 0 10px;
    border-bottom: 1px solid #e2e2e2;

    .title {
      font-size: 14px;
      font-weight: bold;
    }

    .subTitle {
      flex: 1;
      margin: 0 15px;
      color: #8b8b8b;
    }

    .el-button {
      color: #5094ff;
      border-color: #5094ff;
    }
  }
  .attach-list {
    li {
      height: 38px;
      display: flex;
      justify-content: flex-start;
    }
    .pics-box {
      width: 36px;
      height: 36px;
      overflow: hidden;
      margin-right: 20px;
      img {
        width: 100%;
      }
      .max-w-h-img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .attach-content {
      @include center();
    }
    .attach-file {
      display: inline-block;
      width: 350px;
      &:hover {
        // color: rgba(0, 173, 178, 0.1);
        color: rgba($color: #606060, $alpha: 0.6);
      }
    }
  }
  /deep/ .operate-btn-list .operate-icon.operate-icon-info {
    color: #ff6767;
  }
}
</style>
