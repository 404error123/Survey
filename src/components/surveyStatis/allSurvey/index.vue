<!-- 全部课调统计页面 -->
<template>
  <div class="allSurvey">
		<div class="search-box clearfix">
		  <el-select v-model="selectGradeId" placeholder="请选择年级">
		  	<el-option label="--请选择年级--" :value="0"></el-option>
		    <el-option v-for="(opt, key) in gradeList" :value="opt.id" :label="opt.name" :key="key"></el-option>
		  </el-select>
			<el-select v-model="selectClassId" placeholder="请选择班级">
				<el-option label="--请选择班级--" :value="0"></el-option>
			  <el-option v-for="(opt, key) in classList" :value="opt.id" :label="opt.name" :key="key"></el-option>
			</el-select>
		  <el-select v-model="selectCourseId" placeholder="请选择课程">
		  	<el-option label="--请选择课程--" :value="0"></el-option>
		    <el-option v-for="(opt, key) in courseList" :value="opt.id" :label="opt.name" :key="key"></el-option>
		  </el-select>
			<el-select v-model="selectSurveyId" placeholder="请选择问卷">
				<el-option label="--请选择问卷--" :value="0"></el-option>
			  <el-option v-for="(opt, key) in surveyList" :value="opt.id" :label="opt.name" :key="key"></el-option>
			</el-select>
		  <el-input placeholder="请输入关键字搜索" v-model="searchCnt" clearable></el-input> 
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
		    prop="surveydate"
		    label="课调时间">
		  </el-table-column>
		  <el-table-column
		    prop="user.average"
		    label="平均分">
		  </el-table-column>
		  <el-table-column label="操作" width="245px">
		    <template slot-scope="scope">
		    	<el-button
            size="mini"
            type="info"
            @click="preview(scope.row)">预览</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleDown(scope.row)">下载</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleAnalyze(scope.row)">问卷分析</el-button>
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
      multipleSelection: [],
      formLabelWidth: '120px',
      selectGradeId: 0,
      selectClassId: 0,
      selectCourseId: 0,
      selectSurveyId: 0,
    }
  },
  computed: {
  	...mapGetters(['surveyList', 'gradeList', 'classList', 'courseList', 'surveyList']),
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
  	...mapActions(['findAllSurvey']),
  	handleAnalyze() {

  	},
  	handleDown() {

  	},
  	preview() {

  	},
  	handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  created() {
  	this.findAllSurvey()
  }
}
</script>
<style>
  .allSurvey .el-select {
  	width: 180px;
  }
</style>