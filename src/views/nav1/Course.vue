<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.kh" placeholder="课号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="find_c_by_kh">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="course" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column prop="kh" label="课号" width="190">
				</el-table-column>
				<el-table-column prop="km" label="课名" width="190">
				</el-table-column>
				<el-table-column prop="xq" label="学期" width="190">
				</el-table-column>
				<el-table-column prop="xf" label="学分" width="100">
				</el-table-column>
				<el-table-column prop="xs" label="学时" width="100">
				</el-table-column>
				<el-table-column prop="yxh" label="院系号" width="100">
				</el-table-column>
				<el-table-column prop="gh" label="教师工号" width="100">
				</el-table-column>
				<el-table-column prop="sksj" label="上课时间" width="120">
				</el-table-column>
				<el-table-column label="操作" min-width="150">
					<template scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
				</el-pagination>
			</el-col>
		</template>

	</section>
</template>
<script>
	import {find_all_course} from "../../api/api";

	export default {
		data() {
			return {
				filters: {
					kh: ''
				},
				loading: false,
				course: [],
				total: 0,
				page: 1,
			}
		},
		methods: {
			getCourse: function () {
				this.loading = true;
				find_all_course().then((res) => {
					this.course = res.data;
					this.total = res.data.length;
					console.log(res.data);
					this.loading = false;
				});
			},
			find_c_by_kh:function(){
				let para = {kh: this.filters.kh};
				this.loading = true;
			},
			handleCurrentChange(val) {
				this.page = val;
			},
		},
		mounted() {
			this.getCourse();
		}
	};

</script>

<style scoped>

</style>
