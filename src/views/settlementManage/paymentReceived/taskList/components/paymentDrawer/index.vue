<template>
  <ComDrawer class="add-drawer" ref="myDrawer" :customDrawer="drawerConfig" :confirmClose="false">
    <template v-slot:content>
      <div>
        <h5>{{['付', '收', '付'][munType]}}款记录</h5>
      </div>
      <div class="form-content">
        <div class="interval" v-for="(item, idx) in payInfos" :key="idx">
          <ComForm
            :ref="`payRecordConfig`"
            :formConfig="getFormConfig(item)"
          >
            <template v-slot:status="slotProps">
              <div class="base-flex-align ellipsis-text">
                <span>{{slotProps.formModel.serialCode || '--'}}</span>
                <span class="tag-blue-color" style="marginLeft: 5px;">
									{{ munType === 2 ? slotProps.formModel.statusName : slotProps.dicsData.nameCn || '--'}}
								</span>
              </div>
            </template>
						
            <template v-slot:money="slotProps">
              <div class="base-flex-align ellipsis-text">
                <span>{{slotProps.formModel.money}}</span>
                <!-- <span class="tag-grey-color">部分核销</span> -->
              </div>
            </template>
          </ComForm>
        </div>
      </div>
    </template>
  </ComDrawer>
</template>

<script>
import { config } from "./model";
import { getPaymentRecord, getCollectionRecord, postPaymentRecord } from "@/api/settlementManage/paymentReceived";
export default {
  props: {
    formModel: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ComDrawer: () => import("_comp/ComDrawer"),
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  computed: {
    // ...mapState(["dictionary"]),
  },
  data() {
    return {
      formConfig: {
        httpRequest: this.submitData, // 表单提交接口
        successFunction: () => {}, // 表单提交成功回调
        size: "small",
        labelWidth: "112px",
        formRules: {}, // 表单校验规则
        visibleAll: true,
      },
      drawerConfig: {
        title: "slot",
        width: "660px",
        size: "small",
        showClose: false,
        wrapperClosable: true,
        footer: [
          {
            text: "关 闭",
            plain: true,
            handleClick: () => {
              this.hide();
            },
          },
        ],
      },
      payInfos: [],
      munType: 0
    };
  },
  methods: {
    async show(id, type) {
			//查询收/付款记录 0: 付款 1: 收款(收付款管理)
			const obj = {
				payment: 0,
				collection: 1,
				writeOffPayment: 2, //  2-财务核销付款
			}
      const mun_type = obj[type]
      this.munType = mun_type;
      [getPaymentRecord, getCollectionRecord, postPaymentRecord][mun_type](id).then((res) => {
        this.payInfos = res.rows || [];
      });
      this.formConfig = {
        ...this.formConfig,
        lists: config(mun_type).lists,
      }
      this.$refs.myDrawer.show();
    },
    hide() {
      this.$refs.myDrawer.hide();
    },
    getFormConfig(row) {
      return {
        ...this.formConfig,
        formModel: {
          ...row
        }
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.add-drawer {
  /deep/ {
    .el-drawer__header {
      display: none;
    }
    .drawer-content {
      padding: 0 20px 10px;
    }
    .my-pagination-container {
      text-align: left;
      padding: 12px 0;
      position: absolute;
      bottom: 0;
    }
    .el-table::before {
      background-color: transparent;
    }
  }
  .com-detail-top {
    padding: 20px 0 0;
    margin-bottom: 20px;
  }
  .form-content {
    .interval {
      margin-top: 20px;
      background-color: #f9f9f9;
    }
  }
}
</style>
