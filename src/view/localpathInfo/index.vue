<template>
	<div class="localpathInfo">
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
				    value-format="YYYY-MM-DD"
				    @change="defaultDateValueChange"
            :clearable='false'
				  />
				</div>
				<div class="queryItem minerName">
					<p>name：</p>
					<el-input v-model="queryInfo.searchBO.minerName" placeholder="Enter the name"></el-input>
				</div>
			</div>
			<div class="btn">
				<el-button type="primary" @click="queryBtn">Query</el-button>
			</div>
		</el-card>
		<el-card class="wrapper_box">
			<el-table ref="tableDataRef" :data="tableList.data.slice((queryInfo.page - 1) * queryInfo.size, (queryInfo.page - 1) * queryInfo.size + queryInfo.size)" width="100%" height="100%" stripe>
				<!-- <el-table-column prop="id" label="ID" width="70"></el-table-column> -->
		    <el-table-column prop="miner_id" label="Miner ID"></el-table-column>
		    <el-table-column prop="mine_name" label="Miner Name"></el-table-column>
		    <el-table-column prop="date" label="Date"></el-table-column>
		    <el-table-column prop="pos10" label="pos10"></el-table-column>
		    <el-table-column prop="time10" label="time10"></el-table-column>
		    <el-table-column prop="pos11" label="pos11"></el-table-column>
        <el-table-column prop="time11" label="time11"></el-table-column>
		    <el-table-column prop="pos12" label="pos12"></el-table-column>
        <el-table-column prop="time12" label="time12"></el-table-column>
		    <el-table-column prop="pos15" label="pos15"></el-table-column>
        <el-table-column prop="time15" label="time15"></el-table-column>
		    <el-table-column prop="pos16" label="pos16"></el-table-column>
        <el-table-column prop="time16" label="time16"></el-table-column>
		    <el-table-column prop="pos17" label="pos17"></el-table-column>
        <el-table-column prop="time17" label="time17"></el-table-column>
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

	</div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scope></style>
