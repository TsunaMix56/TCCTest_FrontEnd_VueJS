import axios from 'axios'

const API_BASE_URL = 'http://localhost:5214/api'

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.timeout = 30000
axios.defaults.withCredentials = false

class ApiService {
  constructor() {
    this.token = null
  }

  // Get authentication token
  async getToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/token`, {
        username: 'TCCTest',
        password: 'Test!456'
      })
      
      this.token = response.data.token || response.data.access_token || response.data.accessToken || response.data
      return this.token
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ API ทำงานอยู่')
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('เกิดข้อผิดพลาดด้านเครือข่าย อาจเป็นปัญหา CORS')
      } else if (error.response) {
        throw new Error(`Server Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`)
      } else {
        throw new Error(`Network Error: ${error.message}`)
      }
    }
  }

  // User login
  async login(username, password) {
    try {
      if (!this.token) {
        await this.getToken()
      }
      
      const response = await axios.post(`${API_BASE_URL}/auth/user-login`, {
        username,
        password
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  // User registration
  async register(username, password) {
    try {
      if (!this.token) {
        await this.getToken()
      }
      
      const response = await axios.post(`${API_BASE_URL}/account/create`, {
        username,
        password
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      })
      
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new ApiService()