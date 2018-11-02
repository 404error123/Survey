<!-- 班级课调统计页面 -->
<template>
  <div class="clazzSurvey">
    <div class="search-box clearfix">
      <el-select v-model="selectGradeId" placeholder="请选择年级" @change="gradeChange">
        <el-option label="--请选择年级--" :value="0"></el-option>
        <el-option v-for="(grade, key) in gradeList" :value="grade.id" :label="grade.name" :key="key"></el-option>
      </el-select>
      <el-select v-model="selectClassId" placeholder="请选择班级" @change="classChange">
        <el-option label="--请选择班级--" :value="0"></el-option>
        <el-option v-for="(clazz, key) in finallClass" :value="clazz.id" :label="clazz.name" :key="key"></el-option>
      </el-select>
      <el-input placeholder="请输入关键字搜索" v-model="searchCnt" clearable> </el-input> 
    </div>
    
    <div class="list-box" v-for="list in selectSurvey">
      <div class="img-box">
        <img src="/static/flash.png" alt="">
      </div>
      <div class="des">
        <h3>{{list.clazzVM && list.clazzVM.name}}</h3>
        <p>平均分：{{list.average}}</p>
        <p>最近分：</p>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data(){
    return {
     	selectGradeId: 0,
     	selectClassId: 0,
     	searchCnt: '',
      classList: [],
      gradeList: [],
      filterSurvey: [],
      classAfterGrade: []
    }
  },
  computed: {
  	...mapGetters(['surveyList']),
    finallClass() {
      return this.classAfterGrade || this.classList;
    },
    selectSurvey() {
      if(this.searchCnt) {
        return this.filterSurvey.filter(item => {
          if(item.clazzVM.name.match(this.searchCnt)) {
            return true;
          }
        })
      } else {
        return this.filterSurvey;
      }
    },
  },
  watch: {
    surveyList: {
      handler(newValue) {
        newValue.forEach(item => {
          var key = this.classList.every(value => {
            return value.id !== item.clazzVM.id;
          });
          var key2 = this.gradeList.every(value => {
            return value.id !== item.clazzVM.grade.id;
          });
          if(key) {
            this.classList.push(item.clazzVM);
          }
          if(key2) {
            this.gradeList.push(item.clazzVM.grade);
          }
        });
        this.classChange();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapActions(['findAllSurvey']),
    classChange() {
      this.filterSurvey = this.surveyList.filter(item => {
        if (this.selectClassId !==0) {
          if(item.clazzVM.id === this.selectClassId) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      })
    },
    gradeChange() {
      this.filterSurvey = this.surveyList.filter(item => {
        if (this.selectGradeId !==0) {
          if(item.clazzVM.grade.id === this.selectGradeId) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      this.classAfterGrade = this.classList.filter(item => {
        return item.grade.id === this.selectGradeId;
      });
      this.selectClassId = 0;
    }
  },
  created() {
    this.findAllSurvey();
  }
}
</script>
<style scoped>
  .clazzSurvey .list-box {
    float: left;
    margin-right: 40px;
    width: 260px;
    height: 150px;
    background: #4C8C7C;
    border-radius: 5%;
    color: #fff;
  }
  .clazzSurvey .list-box > div {
    float: left;
  }
  .clazzSurvey .list-box .img-box {
    padding-top: 30px;
    width: 50%;
    text-align: center;
  }
  .clazzSurvey .list-box .des h3 {
    height: 40px;
    line-height: 40px;
  }
  .clazzSurvey .list-box .des p {
    margin: 5px 0;
  }
</style>