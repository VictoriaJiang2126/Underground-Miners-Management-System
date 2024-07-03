<template>
	<div class="minersInfoManagement">
    <el-card class="box-card">
    	<div class="queryList">
    		<div class="queryItem areaName">
    			<p>name：</p>
    			<el-input v-model.trim="queryInfo.searchBO.minerName" placeholder="Enter the name"></el-input>
    		</div>
    	</div>
    	<div class="btn">
    		<el-button type="primary" @click="queryFn">Query</el-button>
    		<el-button type="primary" @click="addBtn(minerDialogFormRef)">Add</el-button>
    	</div>
    </el-card>

    <el-card class="wrapper_box">
    	<el-table ref="tableDataRef" :data="tableList.data.slice((queryInfo.page - 1) * queryInfo.size, (queryInfo.page - 1) * queryInfo.size + queryInfo.size)" width="100%" height="100%" stripe>
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
    		<el-table-column prop="name" label="Name"></el-table-column>
    		<el-table-column prop="phone" label="Phone"></el-table-column>
    		<el-table-column prop="gender" label="Gender"></el-table-column>
    		<el-table-column prop="age" label="Age"></el-table-column>
    		<el-table-column prop="level" label="Level"></el-table-column>
    		<el-table-column prop="email" label="Email"></el-table-column>
    		<el-table-column prop="section_id" label="Section ID"></el-table-column>
    		<el-table-column prop="mark" label="Mark"></el-table-column>
    		<!-- <el-table-column prop="position_id" label="Position ID"></el-table-column> -->
    		<el-table-column label="operation" width="180">
    			<template #default="scope">
    				<el-button type="text" @click="getMinerInfoById(scope.row)">edit</el-button>
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

		<!-- 新增区域 -->
		<el-dialog ref="minerDialogRef" title="Miner information registration" width="25%" custom-class="minerDialog" v-model="minerDialogFlag" :close-on-click-modal="false" :close-on-press-escape="false">
			<div class="minerDialogCtn" v-if="minerDialogFlag">
				<el-form class="minerDialogForm" ref="minerDialogFormRef" :model="minerDialogForm" :rules="minerDialogFormRules">
					<el-form-item label="Name：" prop="minerName">
						<el-input v-model.trim="minerDialogForm.minerName" placeholder="Enter the name"></el-input>
					</el-form-item>
          <el-form-item label="Phone：" prop="phone">
          	<el-input v-model.trim="minerDialogForm.phone" placeholder="Enter the phone"></el-input>
          </el-form-item>
          <el-form-item label="Gender：" prop="gender">
          	<el-input v-model.trim="minerDialogForm.gender" placeholder="Enter the gender"></el-input>
          </el-form-item>
          <el-form-item label="Age：" prop="age">
          	<el-input v-model.trim="minerDialogForm.age" placeholder="Enter the age"></el-input>
          </el-form-item>
          <el-form-item label="Level：" prop="level">
          	<el-input v-model.trim="minerDialogForm.level" placeholder="Enter the level"></el-input>
          </el-form-item>
          <el-form-item label="Email：" prop="email">
          	<el-input v-model.trim="minerDialogForm.email" placeholder="Enter the email"></el-input>
          </el-form-item>
		      <el-form-item label="SectionId ID：" prop="sectionId">
		      	<el-input v-model.trim="minerDialogForm.sectionId" placeholder="Enter the section ID"></el-input>
		      </el-form-item>
		      <el-form-item label="Mark：" prop="mark">
		      	<el-input v-model.trim="minerDialogForm.mark" placeholder="Enter the mark"></el-input>
		      </el-form-item>
         <!-- <el-form-item label="Position ID：" prop="positionId">
          	<el-input v-model.trim="minerDialogForm.positionId" placeholder="Enter the position ID"></el-input>
          </el-form-item> -->
				</el-form>
			</div>
		  <template #footer>
		    <span class="dialog-footer">
		     <el-button size="small" @click="minerDialogFlag = false">Cancel</el-button>
		     <el-button v-if="addORupdateFlag" type="primary" @click="saveFn">Conform</el-button>
		     <el-button v-else type="primary" @click="updateFn">Update</el-button>
		    </span>
		  </template>
		</el-dialog>
	</div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scope></style>
