//引用来自特定路径下的.vue文件
import { createApp } from 'vue'
import App from './App.vue'
//引用ElementPlus组件库
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
//创建app
const app = createApp(App);
//使用组件库
app.use(ElementPlus);
//显示app
app.mount('#app');
