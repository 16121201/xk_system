import axios from 'axios';

export const find_all_students = params => {return axios.get('/api/find_all_students', { params: params }); };
export const find_all_course = params => {return axios.get('/api/find_all_course', { params: params }); };
export const find_students_byxh = params => {return axios.get('/api/find_students_byxh', { params: params }); };
export const UpdateStudents = params => {return axios.get('/api/find_students_byxh', { params: params }); };
export const Login = params => {return axios.get('/api/login', { params: params }); };
export const find_students_bygh = params =>{return axios.get('/api/find_students_bygh', { params: params }); };
export const find_score_byxh = params =>{return axios.get('/api/find_score_byxh', { params: params }); };
export const find_course = params =>{return axios.get('/api/find_course', { params: params }); };
export const add_course = params =>{return axios.get('/api/add_course', { params: params }); };
export const delete_course = params =>{return axios.get('/api/delete_course', { params: params }); };
export const find_course_bygh = params =>{return axios.get('/api/find_course_bygh', { params: params }); };
export const find_students_bycourse = params =>{return axios.get('/api/find_students_bycourse', { params: params }); };
export const update_grade = params =>{return axios.get('/api/update_grade', { params: params }); };
