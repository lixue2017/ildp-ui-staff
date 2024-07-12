import {
  customer,
  supplier,
  subsidiary,
  staff,
  staffDialogCols,
  departDialogCols,
  enterpriseConfig,
} from "../components/model.js";
import { mapActions, mapState } from "vuex";
import {
  modifyCustStatus,
  openAccount,
  updateStaffList,
  delCustomer,
  getStaffDetail,
  getRoleList,
} from "@/api/customerManage/customerList.js";
import { msgBox } from "@/utils/confirmBox.js";
import { POSTFreeze, POSTUnFreeze } from "@/api/customerManage/customerList.js";
import { hasBtnPermits } from "@/directive/permission/hasPermi.js";
export default {
  //客户  供应商（服务商）  子公司（堡森）  员工（个人）
  data() {
    return {
      searchFormConfig: {
        formModel: {},
        httpRequest: (formModel) => {
          return new Promise((resolve) => {
            this.getCustomerList(formModel);
            resolve();
          });
        }, // 表单提交接口
        searchForm: true,
        fold: true,
        size: "small",
        labelWidth: "100px",
        formRules: {},
      },
      searchFromData: [],
      showSearchForm: false,
      type: "",
      submitStatus: undefined,
      footer: [
        {
          text: "保 存",
          type: "primary",
          showStatus: ["add", "edit"],
          handleClick: () => {
            this.submitStatus = 0;
            this.submitDialog();
          },
        },
        {
          text: "保存并启用",
          type: "primary",
          showStatus: ["add"],
          handleClick: () => {
            this.submitStatus = 4;
            this.submitDialog();
          },
        },
        {
          text: "取消",
          plain: true,
          showStatus: ["add", "edit"],
          handleClick: () => {
            const that = this.$refs.customDialogRef;
            that.$refs.customDlgRef.hide();
          },
        },
      ],
    };
  },
  computed: {
    ...mapState(["dictionary", "customer"]),
  },
  activated() {
    this.keepTableList(false);
  },
  created() {
    Promise.all([
      getRoleList(),
      this["dictionary/getDictionary"]("custTypeEn"),
    ]).then(([roleRes]) => {
      this.roleList = roleRes.data || [];
      this.showSearchForm = true;
    });
  },
  methods: {
    ...mapActions(["dictionary/getDictionary"]),
    getSearchCols(tName) {
      //获取表单COLS
      this.type = tName;
      const formLists = {
        2: customer(
          this.roleList.map((item) => ({
            value: item.roleId,
            label: item.roleName,
          }))
        ),
        3: supplier,
        0: subsidiary,
        9: staff,
        21: enterpriseConfig,
      };
      const { formLists: lists, fold, searchNum } = formLists[tName];
      return {
        ...this.searchFormConfig,
        lists,
        fold,
        searchNum,
      };
    },
    getStatusList(row, type) {
      //根据客户状态和账号状态获取操作按钮
      const { status, userStatus, state, apiType } = row;
      const nStatus = type ? `${status}${userStatus}` : status;
      const { activeName } = this.tabsConfig;
      let statusList = this.statusList.filter(
        (e) =>
          (e.status ? e.status.includes(nStatus) : true) &&
          (e.configStatus ? e.configStatus.includes(state) : true) &&
          (e.showTabName ? e.showTabName.includes(activeName) : true) &&
          (e.showApiType ? e.showApiType.includes(apiType) : true)&&
          (e.hasPermission?hasBtnPermits(e.hasPermission):true)
      );
      return statusList;
    },
    getCustomerList(searchFrom = {}) {
      const { activeName } = this.tabsConfig;
      this.searchFromData[activeName] = {
        ...searchFrom,
        beginTime: searchFrom.beginTime && searchFrom.beginTime.join("@"),
        status: searchFrom.status && searchFrom.status.join(","),
        userStatus: searchFrom.userStatus,
        level: searchFrom.level && searchFrom.level.join(","),
        roleIds: searchFrom.roleIds && searchFrom.roleIds.join(","),
      };
      this.keepTableList(true);
    },
    getQueryParams(tName) {
      const { status, ...searchParams } = this.searchFromData[tName] || {};
      return {
        ...searchParams,
        status: tName == 2 ? undefined : status || this.status,
        isQueryFirstDept: this.isQueryFirstDept,
      };
    },
    handleUpdate(row, type) {
      //修改
      this.$refs.editDrawer.show(row, type);
    },
    handleSubmitStatus(rows) {
      //提交
      if (rows.id) {
        const title = "提示";
        const className = "el-icon-info text-info";
        const msg = `确定提交审核？`;
        msgBox(this, { title, className, msg, showCancelButton: true }, () => {
          modifyCustStatus({ id: rows.id, status: "1" }).then(() => {
            this.$message.success("提交成功");
            this.keepTableList();
          });
        });
      }
    },
    handleDelete(rows) {
      //删除
      this.$refs.confirmDialog.delete().then(() => {
        delCustomer(rows.id).then(() => {
          this.$message.success("删除成功");
          this.keepTableList();
        });
      });
    },
    handleSuccess(formModel, type) {
      if (formModel) {
        // 点击保存并补充
        this.$refs.perfectDrawer.show(formModel, type);
      }
      this.keepTableList(true);
    },
    handleVerify(rows) {
      //审核
      if (rows.id) {
        this.$refs.confirmDialog.handleFormDialog("verify", {
          httpRequest: this.handleVerifyApi,
          successMessage: "审核成功",
          successFunction: () => {
            setTimeout(() => {
              this.keepTableList();
            }, 1000);
          },
          formModel: {
            nameCn: rows.nameCn,
            nickName: rows.userNickName,
            status: 3,
            id: rows.id,
          },
        });
        this.$refs.confirmDialog.handleChange(3, "status");
      }
    },
    handleVerifyApi(form) {
      const { status } = form;
      const params = {
        ...form,
        status: status == 3 && this.type == "9" ? "4" : status, // status:3-通过  2-驳回  如果是在员工列表选择的通过则传4  4为已启用 5为已停用，只有员工列表有4，5这两个状态
      };
      return new Promise((resolve) => {
        modifyCustStatus(params);
        resolve(form);
      });
    },

    handleOpenAccount(rows) {
      //开通账号
      if (rows.id) {
        this.$refs.confirmDialog.handleFormDialog("openAccount", {
          httpRequest: (formModel) => {
            return new Promise((resolve) => {
              openAccount({ ...formModel });
              resolve();
            });
          },
          successMessage: "开通成功",
          successFunction: () => {
            return setTimeout(() => {
              this.keepTableList();
            }, 1000);
          },
          formModel: {
            id: rows.id,
            loginName: "",
            password: "",
          },
        });
      }
    },
    handleEnable(rows) {
      //启用账号,目前只有员工列表用到禁用
      const { id, status } = rows;
      const params = {
        id,
        status: "4",
        actionType: "S",
      };
      this.$refs.confirmDialog.enable().then(() => {
        updateStaffList(params).then((res) => {
          this.$message.success("启用成功");
          this.keepTableList();
        });
      });
    },
    handleDisable(row = {}) {
      //禁用账号,目前只有员工列表用到禁用
      const { id } = row;
      // const params = {
      //   id,
      //   status: "5",
      //   actionType: "S",
      // };
      // this.$refs.confirmDialog.disable().then(() => {
      //   updateStaffList(params).then((res) => {
      //     this.$message.success("禁用成功");
      //     this.keepTableList();
      //   });
      // });
      this.$refs.customDialogRef?.showCustomDialog({
        customFormConfig: departDialogCols(),
        formModel: {
          id,
          status: "5",
          actionType: "S",
        },
        httpRequest: (formModel) => {
          return updateStaffList(formModel);
        },
        successFunction: () => {
          this.$message.success("禁用成功");
          this.keepTableList();
        },
      });
    },
    handleDetails(row, ids) {
      const { id } = row;
      const idList =
        ids ||
        this.$refs[
          `customerTable${+this.tabsConfig.activeName}`
        ][0].tableData.map((item) => item.id);
      this.$router.push({
        path: "/enterprise/custDetails",
        query: {
          id,
          backPath: this.$route.path,
          pageSign: idList.join(","), // 详情显示上一页/下一页
          listType: this.type == 21 ? 2 : this.type, //企业管理四个列表数据可能有多个身份，如果某条数据有两个身份从哪个列表进入详情就按哪个身份展示详情
        },
      });
    },
    submitDialog() {
      const that = this.$refs.customDialogRef;
      if (that.customConfig.confirmCheckFunction) {
        // 先校验，后保存
        that.customConfig.confirmCheckFunction(() => {
          that.$refs.formRef?.submitForm();
        });
      } else {
        that.$refs.formRef?.submitForm();
      }
    },
    handleStaffAdd(row = {}, type) {
      //仅员工列表新增
      const footer = this.footer.filter((e) => {
        return e.showStatus.includes(type);
      });
      const { status } = row;
      this.$refs.customDialogRef.showCustomDialog({
        customFormConfig: staffDialogCols(
          {
            handleChange: this.handleChangeStaff,
            handleGetSearchOptions: this.handleChangeStaff(row.relationUserId),
            id: row.relationUserId,
          },
          type
        ),
        formModel: {
          relationUserId: row.relationUserId,
          remark: row.remark,
          entryTime: row.entryTime,
        },
        httpRequest: (formModel) => {
          return updateStaffList({
            ...formModel,
            status:
              status == 4 || type == "edit" ? undefined : this.submitStatus,
            actionType: type == "add" ? "A" : "U",
            id: type == "add" ? undefined : row.id,
          });
        },
        successFunction: this.keepTableList,
        footer: footer,
      });
    },
    handleChangeStaff(id) {
      //手动选择员工或初始化带出数据
      if (id) {
        getStaffDetail(id).then((res) => {
          const { businessOwnershipName, status, dept, businessOwnership } =
            res.data;
          this.$refs.customDialogRef?.setDlgFormModel({
            businessOwnershipName,
            userStatus: status,
            deptName: dept.deptName,
            businessOwnership,
          });
        });
      } else {
        setTimeout(() => {
          this.$refs.customDialogRef?.setDlgFormModel({
            businessOwnershipName: "",
            userStatus: "",
            deptName: "",
            businessOwnership: "",
          });
        });
      }
    },
    keepTableList(isRefreshPage = true) {
      //刷新table
      const { activeName } = this.tabsConfig;
      this.$refs[`customerTable${activeName}`] &&
        this.$refs[`customerTable${activeName}`][0]?.refreshKeepTable(
          isRefreshPage,
          activeName
        );
    },
    handleFreeze(row = {}, item) {
      const { id } = row;
      const { type, msg, title, className } = item;
      const httpRequest = {
        3: POSTUnFreeze,
        9: POSTFreeze,
      }[type];
      msgBox(this, { title, className, msg, showCancelButton: true }, () => {
        httpRequest({ id }).then((res) => {
          this.keepTableList(false);
        });
      });
    },
  },
};
