```
ComTable.vue---用例
template:
  <ComTable :columnConfig="userTable.columnConfig" :httpRequest="userTable.httpRequest" :getQueryParams="userTable.getQueryParams" >
    <template v-slot:customRow="{slotProps}">
      <el-switch
        v-if="slotProps.prop === 'status'"
        v-model="slotProps.row.status"
        active-value="0"
        inactive-value="1"
        @change="handleStatusChange(slotProps.row)"
      ></el-switch>
      <span v-if="slotProps.prop === 'createTime'">{{ parseTime(slotProps.row.createTime) }}</span>
      <template v-if="slotProps.prop === 'operation'">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click="handleUpdate(slotProps.row)"
          v-hasPermi="['system:user:edit']"
          >修改</el-button>
        <el-button
          v-if="slotProps.row.userId !== 1"
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleDelete(slotProps.row)"
          v-hasPermi="['system:user:remove']"
          >删除</el-button>
        <el-button
          size="mini"
          type="text"
          icon="el-icon-key"
          @click="handleResetPwd(slotProps.row)"
          v-hasPermi="['system:user:resetPwd']"
          >重置</el-button>
      </template>
    </template>
  </ComTable>
data: 
  userTable: {
    httpRequest: this.listUser,
    getQueryParams: this.getQueryParams,
    columnConfig: [{
      type: 'selection',
      width: '50'
    }, {
      prop: 'userId',
      label: '用户编号'
    }, {
      prop: 'nickName',
      label: '用户昵称'
    }, {
      prop: 'dept.deptName',
      label: '部门'
    }, {
      prop: 'phonenumber',
      label: '手机号码',
      width: '120'
    }, {
      label: '状态',
      prop: 'status',
      customRow: true
    }, {
      label: '创建时间',
      prop: 'createTime',
      width: 160,
      customRow: true
    }, {
      label: '操作',
      prop: 'operation',
      width: 160,
      className: 'small-padding fixed-width',
      customRow: true
    }]
  }

多级表头：
{
      prop: "billInfo",
      label: "配送信息",
      multiHeader: true,
      align: 'center',
      list: [
          {
              label: '姓名',
              width: 120,
              prop: 'name',
              align: 'center',
          },
          {
              label: '地址',
              width: 120,
              align: 'center',
              list: [
                  {
                      label: '省份',
                      width: 120,
                      prop: 'province',
                      align: 'center',
                  },
                  {
                      label: '市区',
                      width: 120,
                      prop: 'city',
                      align: 'center',
                  }
              ]
          }
      ]
}
 
 ```