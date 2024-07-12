<template>
  <div class="details">
    <div class="content">
      <ComDetailTop
        :title="`FBA退仓订单(${initInfo.orderNum})`"
        :formModel="initInfo"
        :orderIdList="orderIdList"
        @handleClick="handleTopClick"
      >
        <template v-slot:subTitle>
          <span class="sub-title"> ({{ initInfo.customerName }}) </span>
        </template>
      </ComDetailTop>
      <ComForm
        class="edit-form"
        ref="editForm"
        :formConfig="warehouseConfig"
        v-if="Object.keys(dictionary.dicsData).length"
      >
        <template v-slot:tableData>
          <div class="goods-info">
            <span class="title">货物信息</span>
          </div>
          <ComTable
            ref="goodsTable"
            :columnConfig="goodsTable.columnConfig"
            :httpRequest="goodsTable.httpRequest"
            :getQueryParams="() => getQueryParams()"
            :pagination="false"
            @getResult="getResult()"
          >
          </ComTable>
          <div class="grand-total">
            <template v-for="gross in goodsTable.grossTotal">
              <span :key="gross.prop">
                <span class="label">{{ gross.label }}</span>
                <span class="value">{{ gross.total }}</span>
              </span>
            </template>
          </div>
        </template>
        <template v-slot:accessory>
          <div class="accessory" style="margin: 25px 0">
            <el-row class="accessory-title"
              >附件信息
              <span class="accessory-txt">
                支持扩展名：{{
                  warehouseConfig.uploadConfig.accept.split(",").join(" ")
                }}，单个文件大小支撑到最大{{
                  warehouseConfig.uploadConfig.size
                }}M，最多上传{{ warehouseConfig.uploadConfig.limit }}个附件
              </span>
            </el-row>
            <ComUpload
              :uploadConfig="warehouseConfig.uploadConfig"
              v-if="warehouseConfig.uploadConfig.fileList.length"
            >
            </ComUpload>
            <span v-else>--</span>
          </div>
        </template>
      </ComForm>
    </div>
    <div class="order-footer" v-if="initInfo.orderStatus == 1">
      <el-button type="primary" @click="orderReceiving"> 接单 </el-button>
      <el-button @click="reBack()"> 关 闭 </el-button>
    </div>
    <OrderReceiving ref="dialog" @handleSuccess="handleSuccess" />
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { defaultTextParams } from "_comp/ComUpload/model";
import { warehouseConfig, goodsTableColumns } from "./model";
import { getForecastDetails, getGoodsInfo } from "@/api/warehouse/prediction";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComUpload: () => import("_comp/ComUpload"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
    OrderReceiving: () => import("./OrderReceiving"),
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  data() {
    const formConfig = {
      formModel: {},
      httpRequest: () => {}, // 表单提交接口
      successFunction: () => {}, // 表单提交成功回调
      size: "small",
      labelWidth: "82px",
      formRules: {}, // 表单校验规则
      visibleAll: true,
    };
    const accessoryConfig = {
      ...defaultTextParams,
      fileList: [],
      disabled: true,
      text: {},
    };
    return {
      initInfo: {},
      orderIdList: [],
      goodsTable: {
        httpRequest: this.getGoodsList,
        columnConfig: goodsTableColumns.config,
        grossTotal: goodsTableColumns.grossTotal,
      },
      grossTotal: {},
      warehouseConfig: {
        ...formConfig,
        lists: warehouseConfig.lists,
        uploadConfig: {
          ...accessoryConfig,
        },
      },
    };
  },
  created() {
    this["dictionary/getDictionary"]("predictionManage");
    const { id } = this.$route.query;
    if (!id) {
      this.reBack();
      return;
    }
    const fbaReWarehouseIdList = localStorage.getItem("fbaReWarehouseIdList");
    if (fbaReWarehouseIdList) {
      this.orderIdList = JSON.parse(fbaReWarehouseIdList);
    }
    this.getDetails(id);
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    reBack() {
      this.$router.push(`/newOrderManage/overSea/fbaWithdrawal`);
    },
    handleTopClick({ type, id }) {
      if (type === "back") {
        this.reBack();
        return;
      }
      if (type === "pre" || type === "next") {
        this.$route.query.id = id;
        this.getDetails(id);
      }
    },
    getQueryParams() {
      return {
        orderId: this.$route.query.id,
      };
    },
    getGoodsList(params) {
      return new Promise((resolve) => {
        getGoodsInfo({
          ...params,
          pageSize: 999,
        }).then((res) => {
          this.grossTotal = res;
          return resolve(res);
        });
      });
    },
    getDetails(id) {
      const newUrl = this.$route.path + `?id=${id}`;
      window.history.replaceState("", "", newUrl);
      getForecastDetails(id).then((res) => {
        console.log("details", res.data);
        this.initInfo = res.data;
        const models = res.data;
        this.warehouseConfig.uploadConfig.fileList = models.attachList || [];
        this.warehouseConfig.formModel = models;
        this.$refs.editForm && this.$refs.editForm.setFormModel(models);
      });
      this.$refs["goodsTable"] && this.$refs["goodsTable"].refreshTable(true);
    },
    getRepeatNum(list) {
      return list.reduce((prev, next) => {
        prev[next] = prev[next] + 1 || 1;
        return prev;
      }, {});
    },
    getResult() {
      if (this.grossTotal.code === 200) {
        this.goodsTable.grossTotal.map((item) => {
          let total = 0;
          if (item.type === "category") {
            const propList = this.grossTotal.rows.map(
              (eles) => eles[item.prop]
            );
            if (propList.length) {
              const propObj = this.getRepeatNum(propList);
              total = Object.keys(propObj).length;
            }
            this.$set(item, "total", total);
            return;
          }
          this.grossTotal.rows.map((result) => {
            if (item.compute) {
              total +=
                result[item.factor[0].prop] * result[item.factor[1].prop];
            } else {
              total += result[item.prop];
            }
          });
          this.$set(item, "total", total);
        });
      }
    },
    orderReceiving() {
      this.$refs.dialog.show(this.initInfo);
    },
    handleSuccess() {
      this.getDetails(this.$route.query.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.details {
  background: #f9f9f9;
  padding: 11px 0 120px;
  /deep/ {
    .edit-form .el-form-item {
      margin-bottom: 0;
    }
    .border-top-solid::before {
      margin-top: 15px;
    }
    .goods-info {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      .title {
        font-size: 14px;
        color: #515151;
        font-weight: bold;
      }
    }
    .custom-remark .el-form-item__label,
    .accessory-title {
      margin-bottom: 0;
    }
    .accessory-txt {
      font-size: 12px;
      color: #bcbcbc;
      font-weight: 400;
      margin-left: 15px;
    }
  }
  .content {
    width: 1214px;
    min-height: calc(100vh - 108px);
    margin: auto;
    background: #fff;
    .sub-title {
      color: #00adb2;
    }
    .edit-form {
      margin-top: 15px;
      padding: 0 20px;
    }
  }
}
</style>
