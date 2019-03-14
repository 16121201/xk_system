<template>
	<div id = "course">
		<el-table :data="grades" ref="multipleTable"
				  highlight-current-row v-loading="listLoading" border style="width: 100%;">
			<el-table-column label ="已 选 课 程" align="center">
				<el-table-column prop="xq" label="学期" width="200" align="center" >
				</el-table-column>
				<el-table-column prop="kh" label="课程号" width="200" align="center">
				</el-table-column>
				<el-table-column prop="km" label="课程名" width="200" align="center">
				</el-table-column>
				<el-table-column prop="zpcj" label="总评成绩" width="200" align="center">
				</el-table-column>
				<el-table-column prop="xf" label="学分" width="100" align="center">
				</el-table-column>
				<el-table-column prop="xm" label="教师" min-width="200" align="center">
				</el-table-column>
				<el-table-column label="操作" min-width="100" align="center">
					<template scope="scope">
						<el-button type="danger" :disabled="isCancel(scope.$index)" size="small" @click="cancelCourse(scope.$index, scope.row)">退课</el-button>
					</template>
				</el-table-column>
			</el-table-column>
		</el-table>
		<el-row :gutter="20" >
			<span class="search">
				查询条件
			</span>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="2" class="label" align="center">
				<span>
					课程号：
				</span>
			</el-col>
			<el-col :span="8" class="label" align="center">
				<el-input v-model="kh" placeholder="请输入课号" size="small" clearable>
				</el-input>
			</el-col>
			<el-col :span="2" :offset="4" class="label" align="center">
				<span>
					课程名：
				</span>
			</el-col>
			<el-col :span="8" class="label" align="center">
				<el-input v-model="km" placeholder="请输入课名" size="small" clearable>
				</el-input>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="2" class="label" align="center">
				<span>
					教师号：
				</span>
			</el-col>
			<el-col :span="8" class="label" align="center">
				<el-input v-model="gh" placeholder="请输入教师号" size="small" clearable>
				</el-input>
			</el-col>
			<el-col :span="2" :offset="4" class="label" align="center">
				<span>
					教师名：
				</span>
			</el-col>
			<el-col :span="8" class="label" align="center">
				<el-input v-model="xm" placeholder="请输入教师名" size="small" clearable>
				</el-input>
			</el-col>
		</el-row>
		<el-row>
			<el-button type="primary" v-on:click="find_course" class="chaxun">查询</el-button>
			<el-button type="primary" v-on:click="input_reset" class="chaxun">重置</el-button>
		</el-row>
		<el-table :data=course v-if="flag" v-loading="searchLoading" style="margin-top: 20px">
			<el-table-column prop="xq" label="学期" width="170" align="center" >
			</el-table-column>
			<el-table-column prop="kh" label="课程号" width="170" align="center">
			</el-table-column>
			<el-table-column prop="km" label="课程名" width="170" align="center">
			</el-table-column>
			<el-table-column prop="xf" label="学分" width="170" align="center" sortable>
			</el-table-column>
			<el-table-column prop="xm" label="教师" width="170" align="center">
			</el-table-column>
			<el-table-column prop="gh" label="工号" width="170" align="center">
			</el-table-column>
			<el-table-column label="操作" min-width="150" align="center">
				<template scope="scope">
					<el-button type="primary" :disabled="isSelected(scope.row)" size="small" plain @click="selectCourse(scope.$index, scope.row)">选课</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" v-if="flag" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page"
						   :page-size="page_size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</div>
</template>

<script>
	import {add_course, delete_course, find_course, find_score_byxh} from "../../api/api";

	export default {
		data() {
			return {
				page:1,
				total:0,
				page_size:5,
				grades: [],//已选课程
				kh:'',
				km:'',
				gh:'',
				xm:'',
				course:[],//查询课程
				flag:false,
				listLoading: false,
				searchLoading: false,
			}
		},
		computed: {
		},
		watch: {
			updated(){
				this.$nextTick(() => {
					var div = document.getElementById('course');
					setTimeout(function () {
						div.scrollTop = 5000;
					}, 3000);
				});
			},
		},
		methods: {
			isCancel(index){
				return this.grades[index].zpcj !== null;
			},
			isSelected(course){
				let i = 0;
				for	(i = 0; i < this.grades.length ;i++){
					if(course.kh === this.grades[i].kh && course.xq === this.grades[i].xq && course.xm === this.grades[i].xm){
						return true;
					}
				}
				return false;
			},
			updated(){
				this.$nextTick(() => {
					var div = document.getElementById('course');
					setTimeout(function () {
						div.scrollTop = 5000;
						// console.log(div.scrollTop);
						// console.log(div.scrollHeight);
						// console.log(div.clientHeight);
					}, 3000);
				});
				var scrollTop = window.pageYOffset;
			},
			getScore(){
				this.updated();
				this.listLoading = true;
				let user =sessionStorage.getItem('user');
				user = JSON.parse(user);
				let para = {xh:user.id};
				find_score_byxh(para).then((res) => {
					this.grades = res.data;
					this.listLoading = false;
				});
			},
			find_course(){
				this.updated();
				if(this.kh === '' && this.km === '' && this.gh === '' && this.xm === ''){
					this.$message({
						dangerouslyUseHTMLString: true,
						message: '至少填写一个选课条件',
						type:'error'
					});
					return;
				}
				this.searchLoading = true;
				let para0 = {kh:this.kh,km:this.km,gh:this.gh,xm:this.xm,page:''};
				find_course(para0).then((res) => {
					this.total = res.data.length;
					if(this.total === 0){
						this.$message({
							message: '没有符合条件的课程',
							type: 'error'
						});
						this.flag = false;
						this.searchLoading = false;
					}
					else{
						let para = {kh:this.kh,km:this.km,gh:this.gh,xm:this.xm,page:this.page,page_size: this.page_size};
						this.flag = true;
						find_course(para).then((res) => {
							this.course = res.data;
							this.searchLoading = false;
						});
					}
				});
			},
			input_reset(){
				this.kh = '';
				this.km = '';
				this.gh = '';
				this.xm = '';
			},
			selectCourse(index,course){
				let user =sessionStorage.getItem('user');
				user = JSON.parse(user);
				let para = {xh:user.id,xq:course.xq,kh:course.kh,gh:course.gh};
				add_course(para).then((res) => {
					if(res.status === 200)
						this.$message({
							message: '选课成功',
							type: 'success'
						});
					else
						this.$message({
							message: '选课失败',
							type: 'error'
						});
				});
				this.getScore();
				this.find_course();
			},
			cancelCourse(index,course){
				let user =sessionStorage.getItem('user');
				user = JSON.parse(user);
				let para = {xh:user.id,xq:course.xq,kh:course.kh,xm:course.xm};
				delete_course(para).then((res) => {
					if(res.status === 200)
						this.$message({
							message: '退课成功',
							type: 'success'
						});
					else
						this.$message({
							message: '退课失败',
							type: 'error'
						});
					this.getScore();
				});
			},
			handleCurrentChange(val) {//点击下一页时执行
				this.page = val;
				this.find_course();
			},
		},
		mounted() {
			this.getScore();
		}
	}
</script>

<style>
	.search{
		font-family: "微软雅黑",serif;
		font-size: 150%;
		float:left;
		margin-left: 10px;
		font-weight: bold;
		margin-top: 20px;
		color:#475669;
	}
	.label{
		font-family: "微软雅黑",serif;
		margin-top: 20px;
		font-size: 130%;
	}
	.chaxun{
		float:right;
		margin-right: 0px;
		margin-top: 20px;
		margin-left: 20px;
	}
</style>
