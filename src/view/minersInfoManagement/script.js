import { Storage } from '../../assets/js/tools.js'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
	name: 'minersInfoManagement',
  setup() {
    const loading = ref(false)
    const tableList = reactive({
      data: []
    })
    const queryInfo = reactive({
      page: 1,
      size: 100,
      searchBO: {
      	minerName: '',
      }
    })
    const minerDialogFlag = ref(false)
    const minerDialogFormRef = ref(null)
    const addORupdateFlag = ref(false)

    const minerDialogForm = reactive({
      id: '',
      minerName:'',
      phone: '',
      gender: '',
      age: '',
      level: '',
      email: '',
      sectionId: '',
      mark: '',
      // positionId: '',

    })
    const minerDialogFormRules = reactive({
      minerName: [
      	{ required: true, message: 'Enter the name', trigger: 'blur' },
      ],
      phone: [
      	{ required: true, message: 'Enter the phone', trigger: 'blur' },
      ],
      gender: [
      	{ required: false, message: 'Enter the gender', trigger: 'blur' },
      ],
      level: [
      	{ required: true, message: 'Enter the level', trigger: 'blur' },
      ],
      email: [
      	{ required: true, message: 'Enter the email', trigger: 'blur' },
      ],
      sectionId: [
      	{ required: true, message: 'Enter the sectionId', trigger: 'blur' },
      ],
      mark: [
      	{ required: false, message: 'Enter the mark', trigger: 'blur' },
      ],
    })

    // 获取矿工信息信息
    const getMinerInfo = async (params) => {
      loading.value = true
      let {data: res} = await axios.post('/api/getMinerInfo', params)
      loading.value = false
      tableList.data = res.data
    }
    // 查询
    const queryFn = async () => {
      queryInfo.page = 1
      await getMinerInfo(queryInfo)
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

    // 新增按钮
    const addBtn = async (minerDialogFormRef) => {
      // 重置
      minerDialogForm.id = ''
      minerDialogForm.minerName = ''
      minerDialogForm.phone = ''
      minerDialogForm.gender = ''
      minerDialogForm.age = ''
      minerDialogForm.level = ''
      minerDialogForm.email = ''
      minerDialogForm.sectionId = ''
      minerDialogForm.mark = ''
      // minerDialogForm.positionId = ''

      minerDialogFlag.value = true
      addORupdateFlag.value = true

      if (!minerDialogFormRef) return;
      minerDialogFormRef.value.resetFields()
    }

    // 新增保存
    const saveFn = () => {
      if (!minerDialogFormRef) return;
      minerDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/addMinerInfo', minerDialogForm)
          loading.value = false
          minerDialogFlag.value = false
          ElMessage({
            message: res.msg,
            type: res.msg=='保存失败'?'error':'success',
          })
          queryInfo.page = 1
          await getMinerInfo(queryInfo)
        } else {
          return false;
        }
      });
    }

    // 修改
    const getMinerInfoById = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/getMinerInfoById', {id: row.id})
      loading.value = false
      minerDialogFlag.value = true
      addORupdateFlag.value = false
      // 数据回显
      nextTick(() => {
        minerDialogForm.id = res.data.id
        minerDialogForm.minerName = res.data.name
        minerDialogForm.phone = res.data.phone
        minerDialogForm.gender = res.data.gender
        minerDialogForm.age = res.data.age
        minerDialogForm.level = res.data.level
        minerDialogForm.email = res.data.email
        minerDialogForm.sectionId = res.data.section_id
        minerDialogForm.mark = res.data.mark
      })
    }

    // 更新
    const updateFn = async() => {
      if (!minerDialogFormRef) return;
      minerDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/updateMinerInfo', minerDialogForm)
          loading.value = false
          minerDialogFlag.value = false
          ElMessage({
            message: res.msg,
            type: res.msg=='修改失败'?'error':'success',
          })
          queryInfo.page = 1
          await getMinerInfo(queryInfo)
        } else {
          return false;
        }
      });
    }
    // 删除
    const confirmEvent = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/delMinerInfo', {id: row.id})
      loading.value = false
      minerDialogFlag.value = false
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await getMinerInfo(queryInfo)
    }
    const cancelEvent = () => {
      return false
    }
    return {
      loading,
      tableList,
      queryInfo,
      minerDialogFlag,
      minerDialogFormRef,
      addORupdateFlag,
      minerDialogForm,
      minerDialogFormRules,
      handleSizeChange,
      handleCurrentChange,
      getMinerInfo,
      queryFn,
      addBtn,
      saveFn,
      getMinerInfoById,
      updateFn,
      confirmEvent,
      cancelEvent,
    }
  },
  created() {
    this.getMinerInfo(this.queryInfo)
  },
}
