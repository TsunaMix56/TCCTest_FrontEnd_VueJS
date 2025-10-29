<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>สมัครสมาชิก</h2>
        <p>สร้างบัญชีใหม่เพื่อเข้าใช้งานระบบ</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
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
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">ยืนยันรหัสผ่าน</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="กรุณายืนยันรหัสผ่าน"
            required
            maxlength="24"
            class="form-input"
          />
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
        </div>
        
        <button type="submit" class="register-btn" :disabled="isLoading">
          <span v-if="isLoading">กำลังสมัครสมาชิก...</span>
          <span v-else>สมัครสมาชิก</span>
        </button>
        
        <div class="form-footer">
          <p>มีบัญชีอยู่แล้ว? 
            <button type="button" @click="goToLogin" class="login-link">
              เข้าสู่ระบบ
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

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    
    // ใช้ Auth hook
    const { register, isLoading } = useAuth()

    const handleRegister = async () => {
      errorMessage.value = ''
      successMessage.value = ''

      // ตรวจสอบข้อมูล
      if (!username.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        return
      }

      // ตรวจสอบรหัสผ่านตรงกัน
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน'
        return
      }

      // เรียกใช้ register hook
      const result = await register(username.value, password.value)
      
      if (result.success) {
        successMessage.value = 'สมัครสมาชิกสำเร็จ! กำลังนำคุณไปหน้าเข้าสู่ระบบ...'
        
        // รอ 2 วินาที แล้วไปหน้า login
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        errorMessage.value = result.error
      }
    }

    const goToLogin = () => {
      router.push('/')
    }

    return {
      username,
      password,
      confirmPassword,
      errorMessage,
      successMessage,
      isLoading,
      handleRegister,
      goToLogin
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(76, 175, 80, 0.15);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #e8f5e8;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #2e7d32;
  font-size: 28px;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.register-header p {
  color: #66bb6a;
  font-size: 14px;
  margin: 0;
}

.register-form {
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

.success-message {
  color: #2e7d32;
  font-size: 12px;
  margin-top: 8px;
  background-color: #e8f5e8;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #4caf50;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5fa85f 0%, #45a045 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
}

.register-btn:disabled {
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

.login-link {
  background: none;
  border: none;
  color: #4caf50;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
  font-size: 14px;
}

.login-link:hover {
  color: #2e7d32;
}
</style>