<template>
  <div>
    <ComDialog
      ref="nodeDlgRef"
      :customDialog="dialogConfig"
      :confirmClose="false"
      class="node-dialog-box"
    >
      <template v-slot:content>
        <div>
          <ComForm
            ref="formRef"
            v-if="$refs.nodeDlgRef && $refs.nodeDlgRef.dialogVisible"
            :formConfig="nodeFormConfig"
          >
            <template v-slot:nodeIds="slotProps">
              <el-checkbox-group v-model="slotProps.formModel.nodeIds">
                <el-checkbox
                  v-for="sItem in nodeOptions"
                  :key="sItem.value"
                  :label="sItem.value"
                  :disabled="!sItem.isOptional"
                >
                  {{ sItem.label }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </ComForm>
        </div>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  postSaveOperationNode,
  POSTNodeByClause,
} from "@/api/operateManage/common";
import { nodeCols } from "./model.js";
export default {
  props: {},
  data() {
    return {
      dialogConfig: {
        appendToBody: true,
        title: "业务配置",
        width: "500px",
        footer: [
          {
            text: "确定",
            type: "primary",
            handleClick: () => {
              this.$refs.formRef.submitForm();
            },
          },
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.nodeDlgRef.hide();
            },
          },
        ],
      },
      nodeFormConfig: {
        labelWidth: "68px",
        formRules: {},
      },
      nodeObj: {},
      nodeOptions: [],
      tradeClauseShow: {},
    };
  },
  computed: {
    ...mapGetters(["dictData"]),
  },
  methods: {
    async showNodeDialog(row = {}, nConf) {
      const { handleSuccess } = nConf || {};
      const { operateId, transportMode, ...obj } = row;
      let nodeIds = [];
      const nodeRes = await POSTNodeByClause({
        ...obj,
        operationOrderId: operateId,
      });
      if (
        !Object.keys(this.tradeClauseShow).length &&
        this.dictData.transportMode
      ) {
        this.dictData.transportMode.forEach((item) => {
          this.tradeClauseShow[item.value] = (item.expandVal || "").split(",");
        });
      }
      const showList = this.tradeClauseShow[transportMode];
      console.log("----", showList);
      this.nodeOptions = (nodeRes.data || []).map((e) => {
        if (e.isCheck) {
          nodeIds.push(e.nodeId);
        }
        return {
          label: e.nodeName,
          value: e.nodeId,
          isOptional: e.isOptional,
        };
      });
      this.nodeObj = {
        ...row,
        nodeIds,
      };
      // console.log('nodeRes==', nodeRes)
      this.nodeFormConfig = {
        ...this.nodeFormConfig,
        lists: nodeCols({
          oType: row.orderType,
          tradeHandle: (val) => this._tradeClauseNode({ tradeClause: val }),
          showList,
        }),
        httpRequest: (fData) => {
          // 过滤非当前贸易条款下的节点值（初始选中节点）
          const { tradeClause, nodeIds } = fData;
          const curNodes = nodeIds.filter((e) =>
            this.nodeOptions.some((n) => n.value === e)
          );
          const nodeLists = [];
          this.nodeOptions.forEach((e) => {
            if (e.isOptional && curNodes.includes(e.value)) {
              nodeLists.push(e.value);
            }
          });
          return postSaveOperationNode({
            operationOrderId: this.nodeObj.operateId,
            nodeIds: nodeLists,
            tradeClause,
          });
        },
        formModel: {
          nodeIds,
          tradeClause: row.tradeClause,
        },
        successFunction: () => {
          this.$refs.nodeDlgRef.hide();
          if (handleSuccess) {
            handleSuccess();
          } else {
            this.$emit("handleSuccess");
          }
        },
      };
      this["dictionary/getDictionary"](["tradeClause"]).then(() => {
        this.$refs.nodeDlgRef.show();
        this._tradeClauseNode({ tradeClause: row.tradeClause, isint: true });
      });
    },
    // 改变贸易条款，更新节点数据
    _tradeClauseNode(tVal = {}) {
      const { tradeClause, isint } = tVal;
      const {
        operationOrderType,
        freightType,
        nodeIds = [],
        orderType,
        operateId,
      } = this.nodeObj;
      if (isint) {
        this.$refs.formRef?.setFormModel({ nodeIds });
      } else {
        const selectNodeIds = [];
        POSTNodeByClause({
          operationOrderId: operateId,
          operationOrderType,
          freightType,
          tradeClause,
          orderType,
        }).then((tRes) => {
          this.nodeOptions = (tRes.data || []).map((n) => {
            if (n.isCheck) {
              selectNodeIds.push(n.nodeId);
            }
            return {
              label: n.nodeName,
              value: n.nodeId,
              isOptional: n.isOptional,
            };
          });
          this.$refs.formRef?.setFormModel({ nodeIds: selectNodeIds });
        });
      }
    },
    ...mapActions(["dictionary/getDictionary"]),
  },
  created() {},
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.node-dialog-box {
  /deep/ {
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: #bcbcbc;
      border-color: #bcbcbc;
    }
    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #a5a5a5;
    }
    .el-checkbox {
      margin-right: 30px;
    }
  }
}
</style>
