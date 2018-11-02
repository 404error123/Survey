<!-- 学校信息页面 -->
<template>
  <div class="schoolInfo">
    <table>
    	<tr>
    		<td>校园名称</td>
    		<td>
          <input type="text" v-model="schoolInfo.name">
        </td>
    	</tr>
    	<tr>
    		<td>校园介绍</td>
    		<td><input type="text" v-model="schoolInfo.description"></td>
    	</tr>
    	<tr>
    		<td>校园地址</td>
    		<td><input type="text" v-model="schoolInfo.address"></td>
    	</tr>
    	<tr>
    		<td>校园电话</td>
    		<td><input type="text" v-model="schoolInfo.telephone"></td>
    	</tr>
    	<tr>
    		<td>版权信息</td>
    		<td><input type="text" v-model="schoolInfo.copyright"></td>
    	</tr>
    </table>
    <el-button type="primary" class="save-btn" @click="save">保存</el-button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data(){
    return {
     
    }
  },
  computed: {
    ...mapGetters(['schoolInfo'])
  },
  created() {
  	this.getSchool(1)
  },
  methods: {
    ...mapActions(['getSchool', 'saveSchool']),
    save() {
      this.saveSchool(this.schoolInfo).then(res => {
        if(res.data.stauts === 200) {
          this.getSchool(1);
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
    }
  }
}
</script>
<style>
  .schoolInfo table {
  	margin: 20px auto;
  	width: 80%;
  	line-height: 40px;
  	border-collapse: collapse;
  }
  .schoolInfo table td {
  	text-indent: 1em;
  	border: 1px solid #bbb;
  }
  .schoolInfo table tr td:first-child {
  	width: 30%;
  }
  .schoolInfo table tr td:nth-child(2) {
  	width: 70%;
  }
  .schoolInfo table tr td input {
    width: 80%;
    height: 40px;
    border: 0;
    text-indent: 1em;
  }
  .schoolInfo .save-btn {
    float: right;
    margin-right: 200px;
    margin-top: 20px;
  }
</style>