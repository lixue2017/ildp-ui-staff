<template>
  <div>
    <ComDrawer
      class="add-cabinet-arrangement"
      ref="myDrawer"
      :customDrawer="drawerConfig"
      :confirmClose="false"
    >
      <template v-slot:content>
        <ComDetailTop title="币别配置" :config="{}" />
        <ComForm ref="formRef" :formConfig="searchFormConfig" v-if="isFormShow">
          <template v-slot:customerName="slotProps">
            <span>{{ slotProps.formModel.customerName }}</span>
          </template>
          <template v-slot:currentConfig="slotProps">
            <div>
              <div class="space-between">
                <div>币别</div>
                <div>
                  <el-checkbox v-model="slotProps.formModel.businessModel"
                    >适配业务模块</el-checkbox
                  >
                </div>
              </div>
              <div>
                <el-checkbox-group
                  v-model="slotProps.formModel.currencyIdConfig"
                >
                  <el-checkbox
                    v-for="(item, index) in dictList.invoiceCurrency"
                    :key="index"
                    :label="item.id"
                    >{{ item.code }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </div>
          </template>
          <template v-slot:convertCurrencyIdConfig="slotProps">
            <div>
              <div>
                <span>折合币别</span>
              </div>
              <div>
                <el-checkbox-group
                  v-model="slotProps.formModel.convertCurrencyIdConfig"
                >
                  <el-checkbox
                    v-for="(item, index) in dictList.invoiceCurrency"
                    :key="index"
                    :label="item.id"
                    >{{ item.code }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </div>
          </template>
          <template v-slot:reportConfig="slotProps">
            <div>
              <div>
                <span>报表配置</span>
              </div>
              <div>
                <div v-for="(item,index) in slotProps.fieldItem.options" :key="index">{{ item }}</div>
              </div>
            </div>
          </template>
        </ComForm>
      </template>
    </ComDrawer>
  </div>
</template>

<script>
import { searchColumns } from "./model.js";
import {POSTCurrencyConfig} from "@/api/settlementManage/feeSet.js"
export default {
  props: {},
  data() {
    return {
      drawerConfig: {
        title: "",
        width: "720px",
        size: "small",
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: this.hide,
          },
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.saveSubmit();
            },
          },
        ],
      },
      searchFormConfig: {
        formModel: {}, // 表单数据
        labelWidth: "85px",
        lists: searchColumns,
      },
      isFormShow: false, // 阻止自动聚焦与表格选择缓存
      dictList:{}//数据字典LIST
    };
  },
  methods: {
    show(row = {},dict={}) {
      this.dictList={
        ...dict
      }
      const {
        customerId,
        customerName,
        businessModel,
        currencyList,
        convertCurrencyList,
      } = row;
      this.searchFormConfig.formModel = {
        customerId,
        customerName,
        businessModel: businessModel ? true : false,
        currencyIdConfig: currencyList.map((e) => e.currencyId),
        convertCurrencyIdConfig: convertCurrencyList.map(
          (e) => e.currencyId
        ),
      };
      this.$refs.myDrawer.show();
      this.$nextTick(() => {
        this.isFormShow = true;
      });
    },
    hide() {
      this.isFormShow = false;
      this.$refs.myDrawer.hide();
    },
    saveSubmit() {
      const submitFormData = this.$refs.formRef.getFormParams();
      const {customerId,currencyIdConfig,convertCurrencyIdConfig,businessModel}=submitFormData
      const params={
        customerId,
        currencyIdConfig,
        convertCurrencyIdConfig,
        businessModel:businessModel?1:0
      }
      this.comRepeatedRequest(this, POSTCurrencyConfig, params).then((res) => {
        this.$emit("handleSuccess");
        this.hide();
      });
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  computed: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.add-cabinet-arrangement {
  .operation-content {
    .iconfont {
      font-size: 13px;
      margin-right: 2px;
    }
  }
  /deep/ .el-drawer {
    .com-detail-top {
      padding: 20px 0 0 0;
      margin: 0 0px 15px;
    }
    .el-table--medium td {
      padding: 7px 0;
    }
    .el-drawer__header {
      display: none;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
  }

  .space-between {
    display: flex;
    justify-content: space-between;
  }
}
</style>
