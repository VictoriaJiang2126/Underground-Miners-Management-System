<template>
	<div class="attendanceInfoManagement">
		<el-card class="box-card">
			<div class="queryList">
				<div class="queryItem defaultDateValue">
					<p>Time：</p>
		      <el-date-picker
		        v-model="queryInfo.searchBO.defaultDateValue"
		        type="daterange"
		        range-separator="To"
		        start-placeholder="Start date"
		        end-placeholder="End date"
		        :shortcuts="shortcuts"
		        value-format="YYYY-MM-DD"
		        @change="defaultDateValueChange"
            :clearable='false'
		      />
				</div>
				<div class="queryItem attendanceName">
					<p>name：</p>
					<el-input v-model="queryInfo.searchBO.attendanceName" placeholder="Enter the name"></el-input>
				</div>
				<div class="queryItem status">
          <p>status：</p>
					 <el-select v-model="queryInfo.searchBO.statusValue" placeholder="Select">
						<el-option
							v-for="item in statusArr.data"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</div>
			</div>
			<div class="btn">
				<el-button type="primary" @click="queryBtn">Query</el-button>
        <el-button type="primary" @click="addBtn(attendanceDialogFormRef)">Add</el-button>
			</div>
		</el-card>
		<el-card class="wrapper_box">
			<el-table ref="tableDataRef" :data="tableList.data.slice((queryInfo.page - 1) * queryInfo.size, (queryInfo.page - 1) * queryInfo.size + queryInfo.size)" width="100%" height="100%" stripe>
				<el-table-column prop="id" label="ID" width="100"></el-table-column>
		    <el-table-column prop="miner_id" label="Miner ID"></el-table-column>
        <el-table-column prop="name" label="Miner Name"></el-table-column>
		    <el-table-column prop="date" label="Date"></el-table-column>
		    <el-table-column prop="onworktime" label="UnderWell"></el-table-column>
		    <el-table-column prop="offworktime" label="UpWell"></el-table-column>
        <el-table-column prop="status" label="status"></el-table-column>
        <el-table-column label="operation" width="180">
        	<template #default="scope">
        		<el-button type="text" @click="getAttendanceInfoById(scope.row)">edit</el-button>
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

    <!-- 新增考勤 -->
    <el-dialog ref="attendanceDialogRef" title="Attendance information registration" width="25%" custom-class="attendanceDialog" v-model="attendanceDialogFlag" :close-on-click-modal="false" :close-on-press-escape="false">
    	<div class="attendanceDialogCtn" v-if="attendanceDialogFlag">
    		<el-form class="attendanceDialogForm" ref="attendanceDialogFormRef" :model="attendanceDialogForm" :rules="attendanceDialogFormRules">
    			<el-form-item label="miner ID：" prop="attendanceName">
    				<el-input v-model.trim="attendanceDialogForm.attendanceName" placeholder="Enter the name"></el-input>
    			</el-form-item>
          <el-form-item label="Date：" prop="dateValue">
            <el-date-picker v-model="attendanceDialogForm.dateValue" type="date" placeholder="Pick a day" value-format="YYYY-MM-DD"/>
          </el-form-item>
          <el-form-item label="underTime：" prop="underTime">
            <el-time-picker v-model="attendanceDialogForm.underTime" placeholder="Arbitrary time" value-format="HH:mm:ss"/>
          </el-form-item>
          <el-form-item label="UpTime：" prop="upTime">
            <el-time-picker v-model="attendanceDialogForm.upTime" placeholder="Arbitrary time" value-format="HH:mm:ss"/>
          </el-form-item>
    		</el-form>
    	</div>
      <template #footer>
        <span class="dialog-footer">
         <el-button size="small" @click="attendanceDialogFlag = false">Cancel</el-button>
         <el-button v-if="addORupdateFlag" type="primary" @click="saveFn">Conform</el-button>
         <el-button v-else type="primary" @click="updateFn">Update</el-button>
        </span>
      </template>
    </el-dialog>

	</div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scope></style>
