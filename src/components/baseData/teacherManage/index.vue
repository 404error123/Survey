<!-- 教师管理页面 -->
<template>
  <div class="teacherManage">
      <div class="search-box clearfix">
        <el-select v-model="selectgradeId" placeholder="请选择年级">
        	<el-option label="--请选择--" :value="0"></el-option>
          <el-option v-for="(opt, key) in getTeacher" :value="opt.id" :label="opt.name" :key="key"></el-option>
        </el-select>
        <el-input placeholder="请输入关键字搜索" v-model="searchCnt" clearable> </el-input> 
        <div class="btn-box">
          <el-button type="primary" @click="dialogFormVisible = true">增加</el-button>
          <el-button type="danger" @click="deletebatch">批量删除</el-button>
        </div>
      </div>
      <el-table
      ref="multipleTable"
      :data="filterTeacher"
      tooltip-effect="dark"
      style="width: 100%"
      border
      v-if="teacherList"
      @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="教师姓名">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="birth"
          label="出生日期">
        </el-table-column>
        <el-table-column
          prop="hiredate"
          label="入职时间">
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
          <el-form-item label="教师姓名" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="教师性别" :label-width="formLabelWidth">
            <el-radio v-model="form.gender" label="男">男</el-radio>
            <el-radio v-model="form.gender" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="出生日期" :label-width="formLabelWidth">
            <el-date-picker
              v-model="form.birth"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="入职时间" :label-width="formLabelWidth">
            <el-date-picker
              v-model="form.hiredate"
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
    </div>
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
  	...mapGetters(['teacherList']),
  	filterTeacher() {
  		return this.selectTeacherList.filter((item) => {
  			if(this.selectgradeId === 0) {
  				return true;
  			} else {
  				if(item.grade) {
	  				return item.grade.id === this.selectgradeId;
  				}
  			}
  		})
  	},
    selectTeacherList() {
      if(this.searchCnt) {
        return this.teacherList.filter(item => {
          if(item.name.match(this.searchCnt)) {
            return true;
          }
        })
      } else {
        return this.teacherList;
      }
    }
  },
  methods: {
    ...mapActions(['getTeacher', 'deleteTeacher', 'saveTeacher', 'deletebatchTeacher']),
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
        gender: row.gender,
        birth: row.birth,
        hiredate: row.hiredate
      }
    },
    confirmSave() {
      this.saveTeacher(this.form).then((res) => {
        if(res.data.stauts === 200) {
          this.getTeacher();
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
      this.deleteTeacher({ id: row.id }).then((res) => {
        if(res.data.stauts === 200) {
          this.getTeacher();
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
    		this.deletebatchTeacher({ ids: arr.join() }).then((res) => {
    		   if(res.data.stauts === 200) {
    		    this.getTeacher();
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
    }
  },
  created() {
  	this.getTeacher();
  }
}
</script>
<style scoped>
  
</style>