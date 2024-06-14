<template>
    <div>
      <h1>Add New Course</h1>
      <el-form :model="course" @submit.prevent="submitForm">
        
        <el-form-item label="Name">
          <el-input v-model="course.name"></el-input>
        </el-form-item>
        <el-form-item label="Introduction">
          <el-input v-model="course.introduction"></el-input>
        </el-form-item>
        <el-form-item label="Location">
          <el-input v-model="course.location"></el-input>
        </el-form-item>
        <el-form-item label="Home">
          <el-input v-model="course.home"></el-input>
        </el-form-item>
        <el-form-item label="Image URL">
          <el-input v-model="course.image"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';

  import { player_post } from '@/api/user';
  // 初始化课程对象
  const course = ref({
    
    name: '',
    introduction: '',
    location: '',
    home: '',
    image: null
  });
  
  // 提交表单函数
  const submitForm = async () => {
   
    // const courseData = JSON.stringify(course.value);
     console.log('Course added:', course.value);
       const response = await player_post(course.value);
    
      // 这里可以添加一些代码来处理成功的响应，比如清空表单，显示成功消息等
      course.value = {
         name: '',
        introduction: '',
        location: '',
        home: '',
        image: ''
      };
   
  };
  </script>
  
  <style scoped>
  /* 样式定义 */
  </style>
  