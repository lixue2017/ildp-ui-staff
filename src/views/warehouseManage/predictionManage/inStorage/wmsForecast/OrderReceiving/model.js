import { httpWarehousePublicSelect } from "@/comModel/warehouse";
import { httpRoleDeptUserSelect } from "@/comModel/httpSelect";
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
};

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
                  id: "estimateWarehousingTime",
                  label: "预计入仓时间：",
                  placeholder: "年/月/日",
                  type: "date",
                  valueFormat: "yyyy-MM-dd",
                },
                {
                  span: 24,
                  id: "targetWarehouseId",
                  label: "入库仓：",
                  placeholder: "请选择入库仓",
                  ...httpWarehousePublicSelect(),
                  selectLabelKey: "targetWarehouse",
                  type: "slot",
                },
                {
                  span: 24,
                  id: "operator",
                  label: "操作员：",
                  placeholder: "请选择操作员",
                  ...httpRoleDeptUserSelect({ getRoles: ["CZ"] }),
                },
                {
                  span: 24,
                  id: "remark",
                  label: "补充说明：",
                  placeholder: "请输入备注说明",
                  type: "textarea",
                },
              ],
            },
          ],
        },
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
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  formRules: {
    estimateWarehousingTime: [
      { required: true, message: "请选择预计入仓时间", trigger: "change" },
    ],
    targetWarehouseId: [
      { required: true, message: "请选择入库仓", trigger: "change" },
    ],
    operator: [
      { required: true, message: "请选择操作员", trigger: "change" },
    ],
  },
};
