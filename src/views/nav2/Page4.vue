<template>
    <!--列表-->
    <div>
        <el-table :row-class-name="tableRowClassName" :header-cell-style="tableHeaderColor" :data="grades" ref="multipleTable"
                  highlight-current-row v-loading="listLoading" border style="width: 100%;">
            <el-table-column label ="学 生 成 绩 单" align="center">
              <el-table-column prop="xq" label="学期" width="200" align="center" >
              </el-table-column>
              <el-table-column prop="kh" label="课程号" width="200" align="center">
              </el-table-column>
              <el-table-column prop="km" label="课程名" width="200" align="center">
              </el-table-column>
              <el-table-column prop="zpcj" label="总评成绩" width="200" align="center">
              </el-table-column>
              <el-table-column prop="xf" label="学分" width="200" align="center">
              </el-table-column>
              <el-table-column prop="xm" label="教师" min-width="200" align="center">
              </el-table-column>
            </el-table-column>
        </el-table>
        <span class="tag_avg" id="avg">
            平均成绩:{avg}分
        </span>
        <el-row>
            <el-col>
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
    </div>
</template>


<script>

  import {find_score_byxh} from "../../api/api";
  import echarts from 'echarts';

  export default {
    data() {
      return {
        grades: [],
        avg:0,
        total: 0,
        page: 1,
        listLoading: false,
        editLoading: false,
      }
    },
    computed: {
    },
    methods: {
        tableRowClassName(row,rowIndex) {;
            if (row.zpcj === null) {
                return 'warning-row';
            } else if (row.zpcj >= '60') {
                return 'success-row';
            }
            else{
                return 'failure-row';
            }
        },
        tableHeaderColor({row, column, rowIndex, columnIndex}) {
            console.log(rowIndex);
            console.log(row);
            if (row === 0) {
                return 'background-color: lightblue;'
            }
        },
        getScore(){
            this.listLoading = true;
            let user =sessionStorage.getItem('user');
            user = JSON.parse(user);
            let para = {xh:user.id};
            find_score_byxh(para).then((res) => {
                this.grades = res.data;
                let i = 0;
                let sum = 0;
                let n = 0;
                for (i = 0 ;i < res.data.length;i++) {
                    if (res.data[i].zpcj !== null){
                        sum = sum + res.data[i].zpcj;
                        n++;
                    }
                }
                this.avg = sum/n;
                document.getElementById("avg").innerText="平均成绩："+this.avg+"分";
                this.listLoading = false;
                this.drawBarChart();
            });
        },
        drawBarChart() {
            this.chartBar = echarts.init(document.getElementById('chartBar'));
            let user =sessionStorage.getItem('user');
            user = JSON.parse(user);
            let x = [];
            let y = [];
            for(let i = 0;i < this.grades.length;i++){
                let result = x.findIndex((value, index, arr) => {
                    return value === this.grades[i].km;
                });
                if(result === -1){
                    x.push(this.grades[i].km);
                    y.push(this.grades[i].zpcj);
                }
                else{
                    if(this.grades[i].zpcj > y[result])
                        y[result] = this.grades[i].zpcj
                }
            }
            this.chartBar.setOption({
                title: {
                    text: '成绩分布',
                    subtext: user.xm
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['最高成绩']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: x
                },
                series: [
                    {
                        name: '最高成绩',
                        type: 'bar',
                        data: y
                    }
                ]
            });
        },
    },
    mounted() {
        this.getScore();
    }
  }

</script>
<style>
    .el-table .warning-row {
        background: lightyellow;
    }

    .el-table .success-row {
        background: lightgreen;
    }
    .el-table .failure-row {
        background: orangered;
    }
    .tag_avg{
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        font-size: 150%;
        float:right;
    }
</style>
