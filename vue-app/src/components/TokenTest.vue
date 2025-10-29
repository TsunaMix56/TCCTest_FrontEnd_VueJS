<template>
  <div class="token-test">
    <h3>🔑 Token Management Test</h3>
    
    <div class="token-info">
      <h4>Token Status:</h4>
      <pre>{{ tokenInfo }}</pre>
    </div>

    <div class="actions">
      <button @click="testGetToken" :disabled="loading">Get Token</button>
      <button @click="clearToken" :disabled="loading">Clear Token</button>
      <button @click="refreshInfo" :disabled="loading">Refresh Info</button>
    </div>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import apiService from '../services/apiService.js'

export default {
  name: 'TokenTest',
  setup() {
    const tokenInfo = ref({})
    const message = ref('')
    const messageType = ref('info')
    const loading = ref(false)

    const refreshInfo = () => {
      tokenInfo.value = apiService.getTokenInfo()
    }

    const testGetToken = async () => {
      loading.value = true
      message.value = ''
      
      try {
        const token = await apiService.getToken()
        message.value = `Token received successfully! Length: ${token.length}`
        messageType.value = 'success'
        refreshInfo()
      } catch (error) {
        message.value = `Error: ${error.message}`
        messageType.value = 'error'
      } finally {
        loading.value = false
      }
    }

    const clearToken = () => {
      apiService.clearToken()
      message.value = 'Token cleared!'
      messageType.value = 'info'
      refreshInfo()
    }

    onMounted(() => {
      refreshInfo()
      // Auto refresh every 30 seconds
      setInterval(refreshInfo, 30000)
    })

    return {
      tokenInfo,
      message,
      messageType,
      loading,
      testGetToken,
      clearToken,
      refreshInfo
    }
  }
}
</script>

<style scoped>
.token-test {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
}

.token-info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.token-info pre {
  margin: 0;
  white-space: pre-wrap;
}

.actions {
  margin-bottom: 20px;
}

.actions button {
  margin-right: 10px;
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover:not(:disabled) {
  background: #45a049;
}

.actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.message {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style>