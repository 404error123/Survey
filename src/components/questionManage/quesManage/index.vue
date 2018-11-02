<!-- 题目管理页面 -->
<template>
  <div class="quesManage">
    <div class="search-box clearfix">
      <el-select v-model="selectgradeId" placeholder="请选择题目类型">
        <el-option label="--请选择题目类型--" :value="0"></el-option>
        <el-option v-for="(type, key) in typeList" :value="type" :key="key"></el-option>
      </el-select>
      <el-input placeholder="请输入关键字搜索" v-model="searchCnt" clearable> </el-input> 
      <div class="btn-box">
        <el-button type="primary" @click="dialogFormVisible = true">增加</el-button>
        <el-button type="danger" @click="deletebatch">批量删除</el-button>
      </div>
    </div>

    <div class="question-box">
    	<el-card class="box-card" v-for="(question, index) in filterQuestion" :key="index">
    	  <div slot="header" class="clearfix">
    	    <span>序号{{index + 1 + '：' + question.name}}</span>
          <span class="question-type">({{ question.questionType }})</span>
    	    <el-button style="float: right; padding: 3px 0" type="text">
    	    	<el-checkbox v-model="checked[index]" @change="changeSelect(index, question.id)">选择</el-checkbox>
    	    </el-button>
    	  </div>
    	  <div v-for="(opt, i) in question.options" class="text item" :key="i">
    	    {{opt.label + "：" + opt.name}}
    	  </div>
    	  <span class="btn el-icon-edit btn1" @click="editQuestion(question)"></span>
        <span class="btn el-icon-delete btn2" @click="deleteQues(question.id)"></span>
    	</el-card>
    </div>

		<el-dialog width="50%" :title="dialogmess" :visible.sync="dialogFormVisible" @closed="clearDialog">
		  <el-form :model="form">
				<el-form-item label="题目名称" :label-width="formLabelWidth">
		      <el-input v-model="form.name" autocomplete="off"></el-input>
		    </el-form-item>
		  	<el-form-item label="题目类型" :label-width="formLabelWidth">
		      <el-select v-model="form.questionType" placeholder="请选择题目类型">
		      	<el-option label="--请选择--" :value="0"></el-option>
		        <el-option v-for="(type, key) in typeList" :value="type" :key="key"></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="题目选项" :label-width="formLabelWidth" v-if="form.questionType !== '简答题'">
		      <el-table :data="options" border style="width: 100%">
		      	<el-table-column type="index" width="60" label="序号"></el-table-column>
		      	<el-table-column label="label">
              <template slot-scope="scope">
                <el-input placeholder="请输入选项" v-model="scope.row.label"></el-input>
              </template>
            </el-table-column>
		      	<el-table-column label="选项">
              <template slot-scope="scope">
                <el-input placeholder="请输入选项内容" v-model="scope.row.name"></el-input>
              </template>
            </el-table-column>
		      	<el-table-column label="分值">
              <template slot-scope="scope">
                <el-input placeholder="请输入分值" v-model="scope.row.score"></el-input>
              </template>
            </el-table-column>
		      	<el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="deleteOpt(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
		      </el-table>
		    </el-form-item>
		  </el-form>
      <span class="el-icon-circle-plus-outline add-btn" @click="addSelect"></span>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="confirmSave">确 定</el-button>
		  </div>
		</el-dialog>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data(){
    return {
      dialogmess: '修改题目信息',
      searchCnt: '',
      dialogFormVisible: false,
      checked: [],
      formLabelWidth: '120px',
      form: {},
      typeList: ['单选题', '简答题'],
      options: [],
      selection: [],
      selectgradeId: 0
    }
  },
  computed: {
  	...mapGetters(['questionList']),
    filterQuestion() {
      return this.selectQuestion.filter((item) => {
        if(this.selectgradeId === 0) {
          return true;
        } else {
          if(item.questionType) {
            return item.questionType === this.selectgradeId;
          }
        }
      })
    },
    selectQuestion() {
      if(this.searchCnt) {
        return this.questionList.filter(item => {
          if(item.name.match(this.searchCnt)) {
            return true;
          }
        })
      } else {
        return this.questionList;
      }
    }
  },
  created() {
  	this.getQuestion()
  },
  methods: {
  	...mapActions(['getQuestion', 'saveQuestion', 'deleteQusetion', 'deletebatchQuestion']),
  	deletebatch() {
      if(this.selection.length) {
        this.deletebatchQuestion({ ids: this.selection.join() }).then((res) => {
           if(res.data.stauts === 200) {
            this.getQuestion();
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
  	confirmSave() {
      this.form.options = this.options;
      this.saveQuestion(this.form).then(res => {
        if(res.data.stauts === 200) {
          this.getQuestion();
          this.dialogFormVisible = false;
          this.$notify.success({
            title: '成功',
            message: '保存成功'
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '保存失败'
          });
        }
      })
  	},
  	clearDialog() {
      this.form = {};
      this.options = []
    },
    deleteOpt(index) {
      this.options.splice(index,1)
    },
    deleteQues(id) {
      this.deleteQusetion({ id: id }).then(res => {
        if(res.data.stauts === 200) {
          this.getQuestion();
          this.$notify.success({
            title: '成功',
            message: '删除成功'
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '删除失败'
          });
        }
      })
    },
    changeSelect(index, id) {
      this.checked.forEach((item, i) => {
        if(item && i === index) {
          this.selection.push(id);
        } else {
          this.selection = this.selection.filter(item => {
            return item !== id;
          })
        }
      })
    },
    editQuestion(question) {
      this.dialogFormVisible = true;
      this.form = JSON.parse(JSON.stringify(question));
      this.options = this.form.options
    },
    addSelect() {
      this.options.push({});

    }
  }
}
</script>
<style scoped>
	.quesManage .question-box {
		max-height: 600px;
		overflow-y: scroll;
	}
	.quesManage .question-box .el-card {
		box-sizing: border-box;
		padding: 0 40px;
	}
  .quesManage .question-box .question-type {
    padding-left: 20px;
  }
  .quesManage .box-card {
  	position: relative;
  	margin-bottom: 40px;
  	min-height: 160px;
  }
  .quesManage .box-card .btn {
		position: absolute;
		bottom: 10px;
		width: 50px;
		line-height: 50px;
		font-size: 34px;
		text-align: center;
		cursor: pointer;
		border: 1px solid #ccc;
		border-radius: 4px;
  }
  .quesManage .box-card .btn1 {
    right: 150px;
  }
  .quesManage .box-card .btn2 {
    right: 80px;
  }
  .quesManage .box-card .btn:hover {
  	color: #409EFF;
  }
  .quesManage .el-dialog {
    position: relative;
  }
  .quesManage .el-dialog .add-btn {
    position: absolute;
    right: 40px;
    bottom: 70px;
    width: 40px;
    line-height: 40px;
    font-size: 40px;
    cursor: pointer;
    color: #999;
  }
  .quesManage .el-dialog .add-btn:hover {
    color: #333
  }
</style>