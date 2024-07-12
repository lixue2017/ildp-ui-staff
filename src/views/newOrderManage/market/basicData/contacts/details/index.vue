<template>
  <div class="contacts-details" v-if="isInitRes">
    <div>
      <ComDetailTop
        :title="formData.title || ''"
        :formModel="formData"
        ref="detailTopRef"
        @handleClick="handleTopClick"
      >
      </ComDetailTop>
    </div>
    <div class="content">
      <div
        class="primary-color detail-status-btn"
        v-if="dictionary.dicsData.status"
      >
        {{
          dictionary.dicsData.status[formConfig.formModel.dataStatus] &&
          dictionary.dicsData.status[formConfig.formModel.dataStatus].nameCn
        }}
      </div>
      <ComForm ref="dialogForm" :formConfig="formConfig" class="dialog-form">
        <template v-slot:taxId="slotProps">
          {{
            !slotProps.formModel.taxIdType && !slotProps.formModel.taxId
              ? "--"
              : `${
                  slotProps.dicsList[slotProps.formModel.taxIdType]
                    ? `(${
                        slotProps.dicsList[slotProps.formModel.taxIdType].label
                      })`
                    : ""
                }${slotProps.formModel.taxId || ""}`
          }}
        </template>
        <template v-slot:provinceCity="slotProps">
          {{
            `${slotProps.formModel.province || "--"}/${
              slotProps.formModel.city || "--"
            }`
          }}
        </template>
      </ComForm>
      <div class="historical-records" v-if="!formConfig.formModel.contactsType">
        <div class="historical-records-title">清关资料</div>
      </div>
      <ComTable
        v-if="!formConfig.formModel.contactsType"
        ref="clearanceTable"
        :tableHeight="clearanceTable.tableHeight"
        :columnConfig="clearanceTable.columnConfig"
        :httpRequest="clearanceTable.httpRequest"
        :getQueryParams="clearanceTable.getQueryParams"
        :pagination="false"
        :paginationConfig="{
          limit: 999,
        }"
        class="tableData-detail"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'customsClearanceType'">
            <span> {{ slotProps.dicsList.nameCn }}文件 </span>
          </template>
          <template v-if="slotProps.prop === 'status'">
            <span>
              <i
                class="status-dot"
                :style="{
                  backgroundColor: slotProps.dicsList.color,
                }"
              ></i>
              {{ slotProps.dicsList.nameCn }}
            </span>
          </template>
          <template v-if="slotProps.prop === 'attachList'">
            <template v-for="(attach, index) in slotProps.row.attachList">
              <span :key="attach.id" v-if="index !== 0">、</span>
              <span
                class="primary-text-btn"
                :key="attach.id"
                @click="handlePreview(attach)"
              >
                资料{{ index + 1 }}
              </span>
            </template>
          </template>
        </template>
      </ComTable>

      <div class="historical-records margin-top-20">
        <div class="historical-records-title">历史修订记录</div>
        <div class="historical-records-sub">
          <i class="el-icon-info"></i>
          <span>启用之后每次修改修改记录相信信息</span>
        </div>
      </div>
      <ComTable
        ref="detailDialogTable"
        :tableHeight="detailTable.tableHeight"
        :columnConfig="detailTable.columnConfig"
        :httpRequest="detailTable.httpRequest"
        :getQueryParams="getQueryParams"
        :paginationConfig="paginationConfig"
        class="tableData-detail"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'invalid'">
            <el-row>{{ slotProps.row.createBy }} </el-row>
            <el-row> {{ slotProps.row.createTime }}</el-row>
          </template>
          <template v-if="slotProps.prop === 'contacts'">
            <el-row class="show-overflow-tooltip"
              >{{ slotProps.row.contacts }}
            </el-row>
            <el-row class="show-overflow-tooltip">
              {{ slotProps.row.phone || "--" }}</el-row
            >
          </template>
          <template v-if="slotProps.prop === 'taxId'">
            <el-row class="show-overflow-tooltip">
              {{
                slotProps.dicsList
                  ? `(${slotProps.dicsList.nameCn})${slotProps.row.taxId}`
                  : "--"
              }}
            </el-row>
            <el-row class="show-overflow-tooltip">
              {{ slotProps.row.email || "--" }}</el-row
            >
          </template>
          <template v-if="slotProps.prop === 'nation'">
            <el-row class="show-overflow-tooltip"
              >{{ slotProps.row.countryName || "--" }}
            </el-row>
            <el-row class="show-overflow-tooltip">
              {{
                `${slotProps.row.province}/${slotProps.row.city}/${
                  slotProps.row.postCode || "--"
                }`
              }}</el-row
            >
          </template>
          <template v-if="slotProps.prop === 'detailsAddr'">
            <el-row class="show-overflow-tooltip">
              {{ `${slotProps.row.address || "--"}` }}
            </el-row>
            <el-row class="show-overflow-tooltip">
              {{ slotProps.row.company || "--" }}</el-row
            >
          </template>
        </template>
        <template v-slot:customHeader="{ slotProps }">
          <template
            v-if="
              /invalid|contacts|taxId|nation|detailsAddr/.test(
                slotProps.column.prop
              )
            "
          >
            <div>{{ slotProps.column.labelTop }}</div>
            <div>{{ slotProps.column.labelBtm }}</div>
          </template>
        </template>
      </ComTable>
      <div class="dialog-footer">
        <template v-for="(item, index) in footer">
          <el-button
            :type="item.type"
            @click="item.handleClick"
            :key="index"
            :plain="item.plain"
          >
            {{ item.text }}
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>


<script>
import {
  getContactsDetail,
  getHistoryRecord,
} from "@/api/basicInfo/contacts.js";
import { download } from "@/utils/download";
import { getCustomsClearance } from "@/api/order/firstTransport.js";
import { FullscreenLoading } from "@/utils/loading.js";
import { config } from "./model";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    ComDialog: () => import("_comp/ComDialog"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    return {
      fullscreenLoading: new FullscreenLoading(),
      formData: {
        title: "联系人信息",
        createBy: "",
        createTime: "",
      },
      formConfig: {
        formModel: {},
        size: "small",
        labelWidth: "100px",
        lists: [
          {
            width: "100%",
            fieldList: [
              {
                rows: [
                  {
                    cols: config.from,
                  },
                ],
              },
            ],
          },
        ], // 表单渲染列表
        formRules: {},
      },
      detailTable: {
        columnConfig: config.table,
        httpRequest: getHistoryRecord,
      },
      paginationConfig: {
        limit: 5,
        layout: "total, prev, pager, next, jumper",
      },
      clearanceTable: {
        columnConfig: config.clearanceTable,
        httpRequest: () => {
          const { cusContactsMainId } = this.ids;
          return getCustomsClearance(cusContactsMainId);
        },
      },
      footer: [
        {
          text: "取消",
          plain: true,
          handleClick: this.reback,
        },
      ],
      ids: {},
      isInitRes: false,
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    this["dictionary/getDictionary"]("contactTypeEn");
    const { id } = this.$route.query;
    this.show(id);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getQueryParams() {
      const { cusContactsMainId, cusContactsId } = this.ids;
      return {
        cusContactsMainId,
        cusContactsId,
      };
    },
    show(id) {
      this.isInitRes = false;
      // this.fullscreenLoading.show();
      return getContactsDetail(id)
        .then((res) => {
          const data = res.data || {};
          const { createBy, createTime } = data;
          this.formData = {
            ...this.formData,
            createBy,
            createTime,
          };
          this.ids = {
            cusContactsMainId: data.id,
            cusContactsId: data.cusContactsId,
          };
          this.formConfig.formModel = {
            ...(data.cusContacts || {}),
            ...(data || {}),
            isDefault: data.isDefault ? true : false,
            contactsName: data && data.contactsType ? "发件人" : "收件人",
          };
          this.$nextTick(() => {
            this.$refs.dialogForm &&
              this.$refs.dialogForm.setFormModel({
                ...this.formConfig.formModel,
              });
          });
          // this.fullscreenLoading.close();
          this.isInitRes = true;
          setTimeout(() => {
            this.$refs.detailDialogTable.refreshTable(true);
          });
        })
        .catch((err) => {
          // this.fullscreenLoading.hide();
        });
    },
    handlePreview(file) {
      console.log("file", file);
      if (!file.filePath) return;
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const isOpen = /.jpg|.jpeg|.png|.pdf/.test(fileType);
      if (isOpen) {
        window.open(file.filePath);
      } else {
        download(file.filePath, file.name);
      }
    },
    handleTopClick({ type, id }) {
      if (type === "pre" || type === "next") {
        this.show(id);
      }
    },
    reback() {
      this.$refs.detailTopRef?.comReBack();
    },
  },
};
</script>
<style lang="scss" scoped>
.margin-top-20 {
  margin-top: 20px;
}
.contacts-details {
  padding: 24px 36px;
  font-size: 14px;
  color: #1f1f1f;
  /deep/ {
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
      border-color: #fff;
    }
    .el-form-item--small .el-form-item__label,
    .el-form-item--small .el-form-item__content {
      line-height: 20px;
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
  }
  .title-col {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba($color: #bcbcbc, $alpha: 0.3);
    padding-bottom: 3px;
    .title {
      font-weight: 600;
      color: #1f1f1f;
    }
    .create-info {
      font-weight: 400;
      color: #606060;
      margin-left: 24px;
    }
    .orange-text {
      text-decoration: underline;
      margin-left: 24px;
    }
  }
  .historical-records {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .historical-records-title {
      font-size: 16px;
      margin-right: 21px;
      color: #1f1f1f;
    }

    .historical-records-sub {
      color: #666;

      i {
        margin-right: 10px;
      }
    }
  }
  .content {
    padding: 20px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    position: relative;
    .detail-status-btn {
      position: absolute;
      top: 20px;
      right: 24px;
      width: 58px;
      padding: 4px 0;
      border-radius: 14px;
      text-align: center;
    }
  }
  .el-dialog__footer {
    border-top: 1px solid rgba(31, 31, 31, 0.06);
    padding: 14px 20px;
  }
  .dialog-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 36px;
  }
}
</style>
