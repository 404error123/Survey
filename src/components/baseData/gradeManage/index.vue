<!-- 年级管理页面 -->
<template>
  <div class="gradeManage">
    <div class="search-box clearfix">
      <el-input placeholder="请输入关键字搜索" v-model="searchCnt" @keydown.enter.native="search" clearable> </el-input> 
      <div class="btn-box">
        <el-button type="primary" @click="dialogFormVisible = true">增加</el-button>
        <el-button type="danger" @click="deletebatch">批量删除</el-button>
      </div>
    </div>

    <el-table
    ref="multipleTable"
    :data="selectGradeList"
    tooltip-effect="dark"
    style="width: 100%"
    border
    v-if="gradeList"
    @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="descriptioin"
        label="简介">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="40%" :title="dialogmess" :visible.sync="dialogFormVisible" @closed="clearDialog">
      <el-form :model="form">
        <el-form-item label="年级名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级介绍" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="请输入内容"
            v-model="form.des">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      dialogmess: '修改年级信息',
      dialogFormVisible: false,
      formLabelWidth: '100px',
      form: {},
      searchCnt: '',
      multipleSelection: []
    }
  },
  computed: {
  	...mapGetters(['gradeList']),
    selectGradeList() {
      if(this.searchCnt) {
        return this.gradeList.filter(item => {
          if(item.name.match(this.searchCnt)) {
            return true;
          }
        })
      } else {
        return this.gradeList;
      }
    }
  },
  methods: {
    ...mapActions(['getGrade', 'deleteGrade', 'saveGrade', 'deletebatchGrade']),
  	toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.form = JSON.parse(JSON.stringify(row));
    },
    confirmSave() {
      this.saveGrade(this.form).then((res) => {
        if(res.data.stauts === 200) {
          this.getGrade();
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
    handleDelete(row) {
      this.deleteGrade({ id: row.id }).then((res) => {
        if(res.data.stauts === 200) {
          this.getGrade();
          this.$notify.success({
            title: '成功',
            message: '删除年级成功'
          });
        } else {
          this.$notify.error({
            title: '失败',
            message: '删除失败'
          });
        }
      })
    },
    clearDialog() {
      this.form = {};
    },
    deletebatch() {
      if(this.multipleSelection) {
        var arr = this.multipleSelection.map((item) => {
          return item.id;
        })
        this.deletebatchGrade({ ids: arr.join() }).then((res) => {
           if(res.data.stauts === 200) {
            this.getGrade();
            this.$notify.success({
              title: '成功',
              message: '批量删除年级成功'
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
    }
  },
  created() {
  	this.getGrade();
  }

}
</script>
<style>
  
</style>