<template>
  <div>
    <div class="top">
      <div class="title">运价设置</div>
    </div>
    <div class="form-flex">
      <ComForm
        ref="formRef"
        :formConfig="formConfig"
        @handleChange="handleChange"
      >
        <template v-slot:valTip>
          <div class="tip">
            <i class="el-icon-warning-outline"></i
            ><span> * 首重不足按照最小单位计算 </span>
          </div>
        </template>
      </ComForm>
      <!-- <div class="btn">
        <el-button size="mini" type="primary" plain round @click="handleAdd">
          保存
        </el-button>
      </div> -->
    </div>
    <ComTable
      ref="tableRef"
      :columnConfig="tableColumnsLCL"
      :columnData="columnData"
      :rowOperationBtnListFn="rowOperationBtnListFn"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'endValue'">
          <FormSingle
            :formData="slotProps.row"
            :fieldItem="{
              id: slotProps.prop,
              placeholder: slotProps.column.label,
              ...slotProps.column.fieldItem,
              min: slotProps.row.startValue,
            }"
            :disabled="slotProps.rowIndex === columnData.length - 1"
            @handleChange="(val) => handleChangeEnd(val, slotProps.rowIndex)"
          />
        </template>
        <template v-if="slotProps.prop === 'price'">
          <div class="price-flex">
            <FormSingle
              :formData="slotProps.row"
              :fieldItem="{
                placeholder: slotProps.column.label,
                ...slotProps.column.fieldItem,
              }"
              class="price"
            />
            <FormSingle
              :formData="slotProps.row"
              :fieldItem="{
                placeholder:
                  slotProps.column.fieldItem2.placeholder ||
                  slotProps.column.label,
                ...slotProps.column.fieldItem2,
              }"
              class="currency"
            />
          </div>
        </template>
      </template>
    </ComTable>
  </div>
</template>

<script>
import { tableColumnsLCL, formConfig } from "./model";
import { mapState } from "vuex";
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const { freightRateSettingList } = this.formData;
    return {
      tableColumnsLCL,
      columnData: freightRateSettingList || [],
      tableBtn: [
        {
          text: "新增",
          type: "add",
          handleClick: this.handleBtnClick,
        },
        {
          text: "删除",
          type: "delete",
          color: "#ff6767",
          handleClick: this.handleBtnClick,
        },
      ],
      newId: 4,
      currData: {},
      formConfig: {
        formModel: {
          pricingType: this.typeConversion(this.formData.pricingType || 0),
          minBillingValue: this.formData.minBillingValue,
        },
        size: "small",
        labelWidth: "100px",
        ...formConfig,
      },
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  components: {
    ComTable: () => import("_comp/ComTable"),
    FormSingle: () => import("_comp/ComTable/FormSingle"),
    ComForm: () => import("_comp/ComForm"),
  },
  methods: {
    rowOperationBtnListFn(row) {
      const list = this.$refs.tableRef.getNewTableData();
      const len = list.length;
      if (len > 4) {
        return this.tableBtn.filter((item) => item.type !== "add");
      } else if (len === 1) {
        return this.tableBtn.filter((item) => item.type !== "delete");
      }
      return this.tableBtn;
    },
    handleBtnClick(row, btn) {
      switch (btn.type) {
        case "add":
          this.handleAdd(row);
          break;
        case "delete":
          this.handleDelete(row);
          break;
        default:
          break;
      }
    },
    handleDelete(row) {
      const [...list] = this.$refs.tableRef.getNewTableData();
      const index = list.findIndex((item) =>
        row.id ? row.id === item.id : row.newId === item.newId
      );
      if (index > -1) {
        const params = this.$refs.formRef.getFormParams();
        let endValue = params.minBillingValue;
        if (index - 1 >= 0) {
          endValue = list[index - 1].endValue;
        }
        if (index + 1 <= list.length - 1) {
          list[index + 1].startValue = endValue;
        }
        list.splice(index, 1);
        list[list.length - 1].endValue = undefined;
        this.columnData = list;
        this.$refs.tableRef.setNewTableData(list);
      }
    },
    handleAdd(row) {
      this.newId += 1;
      let [...list] = this.$refs.tableRef.getNewTableData();
      const params = {
        temp_only_key: Math.random() + "",
        newId: this.newId,
        startValue: row.endValue,
      };

      if (row.id || row.newId) {
        const index = list.findIndex((item) =>
          row.id ? item.id === row.id : item.newId === row.newId
        );
        list.splice(index + 1, 0, params);
        if (index + 2 <= list.length - 1) {
          list[index + 1].endValue = list[index + 2].startValue;
        }
      } else {
        list.splice(0, 0, params);
      }
      this.columnData = list;
      this.$refs.tableRef.setNewTableData(list);
    },
    handleRules(row) {
      const errMsg = {
        endValue: "请输入结束值",
        price: "请输入单价",
        currencyId: "请选择币别",
      };
      if (!row.price || !row.currencyId) {
        for (let key in errMsg) {
          if (errMsg[key] && !row[key]) {
            return errMsg[key];
          }
        }
      }
    },
    getFormValidate() {
      return this.$refs.formRef.validateAll();
    },
    getTableList() {
      const list = this.$refs.tableRef.getNewTableData();
      const index = list.findIndex((item, index) => {
        if (!item.endValue && index !== list.length - 1) {
          this.$message.error(`第${index + 1}行，请输入结束值！`);
          return true;
        }
        if (!item.price) {
          this.$message.error(`运价设置中第${index + 1}行，请输入单价！`);
          return true;
        }
        if (!item.currencyId) {
          this.$message.error(`运价设置中第${index + 1}行，请选择币别！`);
          return true;
        }
        if (item.endValue && item.startValue > item.endValue) {
          this.$message.error(
            `运价设置中第${index + 1}行，结束值不能小于开始值！`
          );
          return true;
        }
      });
      if (index > -1) {
        return;
      } else {
        const params = this.$refs.formRef.getFormParams();
        return {
          ...params,
          freightRateSettingList: list,
        };
      }
    },
    handleChange(val, prop) {
      console.log(val, prop);
      if (prop === "minBillingValue") {
        const [...list] = this.$refs.tableRef.getNewTableData();
        if (!list.length) {
          this.handleAdd({
            endValue: val,
          });
        } else {
          list[0].startValue = val;
          this.$refs.tableRef.setNewTableData(list);
        }
      }
    },
    handleChangeEnd(val, index) {
      const [...list] = this.$refs.tableRef.getNewTableData();
      list[index + 1].startValue = val;
      this.$refs.tableRef.setNewTableData(list);
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .btn {
    padding: 24px 0 15px;
  }
}
.form-flex {
  display: flex;
  justify-content: space-between;

  /deep/ {
    .el-form-item--small.el-form-item {
      margin-bottom: 12px;
    }
  }
}
.price-flex {
  display: flex;

  .price {
    /deep/ {
      .el-input--mini .el-input__inner {
        border-radius: 4px 0 0 4px;
        border-right: none;
      }
    }
  }
  .currency {
    width: 80px;
    /deep/ {
      .el-input--mini .el-input__inner {
        background: rgba(188, 188, 188, 0.2);
        border-radius: 0px 4px 4px 0px;
        border: 1px solid #bcbcbc;
      }
    }
  }
}
/deep/ {
  .el-form.form-class {
    flex: 1;
  }
  .min-billing {
    flex: 1;
    .el-form-item__content {
      display: flex;
      .base-flex-between {
        width: 100px;
      }
      .tip {
        margin-left: 10px;

        i {
          color: rgba(255, 129, 61, 0.6);
        }
        span {
          color: #bcbcbc;
        }
      }
    }
  }
  .pricing-type {
    width: 300px;
  }
}
</style>
