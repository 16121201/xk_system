var express = require('express');
var router = express.Router();
var method = require('./method');

router.get('/find_all_students',method.getALL);
router.get('/find_all_course',method.getALLcourse);
router.get('/find_students_byxh',method.getByxh);
router.get('/Update_Students',method.updateByxh);
router.get('/login',method.Login);
router.get('/find_students_bygh',method.getBygh);
router.get('/find_score_byxh',method.getScore);
router.get('/find_course',method.getCourse);
router.get('/add_course',method.addCourse);
router.get('/delete_course',method.deleteCourse);
router.get('/find_course_bygh',method.getCoursebygh);
router.get('/find_students_bycourse',method.getBycourse);
router.get('/update_grade',method.updateGrade);

module.exports = router;
