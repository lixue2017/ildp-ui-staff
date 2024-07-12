<template>
  <div>
    <ComDialog
      ref="customDialog"
      :customDialog="customDialogConfig"
      :confirmClose="confirmClose"
      class="airline-dialog"
    >
      <template v-slot:content>
        <div
          v-for="(item, ItemIndex) in cabinetList"
          :key="ItemIndex"
          class="check-in"
        >
          <div class="title">
            <span>
              柜型：<span class="bolder">{{ item.boxModelCode }}</span>
            </span>
            <span>
              数量：<span class="bolder">{{ item.boxNum || 0 }}</span>
            </span>
          </div>
          <div class="box-list">
            <div
              :class="[
                'box',
                eles.selected ? 'selected-box' : '',
                eles.disabled ? 'disabled-box' : '',
              ]"
              v-for="(eles, index) in item.data"
              :key="index"
              @click="handleSelect(eles)"
            >
              <span>{{ eles.boxModelCode }}</span>
              <span>{{ eles.sono }}</span>
              <img
                v-show="eles.selected"
                class="selected-icon"
                src="@/assets/image/box_selected.png"
                alt=""
              />
            </div>
            <div class="box-add" @click="handleAdd(item)" v-if="item.showAdd">
              <div class="add-icon"></div>
              <span>补充So No</span>
            </div>
            <el-input
              class="input-box"
              ref="inputBox"
              v-else
              v-model="item.soNo"
              placeholder="请输入So No."
              @change="handleInput($event, item)"
              @blur="handleBlur($event, item)"
            ></el-input>
          </div>
        </div>
      </template>
    </ComDialog>
  </div>
</template>

<script>
import {
  getForBookingList,
  getSoNoList,
  addSoNoCheckIn,
  soNoCheckIn,
  editSoNoCheckIn,
} from "@/api/marketManage/airline";
import {
  sonoCheck,
  addSono,
  getSonoGroupBoxModelList,
} from "@/api/marketManage/airline.js";
import { comSaveRepeatedRequest } from "@/api/common";
export default {
  components: {
    ComForm: () => import("_comp/ComForm"),
    ComDialog: () => import("_comp/ComDialog"),
    CheckInDialog: () => import("../CheckInDialog"),
  },
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    isOnlySoNo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      confirmClose: false,
      customDialogConfig: {
        title: "So No.登记",
        width: "480px",
        appendToBody: this.appendToBody,
        footer: [
          {
            text: "取消",
            plain: true,
            handleClick: () => {
              this.$refs.customDialog.handleClose();
              this.$emit("close");
            },
          },
          ...(!this.isOnlySoNo
            ? [
                {
                  text: "上一步",
                  type: "primary",
                  handleClick: () => {
                    this.$refs.customDialog.handleClose();
                  },
                },
              ]
            : []),
          {
            text: "确 认",
            type: "primary",
            hide: this.appendToBody,
            handleClick: () => {
              this.submitData();
            },
          },
        ],
      },
      cabinetList: [],
      reqsParams: {},
    };
  },
  methods: {
    show(params, isEdit) {
      this.cabinetList = [];
      if (params.operationType) {
        this.reqsParams = params;
        this.getList(params.orderNo);
        this.$refs.customDialog.show();
      } else {
        this.reqsParams = params;
        this.oldId = params.boxModelId;
        this.isEdit = isEdit;
        this.getList();
        this.$refs.customDialog.show();
      }
    },
    getList() {
      // console.log("数据源", this.reqsParams);
      var orderId = this.reqsParams.operationOrderIds;
      //操作单返回的是一个NUMBER类型的操作单ID
      if (typeof this.reqsParams.operationOrderIds === "string") {
        //待订舱拼柜返回了多个字符串拼接的操作单ID，取其中一个传给后端
        orderId = this.reqsParams.operationOrderIds.split(",")[0];
      }
      let paramsObj = {
        // id: "",
        routeNoManageId: this.reqsParams?.routeId,
        // boxModelId: [this.reqsParams?.boxModelId],
        // sono: "",
        orderId: orderId,
        // sortBoxId: "",
        // type: this.reqsParams?.bookType+',0',
      };
      //没字段就删除字段，不然接口会报错
      if (!paramsObj.id) {
        delete paramsObj.id;
      }
      if (!paramsObj.sono) {
        delete paramsObj.sono;
      }
      if (!paramsObj.sortBoxId) {
        delete paramsObj.sortBoxId;
      }
      const tempList = JSON.parse(JSON.stringify(this.cabinetList));
      getSonoGroupBoxModelList(paramsObj).then((res) => {
        // console.log(paramsObj)
        // console.log(res)
        const data = res.rows || [];
        data.forEach((item) => {
          // item.count = item.data.length;
          item.showAdd = true;
          const selectObj =
            tempList.find((e) => item.boxModelId === e.boxModelId) || {};
          (item.data || []).forEach((result) => {
            result.selected = (selectObj.data || []).some(
              (s) => result.id === s.id && s.selected
            ); // 新增后选中已勾选项
            result.disabled = result.orderId !== null ? true : false;
          });
        });
        // console.log("处理好的数据", data);
        this.cabinetList = data;
      });
    },
    hide() {
      this.$refs.customDialog.hide();
    },
    handleSelect(eles) {
      if (eles.disabled) return;
      eles.selected = !eles.selected;
    },
    handleAdd(item) {
      item.showAdd = !item.showAdd;
      // if (!item.showAdd) {
      //   this.$refs.inputBox.focus();
      // }
    },
    handleBlur(e, item) {
      item.showAdd = !item.showAdd;
    },
    handleInput(e, item) {
      item.showAdd = !item.showAdd;
      item.soNo = "";
      const { routeId } = this.reqsParams;
      const { boxModelId } = item;
      var orderId = this.reqsParams.operationOrderIds;
      //操作单返回的是一个NUMBER类型的操作单ID
      if (typeof this.reqsParams.operationOrderIds === "string") {
        //待订舱拼柜返回了多个字符串拼接的操作单ID，取其中一个传给后端
        orderId = this.reqsParams.operationOrderIds.split(",")[0];
      }
      const params = {
        routeNoManageId: routeId, //航次id
        sono: e, //sono号
        orderId: orderId, //操作单id
        boxModelId: boxModelId, //柜型id
      };
      addSono(params).then((res) => {
        const index = this.cabinetList.findIndex(
          (item) => item.boxModelId === boxModelId
        );
        if (index > -1) {
          this.cabinetList[index].data.push({
            id: res.data,
            selected: true,
          });
        }
        this.getList();
      });
      // addSoNoCheckIn(params).then(() => {
      //   this.getList();
      // });
    },
    submitData() {
      let sonoIds = [];
      let sono = [];
      this.cabinetList.forEach((fs) => {
        if (fs.data.length) {
          fs.data.forEach((se) => {
            if (se.selected) {
              sonoIds.push(se.id);
              sono.push(se.soNo);
            }
          });
        }
      });
      const flag = this.cabinetList.every((fs) => {
        const selectedList = fs.data.filter((item) => item.selected === true);
        return Number(fs.boxNum || 0) === selectedList.length;
      });
      if (!flag) {
        this.$message.error("选择数量与柜型数量不一致！");
        return;
      }

      const { type, routeId, orderNo, id, operationOrderIds, code } =
        this.reqsParams;
      let params;

      var orderId = this.reqsParams.operationOrderIds;
      if (typeof this.reqsParams.operationOrderIds === "string") {
        orderId = this.reqsParams.operationOrderIds.split(",")[0];
      }
      params = {
        orderId: orderId, //操作单id
        sonoId: sonoIds, //sonoId
      };
      console.log("params", params);
      let reqs = sonoCheck;
      if (this.isEdit) {
        reqs = editSoNoCheckIn;
      }
      comSaveRepeatedRequest(reqs, params).then(() => {
        this.$message.success("登记成功");
        this.hide();
        this.$emit("close", "refresh");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.airline-dialog {
  /deep/ {
    .el-radio {
      margin-right: 10px;
    }
    .el-dialog__body {
      padding: 0px 40px 30px;
    }
  }
  .check-in {
    font-size: 13px;
    font-weight: 400;
    color: #8b8b8b;
    background: #fbfbfb;
    border-radius: 4px;
    padding: 14px 0 18px;
    margin-top: 20px;
    .title > span {
      margin-left: 20px;
    }
    .box-list {
      margin-top: 4px;
      overflow: hidden;
      .box,
      .box-add {
        width: 110px;
        height: 51px;
        background: #fcfcfc;
        border-radius: 4px;
        border: 1px solid #a5a5a5;
        margin: 12px 0 0 18px;
        float: left;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
        color: #515151;
      }
      .box:hover {
        border: 1px solid #5094ff;
        cursor: pointer;
      }
      .box-add {
        background: rgba(80, 148, 255, 0.1);
        border: 1px solid #5094ff;
        flex-direction: row;
        align-items: center;
        color: #5094ff;
        .add-icon {
          width: 14px;
          height: 14px;
          background: url("~@/assets/image/box_add.png") center center no-repeat;
          margin-right: 3px;
        }
      }
      .box-add:hover {
        background: rgba(80, 148, 255, 0.2);
      }
      .selected-box {
        border: 1px solid #5094ff;
        position: relative;
        .selected-icon {
          position: absolute;
          right: 0;
          top: 0;
          width: 28px;
        }
      }
      .disabled-box {
        background: rgba($color: #bcbcbc, $alpha: 0.2);
        border: 1px solid rgba($color: #a5a5a5, $alpha: 0.3);
        color: rgba($color: #515151, $alpha: 0.3);
      }
      .disabled-box:hover {
        border: 1px solid rgba($color: #a5a5a5, $alpha: 0.3);
      }
      .input-box {
        width: 110px;
        height: 51px;
        font-size: 13px;
        margin: 12px 0 0 18px;
      }
      /deep/.input-box.el-input--medium .el-input__inner {
        width: 100%;
        height: 100%;
      }
    }
  }
  .bolder {
    font-weight: 500;
    color: #515151;
  }
}
</style>
