import { Storage } from '../../assets/js/tools.js'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
	name: 'stationInfoManagement',
  setup() {
    const loading = ref(false)
    const tableList = reactive({
      data: []
    })

    const queryInfo = reactive({
      page: 1,
      size: 100,
      searchBO: {
      	stationName: '',
      }
    })
    const stationDialogFlag = ref(false)
    const stationDialogFormRef = ref(null)
    const addORupdateFlag = ref(false)

    const stationDialogForm = reactive({
      id: '',
      stationName:'',
      sectionId: '',
      mark: '',
    })
    const stationDialogFormRules = reactive({
      stationName: [
      	{ required: true, message: 'Enter the name', trigger: 'blur' },
      ],
      sectionId: [
      	{ required: true, message: 'select the Section ID', trigger: 'change' },
      ],
      mark: [
      	{ required: false, message: 'Enter the mark', trigger: 'blur' },
      ],
    })

    // 获取站点信息信息
    const getstationInfo = async (params) => {
      loading.value = true
      let {data: res} = await axios.post('/api/getStationInfo', params)
      loading.value = false
      tableList.data = res.data
    }
    // 查询
    const queryFn = async () => {
      queryInfo.page = 1
      await getstationInfo(queryInfo)
    }

    // 新增按钮
    const addBtn = async (stationDialogFormRef) => {
      // 重置
      stationDialogForm.id = ''
      stationDialogForm.sectionId = ''
      stationDialogForm.stationName = ''
      stationDialogForm.mark = ''

      stationDialogFlag.value = true
      addORupdateFlag.value = true

      if (!stationDialogFormRef) return;
      stationDialogFormRef.value.resetFields()
    }

    // 新增保存
    const saveFn = () => {
      if (!stationDialogFormRef) return;
      stationDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/addStationInfo', stationDialogForm)
          loading.value = false
          stationDialogFlag.value = false
          // console.log(res)
          ElMessage({
            message: res.msg,
            type: res.msg=='保存失败'?'error':'success',
          })
          queryInfo.page = 1
          await getstationInfo(queryInfo)
        } else {
          return false;
        }
      });
    }

    // 修改
    const getstationInfoById = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/getStationInfoById', {id: row.id})
      loading.value = false
      stationDialogFlag.value = true
      addORupdateFlag.value = false
      // 数据回显
      nextTick(() => {
        stationDialogForm.id = res.data.id
        stationDialogForm.stationName = res.data.name
        stationDialogForm.sectionId = res.data.section_id
        stationDialogForm.mark = res.data.mark
      })
    }

    // 更新
    const updateFn = async() => {
      if (!stationDialogFormRef) return;
      stationDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/updateStationInfo', stationDialogForm)
          loading.value = false
          stationDialogFlag.value = false
          ElMessage({
            message: res.msg,
            type: res.msg=='修改失败'?'error':'success',
          })
          queryInfo.page = 1
          await getstationInfo(queryInfo)
        } else {
          return false;
        }
      });
    }

    // 删除
    const confirmEvent = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/delStationInfo', {id: row.id})
      loading.value = false
      stationDialogFlag.value = false
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await getstationInfo(queryInfo)
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
      handleSizeChange,
      handleCurrentChange,
      stationDialogFlag,
      stationDialogFormRef,
      addORupdateFlag,
      stationDialogForm,
      stationDialogFormRules,
      getstationInfo,
      queryFn,
      addBtn,
      saveFn,
      getstationInfoById,
      confirmEvent,
      cancelEvent,
      updateFn,
    }
  },
  created() {
    this.getstationInfo(this.queryInfo)
  },
}
