<!-- 课调审核页面 -->
<template>
  <div class="sCheck">
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
		    prop="status"
		    label="状态">
		  </el-table-column>
		  <el-table-column label="操作" width="100px">
		    <template slot-scope="scope">
		    	<el-button
            size="mini"
            type="warning"
            @click="checkBtnSurvey(scope.row)">审核</el-button>
		    </template>
		  </el-table-column>
		</el-table>

		<el-dialog class="surveyPreview" :visible.sync="surveyCheck" width="60%" title="课调预览" @closed="clearDialog">
		  <h4>
		    <span>班级：{{questionVMs.clazzVM && questionVMs.clazzVM.name}}</span>
		    <span>讲师：{{questionVMs.user && questionVMs.user.name}}</span>
		    <span>时间：{{questionVMs.surveydate}}</span>
		    <span>课程：{{questionVMs.course && questionVMs.course.name}}</span>
		  </h4>
		  <p class="surveyTitle">问卷名称：{{questionVMs.qnVM && questionVMs.qnVM.name}}</p>
		  <div v-if="questionVMs.qnVM && questionVMs.qnVM.questionVMs.length">
		    <el-card class="box-card" v-for="(question, index) in questionVMs.qnVM.questionVMs" :key="index">
		      <div slot="header" class="clearfix">
		        <span>{{index+1 + '. ' + question.name + ' (' +question.questionType +')'}}</span>
		      </div>
		      <div v-for="(opt, i) in question.options" :key="i" class="text item">
		        {{opt.label + '：' + opt.name }}
		      </div>
		    </el-card>
		  </div>
		  <h4 v-else><i class="el-icon-warning"></i>你还没有添加课调问卷的题目！</h4>
		  <div slot="footer" class="dialog-footer">
        <el-button @click="confirmCheck(0)">审核不通过</el-button>
        <el-button type="primary" @click="confirmCheck(1)">审核通过</el-button>
      </div>
		</el-dialog>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data(){
    return {
      searchCnt: '',
      multipleSelection: [],
      surveyCheck: false,
      questionVMs: [],
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
  	...mapActions(['findAllSurvey', 'checkSurvey']),
  	checkBtnSurvey(row) {
  		this.surveyCheck = true;
  		this.questionVMs = row;
  	},
  	handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearDialog() {
  		this.questionVMs = [];
    },
    confirmCheck(no) {
  		this.checkSurvey({ id: this.questionVMs.id, status: no }).then(res => {
  			if(res.data.stauts === 200) {
  	       this.$message.success({
  	          message: '课调审核成功',
  	        })
  	    } else {
  	      this.$message.error({
  	          message: res.data.message,
  	        })
  	    }
  		});
    	this.surveyCheck = false;
	  	this.findAllSurvey();
    }
  },
  created() {
  	this.findAllSurvey();
  }
}
</script>
<style scoped>
  
</style>