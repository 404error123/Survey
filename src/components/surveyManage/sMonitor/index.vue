<!-- 课调监控页面 -->
<template>
  <div class="sMonitor">
    <div class="search-box clearfix">
      <el-input placeholder="请输入关键字搜索" v-model="searchCnt" clearable> </el-input> 
    </div>

		<el-table
		ref="multipleTable"
		:data="selectSurvey"
		tooltip-effect="dark"
		style="width: 100%"
		border
		v-if="surveyList"
		@selection-change="handleSelectionChange">
		  <el-table-column
		    type="selection"
		    width="55">
		  </el-table-column>
		  <el-table-column
		    prop="clazzVM.grade.name"
		    label="年级">
		  </el-table-column>
		  <el-table-column
		    prop="clazzVM.name"
		    label="班级">
		  </el-table-column>
		  <el-table-column
		    prop="course.name"
		    label="课程">
		  </el-table-column>
		  <el-table-column
		    prop="qnVM.name"
		    label="问卷">
		  </el-table-column>
		  <el-table-column
		    prop="user.name"
		    label="讲师">
		  </el-table-column>
		  <el-table-column
		    prop="code"
		    label="课调编号">
		  </el-table-column>
		  <el-table-column label="操作" width="245px">
		    <template slot-scope="scope">
		    	<el-button
            size="mini"
            type="info"
            @click="handleOpenSurvey(scope.row)">开启</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleSee(scope.row)">查看进度</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleEnd(scope.row)">结束</el-button>
		    </template>
		  </el-table-column>
		</el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data(){
    return {
      searchCnt: '',
      multipleSelection: []
    }
  },
  computed: {
  	...mapGetters(['surveyList']),
  	selectSurvey() {
      if(this.searchCnt) {
        return this.surveyList.filter(item => {
          if(item.qnVM.name.match(this.searchCnt)) {
            return true;
          }
        })
      } else {
        return this.surveyList;
      }
    },
  },
  methods: {
  	...mapActions(['findAllSurvey', 'openSurvey', 'closeSurvey']),
  	handleEnd(row) {
      this.closeSurvey({ id: row.id }).then(res => {
        if(res.data.stauts === 200) {
           this.$message.success({
              message: '课调关闭成功',
            })
        } else {
          this.$message.error({
              message: res.data.message,
            })
        }
      })
  	},
  	handleSee(row) {

  	},
  	handleOpenSurvey(row) {
      this.openSurvey({ id: row.id }).then(res => {
        if(res.data.stauts === 200) {
           this.$message.success({
              message: '课调开启成功',
            })
        } else {
          this.$message.error({
              message: res.data.message,
            })
        }
      })
  	},
  	handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  created() {
  	this.findAllSurvey();
  }
}
</script>
<style scoped>
  
</style>