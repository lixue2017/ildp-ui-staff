import { httpFBAWarehouseSelect } from '@/comModel/warehouse'
export const tabsConfig = {
  columns: [
    {
      label: "接单入库",
      key: 1,
    },
    {
      label: "拒绝退回",
      key: 2,
    },
  ],
  active: 1,
}

export const config = {
  lists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "enterWarehouse",
                  label: "入库仓：",
                  placeholder: "请选择入库仓",
                  ...httpFBAWarehouseSelect('2', { itemId: 'id' })
                },
                {
                  span: 24,
                  id: "remark",
                  label: "补充说明：",
                  placeholder: "请输入备注说明",
                  type: "textarea",
                  rows: 4
                },
              ],
            },
          ],
        }
      ],
    },
  ],
  refuseLists: [
    {
      fieldList: [
        {
          rows: [
            {
              cols: [
                {
                  span: 24,
                  id: "remark",
                  label: "补充说明：",
                  placeholder: "请输入备注说明",
                  type: "textarea",
                  rows: 4
                },
              ],
            },
          ],
        }
      ],
    },
  ],
  formRules: {
    enterWarehouse: [
      { required: true, message: "请选择入库仓", trigger: "change" },
    ]
  }
}