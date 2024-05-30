<template>
    <div class="counter">
      <h2>{{ count }}</h2>
      <button @click="decrement">-</button>
      <button @click="increment">+</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CounterComponent',
    data() {
      return {
        count: 0
      };
    },
    methods: {
      increment() {
        this.count++;
      },
      decrement() {
        this.count--;
      }
    }
  };
  </script>
  
  <style scoped>
  .counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  
  button {
    margin: 5px;
    padding: 10px 20px;
    font-size: 16px;
  }
  </style>
  