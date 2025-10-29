<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <div class="welcome-icon">
        <div class="checkmark">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#4caf50" stroke-width="2" fill="none"/>
            <path d="m9 12 2 2 4-4" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div class="welcome-header">
        <h2>เข้าสู่ระบบสำเร็จ!</h2>
      </div>
      
      <div class="welcome-message">
        <p>{{ welcomeMessage }}</p>
      </div>
      
      <div class="welcome-actions">
        <button @click="goToLogin" class="back-btn">
          กลับไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

export default {
  name: 'Welcome',
  setup() {
    const router = useRouter()
    const welcomeMessage = ref('')
    
    // ใช้ Auth hook
    const { logout, checkLoginStatus, user } = useAuth()

    onMounted(() => {
      // ตรวจสอบสถานะการ login
      checkLoginStatus()
      
      if (user.isLoggedIn && user.welcomeMessage) {
        welcomeMessage.value = user.welcomeMessage
      } else {
        // ถ้าไม่มี message ให้กลับไปหน้า login
        router.push('/')
      }
    })

    const goToLogin = () => {
      // ใช้ logout hook เพื่อล้างข้อมูล
      logout()
      router.push('/')
    }

    return {
      welcomeMessage,
      goToLogin
    }
  }
}
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(76, 175, 80, 0.15);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  border: 1px solid #e8f5e8;
}

.welcome-icon {
  margin-bottom: 30px;
}

.checkmark {
  display: inline-block;
  animation: checkmark-animation 1s ease-in-out;
}

@keyframes checkmark-animation {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.welcome-header {
  margin-bottom: 20px;
}

.welcome-header h2 {
  color: #2e7d32;
  font-size: 32px;
  margin: 0;
  font-weight: 600;
}

.welcome-message {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f1f8e9;
  border-radius: 12px;
  border-left: 4px solid #4caf50;
}

.welcome-message p {
  color: #2e7d32;
  font-size: 18px;
  margin: 0;
  font-weight: 500;
  line-height: 1.5;
}

.welcome-actions {
  margin-top: 20px;
}

.back-btn {
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
  color: white;
  border: none;
  padding: 14px 30px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: linear-gradient(135deg, #5fa85f 0%, #45a045 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
}
</style>