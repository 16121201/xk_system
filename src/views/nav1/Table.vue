<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.xh" placeholder="学号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="find_s_by_xh">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="students" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column prop="xh" label="学号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="xm" label="姓名" width="150" sortable>
			</el-table-column>
			<el-table-column prop="xb" label="性别" width="100"  sortable>
			</el-table-column>
			<el-table-column prop="csrq" label="出生日期" width="150" sortable>
			</el-table-column>
			<el-table-column prop="jg" label="籍贯" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sjhm" label="手机号码" width="200" sortable>
			</el-table-column>
			<el-table-column prop="yxh" label="院系号" min-width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="学号" prop="xh">
					<el-input v-model="editForm.xh" auto-complete="off" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="xm">
					<el-input v-model="editForm.xm" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.xb">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="出生日期" prop="csrq">
					<el-input type="date" v-model="editForm.csrq" placeholder="选择日期"></el-input>
				</el-form-item>
				<el-form-item label="籍贯" prop="jg">
					<el-input v-model="editForm.jg" auto-complete="off"></el-input>
				</el-form-item>
				<!--<el-form-item label="生日">-->
					<!--<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>-->
				<!--</el-form-item>-->
				<el-form-item label="手机号码" prop="sjhm">
					<el-input v-model="editForm.sjhm" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="院系号" prop="yxh">
					<el-input v-model="editForm.yxh" auto-complete="off" :disabled="true"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import {find_all_students, find_students_bygh, find_students_byxh, UpdateStudents} from '../../api/api';


	export default {
		data() {
			return {
				filters: {
					xh: ''
				},
				students: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					xh: 0,
					xm: '',
					xb: -1,
					csrq: '',
					jg: '',
					sjhm: '',
					yxh:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.xb == 1 ? '男' : row.xb == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {

				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							console.log(para);
							para.csrq = (!para.csrq || para.csrq == '') ? '' : util.formatDate.format(new Date(para.csrq), 'yyyy-MM-dd');
							UpdateStudents(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.find_all_s();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			find_all_s:function () {
				//NProgress.start();
				this.listLoading = true;
				var user = sessionStorage.getItem('user');
				user = JSON.parse(user);
				console.log(user);
				if(user.permission === 1){
					let para = {gh:user.id};
					find_students_bygh(para).then((res) => {
						this.total = res.data.length;
						this.students = res.data;
						this.listLoading = false;
					});
				}
				else{
					find_all_students().then((res) => {
						this.total = res.data.length;
						this.students = res.data;
						this.listLoading = false;
					});
				}
			},
			find_s_by_xh:function () {
				this.listLoading = true;
				if(this.filters.xh === ''){
					this.find_all_s();
				}
				else{
					let para = {xh: this.filters.xh};
					find_students_byxh(para).then((res) => {
						this.students = res.data;
						this.listLoading = false;
					});
				}
			}
		},
		mounted() {
			this.find_all_s();
		}
	}

</script>

<style scoped>

</style>
