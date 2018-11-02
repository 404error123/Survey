<!-- 课调管理页面 -->
<template>
  <div class="sManage">
    <div class="search-box clearfix">
      <el-input placeholder="请输入关键字搜索" v-model="searchCnt" clearable> </el-input> 
      <div class="btn-box">
        <el-button type="primary" @click="dialogFormVisible = true">增加</el-button>
        <el-button type="danger" @click="deletebatch">批量删除</el-button>
      </div>
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
		  <el-table-column label="操作" width="230px">
		    <template slot-scope="scope">
		    	<el-button
            size="mini"
            type="info"
            @click="preview(scope.row)">预览</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
		    </template>
		  </el-table-column>
		</el-table>
  	
		<el-dialog width="40%" :title="dialogmess" :visible.sync="dialogFormVisible" @closed="clearDialog" @open="addSurvey">
      <el-form>
      	<el-form-item label="年级" :label-width="formLabelWidth">
          <el-select v-model="form[0]" placeholder="请选择年级" @change="form[1] = 0">
          	<el-option label="--请选择--" :value="0"></el-option>
            <el-option v-for="(opt, key) in gradeList" :value="opt.id" :label="opt.name" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-select v-model="form[1]" placeholder="请选择班级" :disabled="classDisabled">
          	<el-option label="--请选择--" :value="0"></el-option>
            <el-option v-for="(opt, key) in selectClass" :value="opt.id" :label="opt.name" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程" :label-width="formLabelWidth">
          <el-select v-model="form[2]" placeholder="请选择课程">
          	<el-option label="--请选择--" :value="0"></el-option>
            <el-option v-for="(opt, key) in courseList" :value="opt.id" :label="opt.name" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问卷" :label-width="formLabelWidth">
          <el-select v-model="form[3]" placeholder="请选择问卷">
          	<el-option label="--请选择--" :value="0"></el-option>
            <el-option v-for="(opt, key) in questionnaire" :value="opt.id" :label="opt.name" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="讲师" :label-width="formLabelWidth">
          <el-select v-model="form[4]" placeholder="请选择讲师">
          	<el-option label="--请选择--" :value="0"></el-option>
            <el-option v-for="(opt, key) in teacherList" :value="opt.id" :label="opt.name" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课调时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form[6]"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSave">确 定</el-button>
      </div>
    </el-dialog>
  
    <el-dialog class="surveyPreview" :visible.sync="surveyPreview" width="60%" title="课调预览">
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
     	dialogFormVisible: false,
     	dialogmess: '新增课调',
     	form: [],
     	formLabelWidth: '120px',
      classListSelect: [],
      classDisabled: true,
      surveyPreview: false,
      questionVMs: []
    }
  },
  computed: {
  	...mapGetters(['surveyList', 'classList', 'gradeList', 'courseList', 'questionnaire', 'teacherList']),
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
    selectClass() {
      if(this.form[0]) {
        this.classDisabled = false;
      } else {
        this.classDisabled = true;
      }
      return this.classList.filter(item => {
        if(item.grade) {
          return item.grade.id === this.form[0];
        }
      })
    }
  },
  methods: {
  	...mapActions(['findAllSurvey', 'findSurveyById', 'deleteSurveyById', 'batchDelete', 'getGrade', 'getClass', 'getCourse', 'getTeacher', 'getNaire', 'saveSurvey']),
  	deletebatch() {
    	if(this.multipleSelection.length) {
    		var arr = this.multipleSelection.map((item) => {
    		  return item.id;
    		})
    		this.batchDelete({ ids: arr.join() }).then((res) => {
    		  if(res.data.stauts === 200) {
    		    this.findAllSurvey();
    		    this.$notify.success({
    		      title: '成功',
    		      message: '批量删除成功'
    		    });
    		  } else {
    		    this.$notify.error({
    		      title: '失败',
    		      message: '批量删除失败'
    		    });
    		  }
    		})
    	} else {
    		this.$notify.warning({
		      title: '警告',
		      message: '请选择删除内容'
		    });
    	}
  	},
  	handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(row) {
    	this.deleteSurveyById({ id: row.id }).then(res => {
    		if(res.data.stauts === 200) {
          this.findAllSurvey();
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          });
        } else {
          this.$notify.error({
            title: '失败',
            message: '删除失败'
          });
        }
    	})
    },
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.classDisabled = false;
      this.form[0] = row.clazzVM.grade.id;
      this.form[1] = row.clazzVM.id;
      this.form[2] = row.course.id;
      this.form[3] = row.qnVM.id;
      this.form[4] = row.user.id;
      this.form[5] = row.id;
      this.form[6] = row.surveydate;
    },
    preview(row) {
      this.questionVMs = row;
      this.surveyPreview = true;
    },
    clearDialog() {
      this.form = [];
      this.questionVMs = [];
      this.classDisabled = true;
    },
    addSurvey() {
    	this.getGrade();
    	this.getClass();
    	this.getCourse();
    	this.getTeacher();
    	this.getNaire();
    },
    confirmSave() {
      var data = {
        id: this.form[5],
        clazzId: this.form[1],
        courseId: this.form[2],
        questionnaireId: this.form[3],
        userId: this.form[4],
        surveydate: this.form[6]
      };
      this.saveSurvey(data).then(res => {
        if(res.data.stauts === 200) {
          this.findAllSurvey();
          this.dialogFormVisible = false;
          this.$notify.success({
            title: '成功',
            message: '修改成功'
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '修改失败'
          });
        }
      })
    },
  },
  created() {
  	this.findAllSurvey()
  }
}
</script>
<style>
  
</style>