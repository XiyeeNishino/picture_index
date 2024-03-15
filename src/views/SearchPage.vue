<template>
    <div id="app">
      <button @click="getWord">点击我</button>
      <p>{{ word }}</p>
    </div>
  </template>
   
  <script>
  import axios from 'axios';
   
  export default {
    data() {
      return {
        word: ''
      }
    },
    methods: {
      async getWord() {
        const response = await axios.get('http://localhost:5000/get_word');
        this.word = response.data.word;
      }
    }
  }
  </script>