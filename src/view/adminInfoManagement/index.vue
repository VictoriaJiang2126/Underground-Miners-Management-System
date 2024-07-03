<template>
	<div class="adminInfoManagement" v-loading="loading" element-loading-background="rgba(0, 0, 0, .1)" >
		<el-card class="box-card">
			<div class="queryList">
				<div class="queryItem userName">
					<p>name：</p>
					<el-input v-model.trim="queryInfo.searchBO.userName" placeholder="Enter the name"></el-input>
				</div>
			</div>
			<div class="btn">
				<el-button type="primary" @click="queryFn">Query</el-button>
				<el-button type="primary" @click="addBtn(personDialogFormRef)">Add</el-button>
			</div>
		</el-card>

    <el-card class="wrapper_box">
    	<el-table ref="tableDataRef" :data="tableList.data.slice((queryInfo.page - 1) * queryInfo.size, (queryInfo.page - 1) * queryInfo.size + queryInfo.size)" width="100%" height="100%" stripe>
    		<!-- <el-table-column label="ID" type="index" width="100"></el-table-column> -->
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
    		<el-table-column prop="user_name" label="Name"></el-table-column>
    		<el-table-column prop="role" label="Role">
          <template #default="scope">
            <!-- <p>{{(scope.row.role=='1')?'超级管理员':(scope.row.role=='2')?'管理员':'普通员工'}}</p> -->
            <p>{{roleArr.roleList.find(item => item.value == scope.row.role).label}}</p>
          </template>
        </el-table-column>
    		<el-table-column label="operation" width="180">
    			<template #default="scope">
    				<el-button type="text" @click="getUserInfoById(scope.row)">edit</el-button>
            <el-popconfirm title="Are you sure to delete this?" @confirm="confirmEvent(scope.row)" @cancel="cancelEvent">
              <template #reference>
                <el-button type="text">delete</el-button>
              </template>
            </el-popconfirm>
    			</template>
    		</el-table-column>
    	</el-table>
    	<el-pagination
    		@size-change="handleSizeChange"
    		@current-change="handleCurrentChange"
    		:page-size.sync="queryInfo.size"
    		:current-page.sync="queryInfo.page"
    		:total="tableList.data?tableList.data.length:0"
    		:page-sizes="[50, 100]"
    		layout=" prev,pager,next,sizes">
    	</el-pagination>
    </el-card>


    <el-dialog ref="personDialogRef" title="Personnel information registration" width="25%" custom-class="personDialog" v-model="personDialogFlag" :close-on-click-modal="false" :close-on-press-escape="false">
    	<div class="personDialogCtn" v-if="personDialogFlag">
    		<el-form class="personDialogForm" ref="personDialogFormRef" :model="personDialogForm" :rules="personDialogFormRules">
    			<el-form-item label="name：" prop="userName">
    				<el-input v-model.trim="personDialogForm.userName" placeholder="Enter the name"></el-input>
    			</el-form-item>
          <el-form-item label="newPwd" prop="newPassword">
          	<el-input type="password" v-model="personDialogForm.newPassword" placeholder="Enter the newPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="confirmPwd" prop="confirmPassword">
          	<el-input type="password" v-model="personDialogForm.confirmPassword" placeholder="Enter the confirmPassword" show-password></el-input>
          </el-form-item>
          <el-form-item label="role" prop="confirmPassword">
            <el-select v-model="personDialogForm.roleValue" placeholder="please select role" size="large">
              <el-option v-for="item in roleArr.roleList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
    		</el-form>
    	</div>
      <template #footer>
        <span class="dialog-footer">
         <el-button size="small" @click="personDialogFlag = false">Cancel</el-button>
         <el-button v-if="addORupdateFlag" type="primary" @click="saveFn">Conform</el-button>
         <el-button v-else type="primary" @click="updateFn">Update</el-button>
        </span>
      </template>
    </el-dialog>

	</div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scope></style>
