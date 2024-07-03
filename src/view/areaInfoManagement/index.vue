<template>
	<div class="areaInfoManagement">
		<el-card class="box-card">
			<div class="queryList">
				<div class="queryItem userName">
					<p>name：</p>
					<el-input v-model.trim="queryInfo.searchBO.areaName" placeholder="Enter the name"></el-input>
				</div>
			</div>
			<div class="btn">
				<el-button type="primary" @click="queryFn">Query</el-button>
				<el-button type="primary" @click="addBtn(areaDialogFormRef)">Add</el-button>
			</div>
		</el-card>

    <el-card class="wrapper_box">
    	<el-table ref="tableDataRef" :data="tableList.data.slice((queryInfo.page - 1) * queryInfo.size, (queryInfo.page - 1) * queryInfo.size + queryInfo.size)" width="100%" height="100%" stripe>
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
    		<el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="mark" label="Mark"></el-table-column>
    		<el-table-column label="operation" width="180">
    			<template #default="scope">
    				<el-button type="text" @click="getareaInfoById(scope.row)">edit</el-button>
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

    <!-- 新增站点 -->
    <el-dialog ref="areaDialogRef" title="Area Information Registration" width="25%" custom-class="areaDialog" v-model="areaDialogFlag" :close-on-click-modal="false" :close-on-press-escape="false">
    	<div class="areaDialogCtn" v-if="areaDialogFlag">
    		<el-form class="areaDialogForm" ref="areaDialogFormRef" :model="areaDialogForm" :rules="areaDialogFormRules">
    			<el-form-item label="Name：" prop="areaName">
    				<el-input v-model.trim="areaDialogForm.areaName" placeholder="Enter the name"></el-input>
    			</el-form-item>
          <el-form-item label="Mark：" prop="mark">
          	<el-input v-model.trim="areaDialogForm.mark" placeholder="Enter the mark"></el-input>
          </el-form-item>
    		</el-form>
    	</div>
      <template #footer>
        <span class="dialog-footer">
         <el-button size="small" @click="areaDialogFlag = false">Cancel</el-button>
         <el-button v-if="addORupdateFlag" type="primary" @click="saveFn">Conform</el-button>
         <el-button v-else type="primary" @click="updateFn">Update</el-button>
        </span>
      </template>
    </el-dialog>

	</div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scope></style>
