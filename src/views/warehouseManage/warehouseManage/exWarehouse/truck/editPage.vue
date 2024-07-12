<template>
  <div class="app-container" v-if="isInitRes">
    <ComDetailTop title="卡车出库" :config="{}" ref="detailTopRef" />
    <ComForm ref="editFormRef" :formConfig="editFormConfig">
      <!-- <template v-slot:slotPsd="slotProps">
        <span>{{ slotProps.formModel.nameCn || '--' }}</span>
        <span class="tag-green-color">私人仓</span>
      </template> -->
      <template v-slot:slotPsd>
        <i class="el-icon-location-outline"></i>
        <span>{{ totalList[0] ? totalList[0].detailsAddr : "--" }}</span>
      </template>
      <template v-slot:slotPsqd>
        {{ totalList[0] ? totalList[0].tname : "--" }}
      </template>
    </ComForm>
    <template v-for="(ele, idx) in [0, 1]">
      <div class="footer-btn" :key="`title${idx}`">
        <span class="table-tit-txt">{{ tableList[idx].title }}</span>
        <!-- <span>Baosen Ref：NL21041/A142, NL21043/A145</span> -->
      </div>
      <ComTable
        :ref="`tableConfig${idx}`"
        :tableHeight="tableConfig.tableHeight"
        :columnConfig="tableList[idx].columnConfig"
        :columnData="tableList[idx].columnData"
        :paginationConfig="{ limit: 999 }"
        :pagination="false"
        :key="`table${idx}`"
        rowKey="freightId"
      >
        <template v-slot:customRow="{ slotProps }">
          <template v-if="slotProps.prop === 'operation'">
            <!-- 至少保留一个 -->
            <template
              v-if="
                tableList[0].columnData.length +
                  tableList[1].columnData.length <=
                1
              "
            >
              --
            </template>
            <div v-else class="operation-content-btn">
              <template v-for="(item, index) in tableConfig.statusBtnList">
                <el-button
                  :key="index"
                  size="small"
                  type="text"
                  @click="item.handleClick(slotProps.row, idx)"
                  >{{ item.text }}</el-button
                >
              </template>
            </div>
          </template>
        </template>
      </ComTable>
    </template>
    <!-- <div class="footer-btn">
      <span class="table-tit-txt">待入仓</span>
    </div>

    <ComTable
      :ref="`tableRef`"
      :tableHeight="tableConfig.tableHeight"
      :columnConfig="tableConfig.columnConfig"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="tableConfig.getQueryParams"
      :paginationConfig="{ limit: 999 }"
      :pagination="false"
      :columnData="tableList"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'operation'">
          <template v-if="tableList.length <= 1"> -- </template>
          <div v-else class="operation-content-btn">
            <template v-for="(item, index) in tableConfig.statusBtnList">
              <el-button
                :key="index"
                size="small"
                type="text"
                @click="item.handleClick(slotProps.row)"
                >{{ item.text }}</el-button
              >
            </template>
          </div>
        </template>
      </template>
    </ComTable>

    <div class="footer-btn">
      <span class="table-tit-txt">已入仓</span>
    </div>

    <ComTable
      :ref="`tableRef`"
      :tableHeight="tableConfig.tableHeight"
      :columnConfig="tableConfig.columnConfig"
      :httpRequest="tableConfig.httpRequest"
      :getQueryParams="tableConfig.getQueryParams"
      :paginationConfig="{ limit: 999 }"
      :pagination="false"
      :columnData="tableList"
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'operation'">
          <template v-if="tableList.length <= 1"> -- </template>
          <div v-else class="operation-content-btn">
            <template v-for="(item, index) in tableConfig.statusBtnList">
              <el-button
                :key="index"
                size="small"
                type="text"
                @click="item.handleClick(slotProps.row)"
                >{{ item.text }}</el-button
              >
            </template>
          </div>
        </template>
      </template>
    </ComTable> -->

    <addDrawerOrder ref="addDrawerRef" @handleCheckClick="addTableClick" />

    <div class="base-flex-between footer-btn">
      <el-button
        type="primary"
        @click="addContainerEvt"
        v-if="!isSee"
        class="add-btn"
      >
        <i class="el-icon-plus"></i>
        添 加
      </el-button>
      <div v-else></div>
      <div>
        <el-button type="primary" v-if="!isSee" @click="submitForm">
          保 存
        </el-button>
        <el-button type="info" @click="cancelEvt">
          {{ isSee ? "返 回" : "取 消" }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTruckFreightList,
  exwarehouseTruckPost,
  updateExwarehouseTruck,
} from "@/api/warehouse/manage";
import { truckRecordDetails } from "@/api/warehouse/process";
import { mapActions } from "vuex";
import { editFormColumns, editFormRules, editTableColumns } from "./model";
import addDrawerOrder from "./addDrawer.vue";
export default {
  data() {
    return {
      editFormConfig: {
        formModel: {},
        httpRequest: this.editFormSubmit, // 表单提交接口
        successFunction: () => {
          this.msgSuccess("保存成功");
          this.cancelEvt();
        }, // 表单提交成功回调
        size: "small",
        labelWidth: "85px",
        formRules: editFormRules,
      },
      tableConfig: {
        tableHeight: "280px",
        httpRequest: () => {},
        statusBtnList: [
          {
            text: "移除",
            handleClick: this.handleDelete,
          },
        ],
      },
      tableList: [
        {
          title: "待入仓",
          columnConfig: editTableColumns(),
          columnData: [],
        },
        {
          title: "已入仓",
          columnConfig: editTableColumns(),
          columnData: [],
        },
      ],
      isSee: false,
      isInitRes: false, // 是否完成初始化
      totalList: [],
      listIds: [],
    };
  },
  methods: {
    // 提交表单
    submitForm() {
      const rows = [
        ...this.tableList[0].columnData,
        ...this.tableList[1].columnData,
      ];
      if (rows.length) {
        this.$refs.editFormRef?.submitForm();
      } else {
        this.msgError("请添加订单");
      }
    },
    editFormSubmit(formModel) {
      const { id } = this.$route.query;
      const rows = [
        ...this.tableList[0].columnData,
        ...this.tableList[1].columnData,
      ];
      const { amazonId, scheduledTime, warehouseId } = formModel;
      const { nation, tname, targetWarehouseId } = rows[0];
      const { warehouse } = this.$route.query;
      const currIds = {};
      const opt = {
        warehouseId: warehouse || warehouseId,
        tWarehouseTruck: {
          id,
          amazonId,
          scheduledTime,
          nation,
          tname,
          targetWarehouseId,
          status: 5, //  5 运输中
        },
        warehouseTruckRecord: rows.map((e) => {
          const {
            id: orderId,
            freightId,
            number,
            markStatus,
            productTotal,
            receivingCode,
            detailsAddr,
            volume,
            weight,
            storageId,
          } = e;
          currIds[storageId] = true;
          return {
            orderNumber: number,
            orderId,
            freightId,
            markStatus,
            boxCount: productTotal,
            receivingDes: receivingCode,
            address: detailsAddr,
            volume,
            weight,
            storageId,
          };
        }),
      };
      if (id) {
        const removeStorageIds = [];
        this.listIds.forEach((i) => {
          if (!currIds[i]) {
            removeStorageIds.push(i);
          }
        });
        opt.removeStorageIds = removeStorageIds.join(",");
        return updateExwarehouseTruck(opt);
      } else {
        return exwarehouseTruckPost(opt);
      }
    },
    handleDelete(row = {}, index) {
      const rows = this.tableList[index].columnData.filter(
        (e) => e.freightId !== row.freightId
      );
      this.$set(this.tableList[index], "columnData", rows);
      this.$nextTick(() => {
        this.$refs[`tableConfig${index}`][0].refreshTable();
      });
    },
    addTableClick(arr) {
      const ids = [];
      const freightIds = [];
      arr.map((e) => {
        ids.push(e.id);
        freightIds.push(e.freightId);
      });
      this.getTableList(ids.join(","), freightIds.join(","));
    },
    addContainerEvt() {
      const rows = [
        ...this.tableList[0].columnData,
        ...this.tableList[1].columnData,
      ];
      const { detailsAddr } = this.totalList[0];
      this.$refs.addDrawerRef?.show([...rows], detailsAddr);
    },
    getTableList(justIds, addrList) {
      const { detailsAddr } = this.$route.query;
      const opt = {
        pageNum: 1,
        pageSize: 999,
        justIds,
        addrList,
        detailsAddr,
      };
      getTruckFreightList(opt).then((res) => {
        const waitTruck = [];
        const truck = [];
        this.listIds = [];
        res.rows.forEach((item) => {
          this.listIds.push(item.storageId);
          if (item.freightStatus === -1) {
            waitTruck.push(item);
          } else {
            truck.push(item);
          }
        });
        const list = {
          0: waitTruck,
          1: truck,
        };
        [0, 1].forEach((i) => {
          this.tableList[i].columnData = [...list[i]];
          this.$refs[`tableConfig${i}`] &&
            this.$refs[`tableConfig${i}`][0]?.setNewTableData(list[i]);
        });
        this.totalList = res.rows;
      });
    },
    cancelEvt() {
      this.$refs.detailTopRef?.comReBack();
    },
    ...mapActions(["dictionary/getDictionary", "tagsView/delView"]),
  },
  components: {
    addDrawerOrder,
    ComForm: () => import("_comp/ComForm"),
    ComTable: () => import("_comp/ComTable"),
    ComDetailTop: () => import("_comp/ComDetailTop"),
  },
  created() {
    const { justIds, id, isSee, addrList } = this.$route.query;
    this.isSee = isSee;
    this.editFormConfig = {
      ...this.editFormConfig,
      lists: editFormColumns(isSee),
    };
    this.tableConfig = {
      ...this.tableConfig,
      columnConfig: editTableColumns(isSee),
    };
    this["dictionary/getDictionary"]("exWarehouseDict").then(() => {
      if (id) {
        truckRecordDetails(id).then((res) => {
          const {
            amazonId,
            scheduledTime,
            nation,
            tname,
            warehouseId,
            orderIds,
            addrList = [],
          } = res.data;
          this.editFormConfig.formModel = {
            warehouseId,
            amazonId,
            scheduledTime,
            nation,
            tname,
          };
          this.getTableList(orderIds.join(","), addrList.join(","));
          this.isInitRes = true;
        });
      } else {
        this.getTableList(justIds, addrList);
        this.isInitRes = true;
      }
    });
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-container .com-detail-top {
  padding-left: 0;
  margin-bottom: 20px;
}
.footer-btn {
  padding: 15px 0 18px;
}
.table-tit-txt {
  font-size: 14px;
  margin-right: 30px;
}
</style>
