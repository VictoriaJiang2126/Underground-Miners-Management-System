import { Storage, getyearData } from '../../assets/js/tools.js'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
	name: 'localpathInfo',
  setup() {
    const loading = ref(false)
    const tableList = reactive({
      data: []
    })
    const queryInfo = reactive({
      page: 1,
      size: 100,
      searchBO: {
        defaultDateValue: '',
        minerName: '',
        startTime: '',
        endTime: '',
      }
    })

    // 获取表格数据
    const findPositionInfo = async (params) => {
      let {data: res} = await axios.post('/api/getPositionInfo', params)
      res.data.map(item => item.date = getyearData(new Date(item.date).getTime()))
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
      findPositionInfo(queryInfo)
    }

    const defaultDateValueChange = (val) => {
      queryInfo.searchBO.startTime = val[0] + ' 00:00:00'
      queryInfo.searchBO.endTime = val[1] + ' 23:59:59'

      queryInfo.page = 1
      findPositionInfo(queryInfo)
    }

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

    return {
      queryInfo,
      loading,
      tableList,
      handleSizeChange,
      handleCurrentChange,
      findPositionInfo,
      queryBtn,
      defaultDateValueChange,
      initTimeDate
    }
  },
  created() {
    this.initTimeDate()
    this.findPositionInfo(this.queryInfo)
  },
}
