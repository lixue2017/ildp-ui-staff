<template>
  <div class="remark-box">
    <div class="operate-btn">
      <div class="title">{{ overseaLangObj.nky_cz || "您可以操作" }}</div>
      <el-row :gutter="14">
        <template v-for="item in btnList">
          <el-col :span="item.span" :key="item.id">
            <!-- <el-dropdown
                v-if="item.btnType === 'dropdown'"
                trigger="click"
                placement="bottom"
                style="width: 100%"
              >
                <el-button size="small" :disabled="item.disabled" plain>
                  {{ item.text }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="dItem in item.dropdownArr"
                    :key="dItem.value"
                    @click.native="handleBtnClick(item, dItem)"
                    >{{ dItem.name }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown> -->
            <el-button
              size="small"
              :disabled="item.disabled"
              @click="handleBtnClick(item)"
              plain
              >{{ item.text }}</el-button
            >
          </el-col>
        </template>
      </el-row>
    </div>
    <div class="operate-data" v-if="nameArr && nameArr.length">
      <div class="operate-data-item" v-for="(n, i) in nameArr" :key="`n_${i}`">
        <span class="label">
          {{ n.label ? n.label : n.eLabel }}
        </span>
        <span class="label-item">{{ formData[n.nameKey] || "--" }}</span>
      </div>
    </div>
    <div>
      <ComForm ref="remarkRef" :formConfig="basicFormConfig" />
      <div class="base-flex-end">
        <el-button type="primary" @click="saveRemark" size="small" v-throttle>
          {{ overseaLangObj.bc_bz || "保存备注" }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { submitLogSystemLog } from "@/api/performance/record.js";
import { httpDictRequest } from "@/api/performance/dictRecord.js";
import { formRemarksCols } from "./model";

export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    btnList: {
      type: Array,
      default: () => [],
    },
    nameArr: {
      type: Array,
      default: () => [
        {
          nameKey: "operatorName",
          label: "操作员：",
          eLabel: "海外操作员：",
        },
        {
          nameKey: "fileMemberName",
          label: "文件员：",
          eLabel: "长沙操作员：",
        },
      ],
    },
  },
  data() {
    return {
      basicFormConfig: {
        formModel: {},
        labelPosition: "top",
        labelWidth: "90px",
        lists: formRemarksCols({ colsKey: "customs" }),
      },
    };
  },
  methods: {
    saveRemark() {
      // 保存备注
      const { customsClearanceRemark } =
        this.$refs.remarkRef?.getFormModelVal();
      const { isOverseaOrders, joinOrderId, id, operationOrderNo } =
        this.formData || {};
      // const { name } = this.$store.getters;
      // submitLogSystemLog({
      //   moduleName: isOverseaOrders == 0 ? 20 : 120,
      //   businessId: isOverseaOrders == 0 ? joinOrderId : id,
      //   businessNo: operationOrderNo,
      //   serviceName: 2,
      //   type: 10,
      //   remark: customsClearanceRemark,
      //   createBy: name,
      //   updateBy: name,
      // }).then(() => {
      //   this.msgSuccess(this.overseaLangObj.cz_cg || "备注保存成功");
      // });

      httpDictRequest(
        {
          pageRemarkNameKey: isOverseaOrders == 1 ? "HWDDQGBZ" : "DSDDQGBZ",
          requestKey: "postAddBusinessRemark",
        },
        {
          remark: customsClearanceRemark,
          businessId: isOverseaOrders == 1 ? id : joinOrderId,
        }
      ).then(() => {
        this.msgSuccess(this.overseaLangObj.cg_tip("备注保存成功"));
      });
    },
    handleBtnClick(rItem) {
      this.$emit("handleBtnClick", rItem);
    },
  },
  created() {
    this.basicFormConfig.formModel = {
      ...this.formData,
    };
  },
  components: {
    ComForm: () => import("_comp/ComForm"),
  },
};
</script>

<style lang="scss" scoped>
.operate-btn {
  border-bottom: 1px solid #e2e2e2;
  .title {
    font-size: 14px;
    font-weight: 700;
    margin: 25px 0 10px;
    color: #515151;
  }
  .el-button {
    width: 100%;
    white-space: normal;
    margin-bottom: 10px;
    color: #515151;
    border-color: transparent;
    box-shadow: 0px 0px 3px 0px rgba(203, 203, 203, 0.7);
    border-radius: 4px;
    &:hover {
      color: #5094ff;
      border-color: #5094ff;
    }
  }
}
.remark-box {
  margin-top: 44px;
  .operate-data {
    padding: 10px 0 10px;
    border-bottom: 1px solid #e2e2e2;
    .operate-data-item:not(:last-child) {
      margin-bottom: 5px;
    }
    .label {
      color: #8b8b8b;
    }
    .label-item {
      color: #515151;
    }
  }
}
</style>
