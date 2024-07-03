import { Storage } from '../../assets/js/tools.js'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
	name: 'attendanceInfoManagement',
  setup() {
    const loading = ref(false)
    const tableList = reactive({
      data: []
    })
    const statusArr = reactive({
      data: [
        {value: 'all', label: 'all'},
        {value: 'normal', label: 'normal'},
        {value: 'abnormal', label: 'abnormal'},
      ]
    })
    const queryInfo = reactive({
      page: 1,
      size: 100,
      searchBO: {
      	defaultDateValue: '',
      	attendanceName: '',
        statusValue: 'all',
      	endTime: '',
      	startTime:'',
      }
    })
    // 快捷选项配置
    const shortcuts = [
      {
        text: 'Last week',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        },
      },
      {
        text: 'Last month',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        },
      },
      {
        text: 'Last 3 months',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        },
      },
    ]

    const addORupdateFlag = ref(false)
    const attendanceDialogFlag = ref(false)
    const attendanceDialogFormRef = ref(null)
    const attendanceDialogForm = reactive({
      id: '',
      attendanceName:'',
      dateValue: '',
      underTime: '',
      upTime:'',
    })
    const attendanceDialogFormRules = reactive({
      attendanceName: [
      	{ required: true, message: 'Enter the name', trigger: 'blur' },
      ],
      dateValue: [
      	{ required: true, message: 'Enter the dateValue', trigger: 'change' },
      ],
      underTime: [
      	{ required: true, message: 'Enter the underTime', trigger: 'change' },
      ],
      upTime: [
      	{ required: true, message: 'Enter the upTime', trigger: 'change' },
      ],
    })

    // 初始化时间
    const initTimeDate = () => {
      // 获取当前年月
      let nowYear = new Date().getFullYear()
      let nowMonth = new Date().getMonth() + 1
      let currentMonthLastDay = new Date(nowYear, nowMonth, 0).getDate()

      queryInfo.searchBO.defaultDateValue = [nowYear + '-' + (nowMonth>9?nowMonth:'0'+nowMonth) + '-01 00:00:00', nowYear + '-' + (nowMonth>9?nowMonth:'0'+nowMonth) + '-' + currentMonthLastDay + ' 23:59:59']
      queryInfo.searchBO.startTime = queryInfo.searchBO.defaultDateValue[0]
      queryInfo.searchBO.endTime = queryInfo.searchBO.defaultDateValue[1]
    }

    const defaultDateValueChange = (val) => {
      queryInfo.searchBO.startTime = val[0] + ' 00:00:00'
      queryInfo.searchBO.endTime = val[1] + ' 23:59:59'

      queryInfo.page = 1
      findAttendanceInfo(queryInfo)
    }

    const findAttendanceInfo = async (params) => {
      let {data: res} = await axios.post('/api/findAttendanceInfo', params)
      tableList.data = res.data
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

    const queryBtn = async () => {
      queryInfo.page = 1
      findAttendanceInfo(queryInfo)
    }

    // 新增按钮
    const addBtn = async (attendanceDialogFormRef) => {
      // 重置
      attendanceDialogForm.id = ''
      attendanceDialogForm.attendanceName = ''
      attendanceDialogForm.dateValue = ''
      attendanceDialogForm.underTime = ''
      attendanceDialogForm.upTime = ''

      attendanceDialogFlag.value = true
      addORupdateFlag.value = true

      if (!attendanceDialogFormRef) return;
      attendanceDialogFormRef.value.resetFields()
    }

    // 新增保存
    const saveFn = () => {
      if (!attendanceDialogFormRef) return;
      attendanceDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/addAttendanceInfo', attendanceDialogForm)
          loading.value = false
          attendanceDialogFlag.value = false
          ElMessage({
            message: res.msg,
            type: res.msg=='保存失败'?'error':'success',
          })
          queryInfo.page = 1
          await findAttendanceInfo(queryInfo)
        } else {
          return false;
        }
      });
    }

    // 修改
    const getAttendanceInfoById = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/getAttendanceInfoById', {id: row.id})
      loading.value = false
      attendanceDialogFlag.value = true
      addORupdateFlag.value = false
      // 数据回显
      nextTick(() => {
        attendanceDialogForm.id = res.data.id
        attendanceDialogForm.attendanceName = res.data.miner_id
        attendanceDialogForm.dateValue = res.data.date
        attendanceDialogForm.underTime = res.data.onworktime
        attendanceDialogForm.upTime = res.data.offworktime

      })
    }

    // 更新
    const updateFn = async() => {
      if (!attendanceDialogFormRef) return;
      attendanceDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/updateAttendanceInfo', attendanceDialogForm)
          loading.value = false
          attendanceDialogFlag.value = false
          ElMessage({
            message: res.msg,
            type: res.msg=='修改失败'?'error':'success',
          })
          queryInfo.page = 1
          await findAttendanceInfo(queryInfo)
        } else {
          return false;
        }
      });
    }

    // 删除
    const confirmEvent = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/delAttendanceInfo', {id: row.id})
      loading.value = false
      attendanceDialogFlag.value = false
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await findAttendanceInfo(queryInfo)
    }
    const cancelEvent = () => {
      return false
    }

    return {
      queryInfo,
      shortcuts,
      defaultDateValueChange,
      findAttendanceInfo,
      initTimeDate,
      tableList,
      handleSizeChange,
      handleCurrentChange,
      queryBtn,
      addORupdateFlag,
      attendanceDialogFlag,
      addBtn,
      attendanceDialogForm,
      attendanceDialogFormRules,
      saveFn,
      getAttendanceInfoById,
      updateFn,
      confirmEvent,
      cancelEvent,
      attendanceDialogFormRef,
      loading,
      statusArr
    }
  },
  created() {
    this.initTimeDate()
    this.findAttendanceInfo(this.queryInfo)
  },
}
