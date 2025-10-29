import { ref, reactive } from 'vue'
import apiService from '../services/apiService.js'

// Custom hook สำหรับ Authentication
export function useAuth() {
  const isLoading = ref(false)
  const error = ref('')
  const user = reactive({
    isLoggedIn: false,
    welcomeMessage: ''
  })

  // Login hook
  const login = async (username, password) => {
    isLoading.value = true
    error.value = ''

    try {
      const response = await apiService.login(username, password)      // ตรวจสอบว่า response มี message ที่มีคำว่า "Welcome User"
      if (response.message && response.message.includes('Welcome User')) {
        user.isLoggedIn = true
        user.welcomeMessage = response.message
        // เก็บข้อความไว้ใน localStorage
        localStorage.setItem('welcomeMessage', response.message)
        return { success: true, message: response.message }
      } else {
        error.value = response.message || 'การเข้าสู่ระบบไม่สำเร็จ'
        return { success: false, error: error.value }
      }
    } catch (err) {
      // แสดง error message จาก API response
      if (err.response && err.response.data && err.response.data.message) {
        error.value = err.response.data.message
      } else if (err.message) {
        error.value = err.message
      } else {
        error.value = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ - ตรวจสอบว่าเซิร์ฟเวอร์ API ทำงานอยู่หรือไม่'
      }
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Register hook
  const register = async (username, password) => {
    isLoading.value = true
    error.value = ''

    try {
      const response = await apiService.register(username, password)
      
      return { success: true, message: 'สมัครสมาชิกสำเร็จ!' }
    } catch (err) {
      // แสดง error message จาก API response
      if (err.response && err.response.data && err.response.data.message) {
        error.value = err.response.data.message
      } else if (err.message) {
        error.value = err.message
      } else {
        error.value = 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
      }
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout hook
  const logout = () => {
    user.isLoggedIn = false
    user.welcomeMessage = ''
    localStorage.removeItem('welcomeMessage')
  }

  // Check login status from localStorage
  const checkLoginStatus = () => {
    const message = localStorage.getItem('welcomeMessage')
    if (message) {
      user.isLoggedIn = true
      user.welcomeMessage = message
    }
  }

  return {
    // States
    isLoading,
    error,
    user,
    // Methods
    login,
    register,
    logout,
    checkLoginStatus
  }
}