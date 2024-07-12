<template>
  <div>
    <ComTable
			ref="mainContactsTableRef"
      :tableHeight="mainContactsTable.tableHeight"
      :columnConfig="mainContactsTable.columnConfig"
      :httpRequest="mainContactsTable.httpRequest"
      :getQueryParams="() => getQueryParams()"
      :defaultExpandAll="true"
      
    >
      <template v-slot:customRow="{ slotProps }">
        <template v-if="slotProps.prop === 'expand'">
          <div v-if="!slotProps.row.tcustomsClearanceList || !slotProps.row.tcustomsClearanceList.length" class="noData">暂无关联资料</div>
					<div v-else>
						<div v-for="cItem in slotProps.row.tcustomsClearanceList"
							:key="cItem.id" class="base-flex-between means-li-box">
							<div class="means-li-left base-flex-align">
								<span class="means-txt">{{ getDictObj(dictMode, cItem.customsClearanceType) }}</span>
								<span class="means-txt">{{ cItem.code || '' }}</span>
								<span class="means-txt">
									{{ cItem.createBy }} 创建于 {{ cItem.createTime }}
								</span>
								<span class="means-txt">
									{{ attachName(cItem.attachList) }}
								</span>
							</div>
							<div class="base-flex-between">
								<el-button size="small" type="text" @click="() => editMeans(cItem)">编辑</el-button>
								<el-button size="small" type="text" @click="() => delMeans(cItem.id)">删除</el-button>
							</div>
						</div>
					</div>
        </template>

        <template v-if="slotProps.prop === 'isDefault'">
          <el-button v-if="slotProps.row.isDefault == '1'" type="primary" size="mini" plain>默认</el-button>
        </template>
        <template v-if="slotProps.prop === 'operation'">
          <div class="operate-btn-list">
            <div class="btn" v-for="(item, index) in mainContactsTable.btnList" :key="index">
              <el-button
                :class="`operate-icon`"
                v-if="
							item.showStatus.includes(slotProps.row.dataStatus)
						"
                size="small"
                type="text"
                @click="item.handleClick(slotProps.row)"
              >{{ item.text }}</el-button>
            </div>
          </div>
        </template>
      </template>
    </ComTable>

		<ComCustomDialog ref="customDialogRef" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { getMainContactsList, addContactsCustomsClearance, updateContacts, delContacts,
	putContactsCustomsClearance, delContactsCustomsClearance } from "@/api/customerManage/customerList.js";
import { msgTipBox } from "@/utils/confirmBox.js";
import { mainContactsTableConfig, customsClearanceMeansCols } from "./model";
export default {
  props: {
		billContactObj: {
			type: Object,
			default: () => {}
		}
	},
  data() {
    return {
      mainContactsTable: {
        tableHeight: "calc(100vh - 264px)",
        columnConfig: mainContactsTableConfig,
        httpRequest: getMainContactsList,
        btnList: [
          {
            text: "修改",
            type: "edit",
            showStatus: [0, 1],
            handleClick: row => {
              // this.showConfirmDialog("mainContacts", rows);
							this.$emit("editMainContacts", row)
            }
          },
          {
            text: "删除",
            showStatus: [0],
            handleClick: this.deleteMainContacts
          },
          {
            text: "禁用",
            type: "delete",
            showStatus: [1],
            handleClick: row => {
              this._updateContacts(row, 2);
            }
          },
          {
            text: "启用",
            type: "delete",
            showStatus: [0, 2],
            handleClick: row => {
              this._updateContacts(row, 1);
            }
          },
					{
            text: "新增资料",
            showStatus: [0, 1, 2],
            handleClick: this.handleAddMeans
          }
        ]
      },
    };
  },
  methods: {
		handleAddMeans(row) {
			const obj = {
				customsClearanceType: "1",
				cusContactsId: row.id
			}
			this.addEditDialog(obj, addContactsCustomsClearance);
		},
		editMeans(row) {
			const { id, code, remark, attachId, attachList } = row || {}
			this.addEditDialog({ id, customsClearanceType: this.typeConversion(row.customsClearanceType),
				code, remark, attachId, attachList }, putContactsCustomsClearance)
		},
		addEditDialog(formModel, httpRequest) {
			this.$refs.customDialogRef.showCustomDialog({
				customFormConfig: customsClearanceMeansCols,
				formModel,
				httpRequest,
				successFunction: this._mainContactsRefresh,
			})
		},
		delMeans(id) {
			msgTipBox(this, {}, () => {
				delContactsCustomsClearance({ id }).then(() => {
					this._mainContactsRefresh();
				})
			})
		},
		deleteMainContacts(row) {
			msgTipBox(this, {}, () => {
				delContacts(row.id).then(() => {
					this._mainContactsRefresh();
				})
			})
		},

    _updateContacts(row, status) {
      //提单联系人状态转换
      let msg = "启用之后可以被引用";
      let title = "启用提示";
      let successMsg = "启用成功";
      if (status === 2) {
        msg = "禁用之后不可引用，且不影响已历史数据";
        title = "禁用提示";
        successMsg = "禁用成功";
      }
      msgTipBox(this, { title, msg }, () => {
        if (status === 2) {
          row.isDefault = 0;
        }
        updateContacts({
          id: row.id,
          isDefault: row.isDefault,
          dataStatus: status
        }).then(() => {
          this.$message({
            message: successMsg,
            type: "success"
          });
          this._mainContactsRefresh();
        });
      });
    },
		_mainContactsRefresh() {
			this.$refs.mainContactsTableRef.refreshTable();
		},
    getQueryParams() {
      return {
				customerId: this.billContactObj.customerId
			};
    },
		attachName(arr) {
			return (arr || []).map(e => e.name).join('、');
		},
		...mapActions(["dictionary/getDictionary"]),
  },
	created() {
		this["dictionary/getDictionary"](['customsClearanceMode']);
	},
	computed: {
		...mapState({
			dictMode: state => state.dictionary.dicsData.customsClearanceMode,
		})
	},
  components: {
    ComTable: () => import("_comp/ComTable"),
		ComCustomDialog: () => import("_comp/ConfirmDialog/customFormDialog")
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.noData {
	text-align: center;
}
.means-li-box {
	border-bottom: 1px solid #e2e2e2;
	padding: 5px 0;
	&:last-child {
		border-bottom: none;
	}
	.means-li-left {
		flex: 1;
		padding-right: 36px;
		.means-txt {
			flex: 1;
			padding-right: 10px;
		}
	}
	.create-by-time {
		padding-right: 68px;
	}
}
/deep/ {
	.el-table__expanded-cell {
		background: #fdfdfd !important;
		padding: 8px 50px;
	}
}
</style>