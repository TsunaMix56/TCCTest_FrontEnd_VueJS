<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>เข้าสู่ระบบ</h2>
        <p>กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">ชื่อผู้ใช้</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="กรุณากรอกชื่อผู้ใช้"
            required
            maxlength="24"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="password">รหัสผ่าน</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="กรุณากรอกรหัสผ่าน"
            required
            maxlength="24"
            class="form-input"
          />
          <div v-if="error || getError('ชื่อผู้ใช้') || getError('รหัสผ่าน')" class="error-message">
            {{ error || getError('ชื่อผู้ใช้') || getError('รหัสผ่าน') }}
          </div>
        </div>
        
        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="isLoading">กำลังเข้าสู่ระบบ...</span>
          <span v-else>ลงชื่อเข้าใช้งาน</span>
        </button>
        
        <div class="form-footer">
          <p>ยังไม่มีบัญชี? 
            <button type="button" @click="goToRegister" class="register-link">
              สมัครสมาชิก
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { useFormValidation } from '../composables/useFormValidation.js'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    
    // ใช้ Auth hook
    const { login, isLoading, error } = useAuth()
    
    // ใช้ Form Validation hook
    const { validateRequired, getError, clearAllErrors } = useFormValidation()

    const handleLogin = async () => {
      clearAllErrors()
      
      // Validate form
      const isValid = validateRequired({
        'ชื่อผู้ใช้': username.value,
        'รหัสผ่าน': password.value
      })
      
      if (!isValid) {
        return
      }
      
      // เรียกใช้ login hook
      const result = await login(username.value, password.value)
      
      if (result.success) {
        console.log('Login successful with hook, redirecting to welcome page')
        router.push('/welcome')
      }
    }

    const goToRegister = () => {
      router.push('/register')
    }

    return {
      username,
      password,
      error,
      isLoading,
      handleLogin,
      goToRegister,
      getError
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(76, 175, 80, 0.15);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #e8f5e8;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #2e7d32;
  font-size: 28px;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.login-header p {
  color: #66bb6a;
  font-size: 14px;
  margin: 0;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #2e7d32;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8f5e8;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f9fff9;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #66bb6a;
  box-shadow: 0 0 0 3px rgba(102, 187, 106, 0.1);
}

.error-message {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 8px;
  background-color: #ffebee;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #d32f2f;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5fa85f 0%, #45a045 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.form-footer {
  text-align: center;
}

.form-footer p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.register-link {
  background: none;
  border: none;
  color: #4caf50;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
  font-size: 14px;
}

.register-link:hover {
  color: #2e7d32;
}
</style>