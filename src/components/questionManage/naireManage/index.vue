<!-- 问卷管理页面 -->
<template>
  <div class="naireManage">
    <div class="search-box clearfix">
      <el-input placeholder="请输入关键字搜索" v-model="searchCnt" clearable> </el-input> 
      <div class="btn-box">
        <el-button type="primary" @click="dialogFormVisible = true">增加</el-button>
        <el-button type="danger" @click="deletebatch">批量删除</el-button>
      </div>
    </div>

    <el-table
    ref="multipleTable"
    :data="selectNaire"
    tooltip-effect="dark"
    style="width: 100%"
    border
    v-if="questionnaire"
    @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="问卷名称">
      </el-table-column>
      <el-table-column
        prop="description"
        label="问卷描述">
      </el-table-column>
      <el-table-column label="操作">
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
    
    <el-dialog class="wai-dialog" width="40%" :title="dialogmess" :visible.sync="dialogFormVisible" @closed="clearDialog">
      <el-form :model="form">
        <el-form-item label="问卷名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问卷描述" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="请输入内容"
            v-model="form.description">
          </el-input>
        </el-form-item>
        <el-form-item label="题目列表" :label-width="formLabelWidth">
          <el-button round class="select-btn" @click="addQuestion">请选择</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSave">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogFormVisible2" width="550px" title="选择题目">
      <el-transfer v-model="value" :data="questions"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirmSave2">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="qusetionPreview" :visible.sync="dialogQusetionPreview" width="50%" title="问卷预览">
      <h4><i class="el-icon-success"></i>{{previewQuestion.name}}</h4>
      <div v-if="previewQuestion.questionVMs && previewQuestion.questionVMs.length">
        <el-card class="box-card" v-for="(question, index) in previewQuestion.questionVMs" :key="index">
          <div slot="header" class="clearfix">
            <span>{{index+1 + '. ' + question.name + ' (' +question.questionType +')'}}</span>
          </div>
          <div v-for="(opt, i) in question.options" :key="i" class="text item">
            {{opt.label + '：' + opt.name }}
          </div>
        </el-card>
      </div>
      <p v-else><i class="el-icon-warning"></i> 该问卷没有题目</p>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data(){
    return {
     searchCnt: '',
     dialogFormVisible: false,
     dialogFormVisible2: false,
     dialogQusetionPreview: false,
     dialogmess: '创建问卷',
     multipleSelection: [],
     formLabelWidth: '100px',
     form: {},
     value: [],
     previewQuestion: []
    }
  },
  computed: {
    ...mapGetters(['questionnaire', 'questionList']),
    questions() {
      return this.questionList.map((item) => {
        return {
          key: item.id,
          label: item.name
        }
      })
    },
    selectNaire() {
      if(this.searchCnt) {
        return this.questionnaire.filter(item => {
          if(item.name.match(this.searchCnt)) {
            return true;
          }
        })
      } else {
        return this.questionnaire;
      }
    }
  },
  methods: {
    ...mapActions(['getNaire', 'saveNaire', 'deleteNaire', 'deletebatchNaire', 'getQuestion', 'findQuestionById']),
  	deletebatch() {
  		if(this.multipleSelection.length) {
        var arr = this.multipleSelection.map((item) => {
          return item.id;
        })
        this.deletebatchNaire({ ids: arr.join() }).then((res) => {
           if(res.data.stauts === 200) {
            this.getNaire();
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
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.form = JSON.parse(JSON.stringify(row));
      this.findQuestionById({ id: row.id }).then(res => {
        this.value = res.data.data.questionVMs.map(item => {
          return item.id;
        })
      })
    },
    handleDelete(row) {
      this.deleteNaire({ id: row.id }).then((res) => {
        if(res.data.stauts === 200) {
          this.getNaire();
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
    preview(row){
      this.dialogQusetionPreview = true;
      this.findQuestionById({ id: row.id }).then(res => {
        this.previewQuestion = res.data.data
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearDialog() {
      this.form = {};
      this.value = [];
    },
    confirmSave() {
      var data = {
        id: this.form.id,
        questionIds: this.value && this.value.join(),
        name: this.form.name,
        description: this.form.description
      }
      this.saveNaire(data).then(res => {
        if(res.data.stauts === 200) {
          this.getNaire();
          this.dialogFormVisible = false;
          this.$notify.success({
            title: '成功',
            message: '添加或修改成功'
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: '添加或修改失败'
          });
        }
      })
    },
    confirmSave2() {
      if(this.value.length) {
        this.dialogFormVisible2 = false;
      } else {
        this.$notify.warning({
          title: '警告',
          message: '请选择内容'
        });
      }
    },
    addQuestion() {
      this.dialogFormVisible2 = true;
      this.getQuestion();
    }
  },
  created() {
    this.getNaire();
  }
}
</script>
<style>
  .naireManage .select-btn {
    width: 100%;
  }
  .naireManage .qusetionPreview .box-card {
    margin-bottom: 20px;
  }
  .qusetionPreview .el-dialog__body {
    max-height: 560px;
    overflow-y: scroll;
  }
  .qusetionPreview h4 {
    margin-top: -20px;
    line-height: 40px;
    font-size: 24px;
    color: #666;
  }
  .qusetionPreview h4 i {
    margin-right: 10px;
  }
</style>