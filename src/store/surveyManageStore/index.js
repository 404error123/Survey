// 课调管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		surveyList: []
	},
	getters:{
		surveyList: state => state.surveyList,
	},
	mutations:{
		changeSurvey(state, data) {
			state.surveyList = data;
		}
	},
	actions:{
		findAllSurvey(context) {
			axios.get('/survey/findAllSurveyVM').then(res => {
				if(res.data.stauts === 200) {
					context.commit('changeSurvey', res.data.data)
				}
			})
		},
		findSurveyById(context, id) {
			return axios.get('/survey/findSurveyVMById', { params: id });
		},
		deleteSurveyById(context, id) {
			return axios.get('/survey/deleteSurveyById', { params: id })
		},
		batchDelete(context, ids) {
			return axios.post('/survey/batchDeleteSurveyById', qs.stringify(ids));
		},
		saveSurvey(context, data) {
			return axios.post('/survey/saveOrUpdateSurvey', qs.stringify(data));
		},
		openSurvey(context, id) {
			return axios.get('/survey/beginSurvey', { params: id });
		},
		closeSurvey(context, id) {
			return axios.get('/survey/stopSurvey', { params: id });
		},
		checkSurvey(context, data) {
			return axios.get('/survey/checkSurvey', { params: data });
		}

	}
}