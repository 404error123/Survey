// 基础数据仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		gradeList: [],
		classList: [],
		allUser: [],
		courseList: [],
		teacherList: [],
		schoolInfo: {}
	},
	getters:{
		gradeList: state => state.gradeList,
		classList: state => state.classList,
		courseList: state => state.courseList,
		teacherList: state => state.teacherList,
		schoolInfo: state => state.schoolInfo
	},
	mutations:{
		changeGrade(state, data) {
			state.gradeList = data;
		},
		changeClass(state, data) {
			state.classList = data;
		},
		changeCourse(state, data) {
			state.courseList = data;
		},
		changeTeacher(state, data) {
			state.teacherList = data;
		},
		changeSchool(state, data) {
			state.schoolInfo = data;
		}
	},
	actions:{
		//年级
		getGrade(context) {
			axios.get('/grade/findAll').then((res) => {
				context.commit('changeGrade', res.data.data);
			})
		},
		deleteGrade(context,id) {
			return axios.get('/grade/deleteById', { params: id })
		},
		saveGrade(contex, data) {
			return axios.post('/grade/saveOrUpdate', qs.stringify(data))
		},
		deletebatchGrade(contex, data) {
			return axios.get('/grade/batchDelete', { params: data })
		},

		//班级
		getClass(context) {
			axios.get('/clazz/findAllVM').then((res) => {
				context.commit('changeClass', res.data.data);
			})
		},
		deleteClass(context,id) {
			return axios.get('/clazz/deleteClazzById', { params: id })
		},
		saveClass(contex, data) {
			return axios.post('/clazz/saveOrUpdateClazz', qs.stringify(data))
		},
		deletebatchClass(contex, data) {
			return axios.post('/clazz/batchDeleteClazz', qs.stringify(data))
		},
		//课程
		getCourse(context) {
			axios.get('/course/findAllCourse').then((res) => {
				context.commit('changeCourse', res.data.data);
			})
		},
		deleteCourse(context,id) {
			return axios.get('/course/deleteById', { params: id })
		},
		saveCourse(context, data) {
			return axios.post('/course/saveOrUpdate', qs.stringify(data))
		},
		deletebatchCourse(context, data) {
			return axios.post('/course/batchDelete', qs.stringify(data))
		},
		//教师
		getTeacher(context) {
			axios.get('/user/findAll').then((res) => {
				context.commit('changeTeacher', res.data.data);
			})
		},
		deleteTeacher(context,id) {
			return axios.get('/user/deleteById', { params: id })
		},
		saveTeacher(context, data) {
			return axios.post('/user/saveOrUpdate', qs.stringify(data))
		},
		deletebatchTeacher(context, data) {
			return axios.post('/user/batchDelete', qs.stringify(data))
		},

		//学校
		getSchool(context, id) {
			axios.get('/school/findById', { params: { id: id } }).then(res => {
		  		context.commit('changeSchool', res.data.data);
		  	})
		},
		saveSchool(context, data) {
			return axios.post('/school/saveOrUpdate', qs.stringify(data))
		}
	}
}