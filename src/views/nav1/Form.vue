<template>
	<div>
		<el-row :gutter="20" style="margin-top: 20px;min-height: 400px">
			<el-col :span="16">
				<el-table :data="course" ref="multipleTable" highlight-current-row v-loading="listLoading" border style="width: 100%;"
						  @row-click="handle_row">
					<el-table-column label ="已 开 课 程" align="center">
						<el-table-column prop="xq" label="学期" width="200" align="center" >
						</el-table-column>
						<el-table-column prop="kh" label="课程号" width="200" align="center">
						</el-table-column>
						<el-table-column prop="km" label="课程名" width="200" align="center">
						</el-table-column>
						<el-table-column prop="xf" label="学分" min-width="100" align="center">
						</el-table-column>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :span="8">
				<el-table :data="students" ref="multipleTable" highlight-current-row v-loading="studentsLoading" v-show="studentsVisible" border style="width: 100%;">
					<el-table-column label ="选 修 学 生" align="center">
						<el-table-column prop="xh" label="学号" width="100" align="center" >
						</el-table-column>
						<el-table-column prop="xm" label="姓名" width="100" align="center">
						</el-table-column>
						<el-table-column prop="zpcj" label="成绩" min-width="100" align="center">
						</el-table-column>
						<el-table-column label="操作" min-width="100" align="center">
							<template scope="scope">
								<el-button type="primary"  size="small" @click="updateGrade(scope.$index, scope.row)">录入</el-button>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :span="8" class="toolbar" style="float: right;height: 50px;width:403px;margin-right: 10px;" v-show="studentsVisible">
				<el-button type="danger" size="small" @click.native="studentsVisible = false" style="float:left;margin-bottom: 8px;">×</el-button>
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page"
							   :page-size="page_size" :total="total" style="float:right;">
				</el-pagination>
			</el-col>
		</el-row >
		<el-row style="margin-top: 60px" v-show="studentsVisible">
			<el-col :span="12">
				<div id="chartColumn" style="width:100%; height:400px;"></div>
			</el-col>
			<el-col :span="12">
				<div id="chartPie" style="width:100%; height:400px;"></div>
			</el-col>
		</el-row>

		<!--成绩录入界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px"  ref="editForm">
				<el-form-item label="学号" prop="xh">
					<el-input v-model="editForm.xh" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="xm">
					<el-input v-model="editForm.xm" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="平时成绩" prop="pscj">
					<el-input-number v-model="editForm.pscj" auto-complete="off" :min="0" :max="100"></el-input-number>
				</el-form-item>
				<el-form-item label="考试成绩" prop="kscj">
					<el-input-number v-model="editForm.kscj" auto-complete="off" :min="0" :max="100"></el-input-number>
				</el-form-item>
				<el-form-item label="总评成绩" prop="zpcj">
					<el-input-number v-model="editForm.zpcj" auto-complete="off" :min="0" :max="100"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {find_course_bygh, find_students_bycourse, update_grade} from "../../api/api";
	import echarts from 'echarts';

	export default {
		data() {
			return {
				page:1,
				total:0,
				page_size:5,
				course:[],
				students:[],
				listLoading: false,
				studentsLoading:false,
				studentsVisible:false,
				//暂存选中的课程
				cache:{
					xq:'',
					kh:'',
					gh:'',
					row:''
				},
				//成绩录入界面数据
				editFormVisible: false,
				editLoading: false,
				editForm: {
					xh:'',
					xm:'',
					zpcj:'',
					pscj:'',
					kscj:''
				},
			}
		},
		methods: {
			find_course(){
				this.listLoading = true;
				let user =sessionStorage.getItem('user');
				user = JSON.parse(user);
				let para = {gh:user.id};
				find_course_bygh(para).then((res) => {
					this.course = res.data;
					this.listLoading = false;
				});
			},
			handle_row(row){
				this.studentsVisible = true;
				this.studentsLoading = true;
				let user =sessionStorage.getItem('user');
				user = JSON.parse(user);
				this.cache.gh = user.id;
				this.cache.xq = row.xq;
				this.cache.kh = row.kh;
				this.cache.row = row;
				let para = {gh:user.id,xq:row.xq,kh:row.kh};
				find_students_bycourse(para).then((res) => {
					this.total = res.data.length;
					this.drawColumnChart(res.data);
					this.drawPieChart(res.data);
					if(this.total === 0){
						this.$message({
							message: '该课程无人选修',
							type: 'warning'
						});
					}
					else{
						let para0 = para;
						para0.page = this.page;
						para0.page_size = this.page_size;
						find_students_bycourse(para0).then((res) => {
							this.students = res.data;
							this.studentsLoading = false;
						});
					}
				});
			},
			handleCurrentChange(val) {//点击下一页时执行
				this.page = val;
				this.handle_row(this.cache.row)
			},
			updateGrade(index,row){
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			editSubmit(){
				let para = this.editForm;
				let user =sessionStorage.getItem('user');
				user = JSON.parse(user);
				para.gh = user.id;
				para.xq = this.cache.xq;
				para.kh = this.cache.kh;
				update_grade(para).then((res) => {
					if(res.status === 200){
						this.$message({
							message: '录入成功',
							type: 'success'
						});
						this.editFormVisible = false;
						this.handle_row(this.cache.row);
					}
					else
						this.$message({
							message: '录入失败',
							type: 'error'
						});
				})
			},
			drawColumnChart(data) {
				this.chartColumn = echarts.init(document.getElementById('chartColumn'));
				let x = [];
				let y = [];
				for(let i = 0;i < data.length;i++){
					if(data[i].zpcj !== ''){
						x[i] = '';
						y[i] = data[i].zpcj;
					}
				}
				this.chartColumn.setOption({
					title: { text:this.cache.row.km+'成绩分布'},
					tooltip: {},
					xAxis: {
						data: x
					},
					yAxis: {},
					series: [{
						name: '分数',
						type: 'bar',
						data: y
					}]
				});
			},
			drawPieChart(data) {
				this.chartPie = echarts.init(document.getElementById('chartPie'));
				let grade = [0,0,0,0,0];
				for(let i = 0;i < data.length;i++){
					let cj = data[i].zpcj;
					if(cj >= 90 )
						grade[0]++;
					else if(cj >= 80 && cj <= 89)
						grade[1]++;
					else if(cj >= 70 && cj <= 79)
						grade[2]++;
					else if(cj >= 60 && cj <= 69)
						grade[3]++;
					else if(cj === 60)
						grade[4]++;
				}
				let option ={
					title: {
						text: this.cache.row.km,
						subtext: '成绩分布',
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						data: ['优秀90-100', '良好80-89', '中70-79', '及格60-69', '不合格0-59']
					},
					series: [
						{
							name: '总评成绩',
							type: 'pie',
							radius: '55%',
							center: ['50%', '60%'],
							data: [
								{ value: grade[0], name: '优秀90-100' ,itemStyle:{
										normal:{
											label:{
												show: true,
											},
											labelLine: {
												show: true
											}
										}
									}},
								{ value: grade[1], name: '良好80-89' ,itemStyle:{
										normal:{
											label:{
												show: true,
											},
											labelLine: {
												show: true
											}
										}
									}},
								{ value: grade[2], name: '中70-79' ,itemStyle:{
										normal:{
											label:{
												show: true,
											},
											labelLine: {
												show: true
											}
										}
									}},
								{ value: grade[3], name: '及格60-69' ,itemStyle:{
										normal:{
											label:{
												show: true,
											},
											labelLine: {
												show: true
											}
										}
									}},
								{ value: grade[4], name: '不合格0-59' ,itemStyle:{
										normal:{
											label:{
												show: true,
											},
											labelLine: {
												show: true
											}
										}
									}}
							],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				};
				let opt = option.series[0].data;
				for(let i = 0;i < 5;i++){
					if(opt[i].value === 0){
						opt[i].itemStyle.normal.labelLine.show = false;
						opt[i].itemStyle.normal.label.show = false;
					}
				}
				this.chartPie.setOption(option);
			},
		},

		mounted() {
			this.find_course();
		}
	}

</script>
<style>

</style>
