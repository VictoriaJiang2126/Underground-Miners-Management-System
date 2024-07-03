import { Storage } from '../../assets/js/tools.js'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
	name: 'adminInfoManagement',
  setup() {
    const tableDataRef = ref(null)
    const personDialogFormRef = ref(null)

    // 确认密码判断
    var validatePass2 = (rule, value, callback) => {
    	if (value === '') {
    		callback(new Error('Please enter your password again'));
    	} else if (value !== personDialogForm.newPassword) {
    		callback(new Error('input password is inconsistent!'));
    	} else {
    		callback();
    	}
    };

    const loading = ref(false)
    const tableList = reactive({
      data: []
    })
    const queryInfo = reactive({
      page: 1,
      size: 100,
      searchBO: {
      	userName: '',
      }
    })
    const personDialogFlag = ref(false)
    const personDialogForm = reactive({
      id: '',
      userName: '',
      newPassword: '',
      confirmPassword: '',
      roleValue: '',
    })
    const personDialogFormRules = reactive({
      userName: [
      	{ required: true, message: 'Enter the name', trigger: 'blur' },
      ],
      newPassword: [
        {required: true,message: 'Enter the newpassword',trigger: 'blur' },
      ],
      confirmPassword: [
        {required: true,validator: validatePass2,trigger: 'blur'},
      ],
      roleValue: [
        {required: true,message: 'please select role',trigger: 'blur'},
      ],
    })
    const addORupdateFlag = ref(false)
    const roleArr = reactive({
      roleList: [
        {label: 'super administer', value: '1'},
        {label: 'normal administer', value: '2'},
        {label: 'user', value: '3'},
      ]
    })
    // 获取表格用户信息
    const getUserInfo = async (params) => {
      loading.value = true
      params.searchBO['userId'] = Storage.localGet("userId")
      let {data: res} = await axios.post('/api/getUserInfo', params)
      loading.value = false
      tableList.data = res.data
    }

    // 查询
    const queryFn = async () => {
      queryInfo.page = 1
      await getUserInfo(queryInfo)
    }

    // 新增按钮
    const addBtn = async (personDialogFormRef) => {
      // 重置
      personDialogForm.id = ''
      personDialogForm.userName = ''
      personDialogForm.newPassword = ''
      personDialogForm.confirmPassword = ''
      personDialogForm.roleValue = ''

      personDialogFlag.value = true
      addORupdateFlag.value = true

      if (!personDialogFormRef) return;
      personDialogFormRef.value.resetFields()
    }

    // 修改
    const getUserInfoById = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/getUserInfoById', {id: row.id})
      loading.value = false
      personDialogFlag.value = true
      addORupdateFlag.value = false
      // 数据回显
      nextTick(() => {
        personDialogForm.id = res.data.id
        personDialogForm.userName = res.data.user_name
        personDialogForm.newPassword = res.data.user_pws
        personDialogForm.confirmPassword = res.data.user_pws
        personDialogForm.roleValue = roleArr.roleList.find(item => item.value == res.data.role).value
      })
    }

    // 删除
    const confirmEvent = async (row) => {
      loading.value = true
      let {data: res} = await axios.post('/api/delUserInfo', {id: row.id})
      loading.value = false
      personDialogFlag.value = false
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await getUserInfo(queryInfo)
    }
    const cancelEvent = () => {
      return false
    }

    // 保存
    const saveFn = () => {
      if (!personDialogFormRef) return;
      personDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/addUserInfo', personDialogForm)
          loading.value = false
          personDialogFlag.value = false
          ElMessage({
            message: '保存成功',
            type: 'success',
          })
          queryInfo.page = 1
          await getUserInfo(queryInfo)
        } else {
          return false;
        }
      });
    }
    // 更新
    const updateFn = async () => {
      if (!personDialogFormRef) return;
      personDialogFormRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true
          let {data: res} = await axios.post('/api/updateUserInfo', personDialogForm)
          loading.value = false
          personDialogFlag.value = false
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
          queryInfo.page = 1
          await getUserInfo(queryInfo)
        } else {
          return false;
        }
      });
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
      getUserInfo,
      queryFn,
      addBtn,
      personDialogFlag,
      personDialogForm,
      personDialogFormRules,
      addORupdateFlag,
      saveFn,
      updateFn,
      personDialogFormRef,
      getUserInfoById,
      roleArr,
      confirmEvent,
      cancelEvent,
    }

  },
  created() {
    this.getUserInfo(this.queryInfo)
  },
}
