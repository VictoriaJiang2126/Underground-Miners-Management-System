import { Storage } from '../../assets/js/tools.js'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
	name: 'areaInfoManagement',
  setup() {
    const loading = ref(false)
    const tableList = reactive({
      data: []
    })
    const queryInfo = reactive({
      page: 1,
      size: 100,
      searchBO: {
      	areaName: '',
      }
    })
    const areaDialogFlag = ref(false)
    const areaDialogFormRef = ref(null)
    const addORupdateFlag = ref(false)

    const areaDialogForm = reactive({
      id: '',
      areaName:'',
      mark: '',
    })
    const areaDialogFormRules = reactive({
      areaName: [
      	{ required: true, message: 'Enter the name', trigger: 'blur' },
      ],
      mark: [
      	{ required: false, message: 'Enter the mark', trigger: 'blur' },
      ],
    })



    // 获取区域信息信息
    const getareaInfo = async (params) => {
      loading.value = true
      let {data: res} = await axios.post('/api/getAreaInfo', params)
      loading.value = false
      tableList.data = res.data
    }
    // 查询
    const queryFn = async () => {
      queryInfo.page = 1
      await getareaInfo(queryInfo)
    }
    // 新增按钮
    const addBtn = async (areaDialogFormRef) => {
      // 重置
      areaDialogForm.id = ''
      areaDialogForm.areaName = ''
      areaDialogForm.mark = ''

      areaDialogFlag.value = true
      addORupdateFlag.value = true

      if (!areaDialogFormRef) return;
      areaDialogFormRef.value.resetFields()
    }

    // 新增保存
    const saveFn = () => {
      if (!areaDialogFormRef) return;
      areaDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/addAreaInfo', areaDialogForm)
          loading.value = false
          areaDialogFlag.value = false
          ElMessage({
            message: '保存成功',
            type: 'success',
          })
          queryInfo.page = 1
          await getareaInfo(queryInfo)
        } else {
          return false;
        }
      });
    }

    // 修改
    const getareaInfoById = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/getAreaInfoById', {id: row.id})
      loading.value = false
      areaDialogFlag.value = true
			addORupdateFlag.value = false
      // 数据回显
      nextTick(() => {
        areaDialogForm.id = res.data.id
        areaDialogForm.areaName = res.data.name
        areaDialogForm.mark = res.data.mark
      })
    }

    // 更新
    const updateFn = async() => {
      if (!areaDialogFormRef) return;
      areaDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/updateAreaInfo', areaDialogForm)
          loading.value = false
          areaDialogFlag.value = false
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
          queryInfo.page = 1
          await getareaInfo(queryInfo)
        } else {
          return false;
        }
      });
    }

    // 删除
    const confirmEvent = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/delAreaInfo', {id: row.id})
      loading.value = false
      areaDialogFlag.value = false
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await getareaInfo(queryInfo)
    }
    const cancelEvent = () => {
      return false
    }

    // 分页
    const handleSizeChange = (val) => {
      queryInfo.size = val
      nextTick(() => {
      	tableDataRef.bodyWrapper.scrollTop = 0
      })
    }
    const handleCurrentChange = (val) => {
      queryInfo.page = val
    }

    return {
      loading,
      tableList,
      queryInfo,
      queryFn,
      addBtn,
      getareaInfo,
      handleSizeChange,
      handleCurrentChange,
      areaDialogFlag,
      areaDialogFormRef,
      areaDialogForm,
      areaDialogFormRules,
      addORupdateFlag,
      saveFn,
      getareaInfoById,
      updateFn,
      confirmEvent,
      cancelEvent,
    }
  },
  created() {
    this.getareaInfo(this.queryInfo)
  },
}
