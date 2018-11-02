<!-- 班级管理页面 -->
<template>
  <div class="clazzManage">
    <div class="search-box clearfix">
      <el-select v-model="selectgradeId" placeholder="请选择年级">
      	<el-option label="--请选择--" :value="0"></el-option>
        <el-option v-for="(opt, key) in gradeList" :value="opt.id" :label="opt.name" :key="key"></el-option>
      </el-select>
      <el-input placeholder="请输入关键字搜索" v-model="searchCnt" clearable></el-input> 
      <div class="btn-box">
        <el-button type="primary" @click="dialogFormVisible = true">增加</el-button>
        <el-button type="danger" @click="deletebatch">批量删除</el-button>
      </div>
    </div>
    <el-table
    ref="multipleTable"
    :data="filterClass"
    tooltip-effect="dark"
    style="width: 100%"
    border
    v-if="classList"
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
        prop="description"
        label="班级介绍">
      </el-table-column>
      <el-table-column
        prop="charge.name"
        label="班主任">
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
    <el-dialog width="40%" :title="dialogmess" :visible.sync="dialogFormVisible" @closed="clearDialog" @open="addClass">
      <el-form :model="form">
      	 <el-form-item label="年级" :label-width="formLabelWidth">
          <el-select v-model="form.gradeId"  placeholder="请选择年级">
          	<el-option label="--请选择--" :value="0"></el-option>
            <el-option v-for="(opt, key) in gradeList" :value="opt.id" :label="opt.name" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班主任" :label-width="formLabelWidth">
          <el-select v-model="form.chargeId"  placeholder="请选择班主任">
          	<el-option label="--请选择--" :value="0"></el-option>
            <el-option v-for="(opt, key) in teacherList" :value="opt.id" :label="opt.name" :key="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级介绍" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="请输入内容"
            v-model="form.description">
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
  data(){
    return {
      dialogmess: '修改班级信息',
      dialogFormVisible: false,
      formLabelWidth: '100px',
      form: {},
      searchCnt: '',
      multipleSelection: [],
      selectgradeId: 0
    }
  },
  computed: {
  	...mapGetters(['classList', 'teacherList', 'gradeList']),
  	filterClass() {
  		return this.selectClassList.filter((item) => {
  			if(this.selectgradeId === 0) {
  				return true;
  			} else {
  				if(item.grade) {
	  				return item.grade.id === this.selectgradeId;
  				}
  			}
  		})
  	},
    selectClassList() {
      if(this.searchCnt) {
        return this.classList.filter(item => {
          if(item.name.match(this.searchCnt)) {
            return true;
          }
        })
      } else {
        return this.classList;
      }
    }
  },
  methods: {
    ...mapActions(['getClass', 'deleteClass', 'saveClass', 'deletebatchClass', 'getTeacher', 'getGrade']),
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
      this.form = {
        id: row.id,
        name: row.name,
        gradeId: row.grade ? row.grade.id : 0,
        chargeId: row.charge ? row.charge.id : 0,
        description: row.description
      }
    },
    confirmSave() {
      if(this.form.gradeId === 0) {
        this.form.gradeId = null
      }
      if(this.form.chargeId === 0) {
        this.form.chargeId = null
      }
      this.saveClass(this.form).then((res) => {
        if(res.data.stauts === 200) {
          this.getClass();
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
      this.deleteClass({ id: row.id }).then((res) => {
        if(res.data.stauts === 200) {
          this.getClass();
          this.$notify.success({
            title: '成功',
            message: '删除班级成功'
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
    	if(this.multipleSelection.length) {
    		var arr = this.multipleSelection.map((item) => {
    		  return item.id;
    		})
    		this.deletebatchClass({ ids: arr.join() }).then((res) => {
    		   if(res.data.stauts === 200) {
    		    this.getClass();
    		    this.$notify.success({
    		      title: '成功',
    		      message: '批量删除班级成功'
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
    search() {
      console.log(this.searchCnt);
    },
    addClass() {
      this.getTeacher();
      this.getGrade();
    }
  },
  created() {
  	this.getClass();
    this.getGrade();
  }
}
</script>
<style >
  
</style>