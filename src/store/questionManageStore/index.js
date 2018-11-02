// 问卷管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		questionList: [],
		questionnaire: []
	},
	getters:{
		questionList: state => state.questionList,
		questionnaire: state => state.questionnaire
	},
	mutations:{
		changeQuestion(state, data) {
			state.questionList = data
		},
		changeNaire(state, data) {
			state.questionnaire = data
		}
	},
	actions:{
		// 题库
		getQuestion(context) {
			axios.get('/question/findAllQuestionVM').then(res => {
				context.commit('changeQuestion', res.data.data)
			})
		},
		saveQuestion(context, data) {
			return axios.post('/question/saveOrUpdateQuestion', qs.stringify(data, { allowDots: true }))
		},
		deleteQusetion(context, id) {
			return axios.get('/question/deleteQuestionById', { params: id })
		},
		deletebatchQuestion(context, ids) {
			return axios.post('/question/batchDeleteQuestion', qs.stringify(ids))
		},
		// 问卷
		getNaire(context) {
			axios.get('/questionnaire/findAllQuestionnaire').then(res => {
				context.commit('changeNaire', res.data.data)
			})
		},
		saveNaire(context, data) {
			return axios.post('/questionnaire/saveOrUpdateQuestionnaire', qs.stringify(data))
		},
		deleteNaire(context, id) {
			return axios.get('/questionnaire/deleteQuestionnaireById', { params: id })
		},
		deletebatchNaire(context, ids) {
			return axios.post('/questionnaire/batchDeleteQuestion', qs.stringify(ids))
		},
		findQuestionById(context, id) {
			return axios.get('/questionnaire/findQuestionnaireVMById', { params: id })
		}
	}
}