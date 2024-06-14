<template>
    <div class="player-container">
      <!-- 搜索栏 -->
      <el-input v-model="searchQuery" placeholder="搜索球员名字" clearable @clear="clearSearch" @keyup.enter="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-input>
  
      <!-- 遍历并展示所有球员 -->
      <el-card class="player-card" v-for="player in filteredPlayers" :key="player.id">
        <!-- 传入图片 -->
        <img :src="player.image || 'default_image.png'" alt="Player Image" class="player-image" />
        <!-- 信息 -->
        <div class="player-info">
          <!-- 名字 -->
          <h2 class="player-name">{{ player.name }}</h2>
          <!-- 介绍 -->
          <p class="player-introduction">Introduction: {{ player.introduction }}</p>
          <!-- 号码 -->
          <p class="player-number">Number: {{ player.number }}</p>
          <!-- 价格 -->
          <p class="player-price">Price: {{ player.price }}</p>
          <!-- 生日 -->
          <p class="player-birthday">Birthday: {{ player.birthday }}</p>
          <!-- 所属俱乐部 -->
          <p class="player-club">Club: {{ player.club }}</p>
          <!-- 删除按钮 -->
          <el-button class="delete-button" type="danger" size="mini" @click="confirmDelete(player.id)">
            删除
          </el-button>
          <!-- 修改按钮 -->
          <el-button class="update-button" type="primary" size="mini" @click="editPlayer(player)">
            修改
          </el-button>
        </div>
      </el-card>
  
      <!-- 修改球员信息的对话框 -->
      <el-dialog v-model="dialogVisible" title="修改球员信息" width="50%" @close="handleCloseDialog">
        <el-form :model="editedPlayer" :rules="rules" ref="editForm" label-width="120px">
          <!-- 名字 -->
          <el-form-item label="名字" prop="name">
            <el-input v-model="editedPlayer.name" />
          </el-form-item>
          <!-- 介绍 -->
          <el-form-item label="介绍" prop="introduction">
            <el-input v-model="editedPlayer.introduction" />
          </el-form-item>
          <!-- 号码 -->
          <el-form-item label="号码" prop="number">
            <el-input v-model="editedPlayer.number" />
          </el-form-item>
          <!-- 价格 -->
          <el-form-item label="价格" prop="price">
            <el-input v-model="editedPlayer.price" />
          </el-form-item>
          <!-- 生日 -->
          <el-form-item label="生日" prop="birthday">
            <el-date-picker v-model="editedPlayer.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
          </el-form-item>
          <!-- 所属俱乐部 -->
          <el-form-item label="所属俱乐部" prop="club">
            <el-input v-model="editedPlayer.club" />
          </el-form-item>
          <!-- 上传图片 -->
          <el-form-item label="上传图片" prop="image">
            <input type="file" @change="handleFileChange" />
          </el-form-item>
        </el-form>
  
        <!-- 对话框底部按钮 -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveChanges">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { player_get, deletePlayer, updatePlayer } from '@/api/user'; // 确保这个方法名称和路径正确
  
  // 使用ref来存储球员数据
  const players = ref([]);
  const editedPlayer = ref(null);
  const dialogVisible = ref(false);
  const imageFile = ref(null);
  const searchQuery = ref('');
  const filteredPlayers = computed(() => {
    return players.value.filter(player =>
      player.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  // 表单验证规则
  const rules = {
    name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
    number: [{ required: true, message: '请输入号码', trigger: 'blur' }],
    price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
    birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
    club: [{ required: true, message: '请输入所属俱乐部', trigger: 'blur' }],
    image: [{ required: true, message: '请上传图片', trigger: 'change' }],
  };
  
  // 定义获取球员数据的方法
  const getPlayers = async () => {
    try {
      const response = await player_get();
      players.value = response.data.results; // 假设返回的数据包含一个results数组
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };
  
  // 打开修改球员对话框
  const editPlayer = (player) => {
    editedPlayer.value = { ...player };
    dialogVisible.value = true;
  };
  
  // 保存修改
  const saveChanges = async () => {
    try {
      const formData = new FormData();
      for (const key in editedPlayer.value) {
        formData.append(key, editedPlayer.value[key]);
      }
      if (imageFile.value) {
        formData.append('image', imageFile.value);
      }
      await updatePlayer(editedPlayer.value.id, formData);
      ElMessage.success('球员信息修改成功');
      dialogVisible.value = false;
      // 更新球员列表中的数据
      const index = players.value.findIndex(player => player.id === editedPlayer.value.id);
      if (index !== -1) {
        players.value[index] = { ...editedPlayer.value, image: URL.createObjectURL(imageFile.value) };
      }
    } catch (error) {
      ElMessage.error('球员信息修改失败');
      console.error('Failed to update player:', error);
    }
  };
  
  // 处理文件选择
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      imageFile.value = file;
    }
  };
  
  // 显示删除确认对话框
  const confirmDelete = (playerId) => {
    ElMessageBox.confirm('此操作将永久删除该球员, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      removePlayer(playerId);
    }).catch(() => {
      ElMessage.info('已取消删除');
    });
  };
  
  // 删除球员
  const removePlayer = async (playerId) => {
    try {
      await deletePlayer(playerId);
      ElMessage.success('删除成功');
      players.value = players.value.filter(player => player.id !== playerId);
    } catch (error) {
      ElMessage.error('删除失败');
      console.error('Failed to delete player:', error);
    }
  };
  
  // 关闭对话框前的处理
  const handleCloseDialog = () => {
    editedPlayer.value = null;
    imageFile.value = null;
  };
  
  // 处理搜索
  const handleSearch = () => {
    // 可以在这里加入搜索相关的逻辑，例如清空现有的搜索结果再进行搜索
  };
  
  // 清除搜索条件
  const clearSearch = () => {
    searchQuery.value = '';
  };
  
  // 组件挂载时获取球员数据
  onMounted(() => {
    getPlayers();
  });
  </script>
  
  <style scoped>
  .player-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 20px;
  }
  
  .player-card {
    width: 100%;
    max-width: 300px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
  }
  
  .player-image {
    width: 100%;
    height: auto;
  }
  
  .player-info {
    padding: 20px;
  }
  
  .player-name {
    font-size: 1.5em;
    margin-bottom: 10px;
  }
  
  .player-introduction,
  .player-number,
  .player-price,
  .player-birthday,
  .player-club {
    margin: 5px 0;
  }
  
  .delete-button,
  .update-button {
    position: absolute;
    top: 10px;
    z-index: 1;
  }
  
  .delete-button {
    right: 10px;
  }
  
  .update-button {
    left: 10px;
  }
  </style>
  