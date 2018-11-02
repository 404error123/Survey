<!-- 课调统计页面 -->
<template>
  <div class="surveyStatis">
    <el-tabs v-model="surveyStatisActive" type="card" @tab-click="handleClick">
	    <el-tab-pane label="全部课调" name="allSurvey"></el-tab-pane>
	    <el-tab-pane label="班级课调统计" name="clazzSurvey"></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data(){
    return {
    	surveyStatisActive:''
    }
  },
  created(){
    this.surveyStatisActive = this.$route.path.split('/')[2];
  },
  methods:{
  	handleClick(tab,event){
  		this.$router.push('/surveyStatis/'+tab.name);
  	}
  }
}
</script>
<style scoped>

</style>
