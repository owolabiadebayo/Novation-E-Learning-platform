

import formidable from "express-formidable"
const router= require('express').Router();
import {imageUpload, createCourse, removeImage, getCourse, videoUpload, videoDelete, addLesson, updateCourse, updateCourseLessons, deleteLesson, updateLesson, publishCourse, unpublishCourse, getpublishedCourses, checkEnrollment, freeEnrollment, userCourses} from '../controller/course'
import { jwtSigned , isEnrolled} from '../middlewares/index'
router.get('/courses', getpublishedCourses);
// course image S3 upload and delete functions
router.post('/image-upload', jwtSigned, imageUpload);
router.post('/image-delete',jwtSigned, removeImage);
// create course function 
router.post('/create-course', jwtSigned ,createCourse); 
// update course function
router.put('/update-course/:slug', jwtSigned,  updateCourse);
// update course lesson function
router.put('/update-course-lessons/:slug', jwtSigned, updateCourseLessons);
// get course details 
router.get('/course/:slug', getCourse);
//get course details only if enrolled as it is for viewing course
router.get('/user/course/:slug',jwtSigned, getCourse );
// video upload for lessons 
router.post('/course/video-upload', jwtSigned, formidable(), videoUpload);
//video delete 
router.post('/course/remove-video', jwtSigned,  videoDelete);
// add lessons to course
router.post('/course/lesson/:slug', jwtSigned,  addLesson);
//delete lesson
router.delete('/delete-lesson/:id', jwtSigned, deleteLesson);
// update lesson
router.put('/update-lesson/:id', jwtSigned, updateLesson);
//publish and unpublish course
router.put('/course/publish/:slug', jwtSigned,  publishCourse)
router.put('/course/unpublish/:slug', jwtSigned, unpublishCourse)
// check if already enrolled in course
router.get('/check-enrollment/:slug', jwtSigned, checkEnrollment )
// free-enrollment
router.put('/free-enrollment/:id', jwtSigned, freeEnrollment);
// get user courses 
router.get('/user-courses', jwtSigned, userCourses);
module.exports= router;

