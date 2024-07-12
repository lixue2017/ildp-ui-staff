<template>
  <div>
    <el-row class="form-row">
      <template v-for="item in formColumns">
        <el-col class="form-col" :span="item.span" :key="item.id">
          <div class="label">
            <div class="label-top" v-if="item.labelTop">
              {{ item.labelTop }}
            </div>
            <div class="label-btm" v-if="item.labelBtm">
              {{ formRule[item.id] ? "*" : "" }}{{ item.labelBtm }}
            </div>
          </div>
          <div class="form-single">
            <template v-if="item.type === 'slot'">
              <div class="form-single-address">
                <template v-for="i in item.list">
                  <FormSingle
                    :key="i.id"
                    :formData="formData"
                    :fieldItem="{
                      ...i,
                    }"
                    :class="i.className"
                    :dictionary="dictionary"
                    size="small"
                    @handleChange="handleChange"
                  />
                </template>
              </div>
            </template>
            <FormSingle
              v-else
              :formData="formData"
              :fieldItem="{
                ...item,
                disabled:
                  item.id === 'encasementWay' &&
                  [3, 4].includes(formData.headTransportMode),
                hideList:
                  item.id === 'outWarehouseWay' &&
                  formData.encasementWay == 1 &&
                  invoiceData.isMainBill !== 7
                    ? [50]
                    : null,
              }"
              :dictionary="dictionary"
              :disabled="item.type === 'txt'"
              size="small"
              @handleChange="handleChange"
            />
          </div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import { formColumns, formRule } from "./model";
import { formatDate } from "@/utils/index.js";
import { mapState } from "vuex";
export default {
  components: {
    FormSingle: () => import("_comp/ComTable/FormSingle"),
  },
  props: {
    invoiceData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      formColumns,
      formRule,
      formData: {
        headTransportMode: undefined,
        encasementWay: 0,
        invoiceDate: formatDate(new Date()),
        tradeTerms: 3, //CIF
      },
    };
  },
  computed: {
    ...mapState(["dictionary"]),
  },
  created() {
    if (this.invoiceData) {
      const { invoiceEcDtoList, tradeTermsId, ...data } = this.invoiceData;
      if (!data.invoiceDate) {
        data.invoiceDate = formatDate(new Date());
      }
      this.formData = {
        ...data,
        tradeTerms: this.typeConversion(tradeTermsId, "number"),
      };
    }
    this.$emit("addRecord", this.formData, true);
  },
  methods: {
    handleChange(val, type) {
      if (type === "headTransportMode") {
        console.log(val);
        if ([3, 4].includes(val)) {
          this.formData.encasementWay = 1;
          this.$emit("handleEncasementWay", 1);
        }
      } else if (type === "encasementWay") {
        this.formData.encasementWay = val;
        this.$emit("handleEncasementWay", val);
      }
      this.$emit("handleChangeForm", { prop: type, val });
      this.$emit("addRecord", this.formData);
    },
    handleSubmit() {
      console.log(this.formData);
      return new Promise((resolve, reject) => {
        for (let k in this.formRule) {
          if (!this.formData[k] && this.formData[k] !== 0) {
            this.$message.error(this.formRule[k]);
            return reject();
          }
        }
        resolve(this.formData);
      });
    },
    setHistoryRecord(data) {
      this.formData = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.form-row {
  border-left: 1px solid #e2e2e2;
}
.form-col {
  display: flex;
  height: 52px;
  border-top: 1px solid #e2e2e2;
  .label {
    width: 180px;
    line-height: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #f8f8f8;
    border-right: 1px solid #e2e2e2;

    .label-top {
      color: #696969;
    }
    .label-btm {
      color: #5094ff;
    }
  }
  .form-single {
    line-height: 32px;
    flex: 1;
    padding: 10px 20px 0 15px;
    border-right: 1px solid #e2e2e2;

    /deep/ {
      .el-select,
      .el-date-editor.el-input {
        width: 100%;
      }
    }
    .form-single-address {
      display: flex;

      .country {
        width: 130px;

        /deep/ {
          .el-input__inner {
            border-right: none;
            border-radius: 4px 0 0 4px;
          }
        }
      }
      .address {
        flex: 1;

        /deep/ {
          .el-input__inner {
            border-radius: 0 4px 4px 0;
          }
        }
      }
    }
  }
}
</style>
