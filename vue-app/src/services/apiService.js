import axios from 'axios'

const API_BASE_URL = 'http://localhost:5214/api'

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.timeout = 30000
axios.defaults.withCredentials = false

class ApiService {
  constructor() {
    this.token = null
    this.tokenExpires = null
  }

  // Check if current token is still valid (not expired within 5 minutes)
  isTokenValid() {
    if (!this.token || !this.tokenExpires) {
      console.log('❌ Token validation failed: missing token or expires date')
      return false
    }
    
    try {
      const now = new Date()
      const expiryTime = new Date(this.tokenExpires)
      
      // ตรวจสอบว่าวันที่ valid หรือไม่
      if (isNaN(expiryTime.getTime())) {
        console.log('❌ Invalid expires date format:', this.tokenExpires)
        return false
      }
      
      const fiveMinutesBeforeExpiry = new Date(expiryTime.getTime() - 5 * 60 * 1000) // 5 minutes before expiry
      const minutesUntilExpiry = Math.round((expiryTime.getTime() - now.getTime()) / (1000 * 60))
      
      console.log('⏰ Token validation check:')
      console.log('   Current time:', now.toLocaleString())
      console.log('   Expires at:', expiryTime.toLocaleString())
      console.log('   Minutes until expiry:', minutesUntilExpiry)
      console.log('   Will refresh in:', Math.round((fiveMinutesBeforeExpiry.getTime() - now.getTime()) / (1000 * 60)), 'minutes')
      
      const isValid = now < fiveMinutesBeforeExpiry
      console.log('✅ Token is', isValid ? 'VALID' : 'EXPIRED/WILL_REFRESH')
      
      return isValid
    } catch (error) {
      console.error('❌ Error validating token:', error)
      return false
    }
  }

  // Get authentication token
  async getToken() {
    // ถ้า token ยังใช้ได้ ให้ return token เดิม
    if (this.isTokenValid()) {
      console.log('Token still valid, reusing existing token')
      return this.token
    }

    try {
      console.log('Getting new token from server...')
      const response = await axios.post(`${API_BASE_URL}/auth/token`, {
        username: 'TCCTest',
        password: 'Test!456'
      })
      
      // เก็บ token และวันที่หมดอายุ
      this.token = response.data.token || response.data.access_token || response.data.accessToken || response.data
      this.tokenExpires = response.data.expires
      
      console.log('📋 Complete token response:', response.data)
      console.log('🔑 Token extracted:', this.token ? `${this.token.substring(0, 20)}...` : 'null')
      console.log('⏰ Token expires at:', this.tokenExpires)
      
      if (this.tokenExpires) {
        const expiryDate = new Date(this.tokenExpires)
        const now = new Date()
        const minutesUntilExpiry = Math.round((expiryDate.getTime() - now.getTime()) / (1000 * 60))
        console.log(`⏳ Token valid for ${minutesUntilExpiry} minutes`)
      }
      return this.token
    } catch (error) {
      // Clear token on error
      this.token = null
      this.tokenExpires = null
      
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

  // Clear stored token (useful for logout or when token becomes invalid)
  clearToken() {
    this.token = null
    this.tokenExpires = null
    console.log('Token cleared')
  }

  // Get token info for debugging
  getTokenInfo() {
    const now = new Date()
    const expiryTime = this.tokenExpires ? new Date(this.tokenExpires) : null
    
    return {
      hasToken: !!this.token,
      tokenPreview: this.token ? `${this.token.substring(0, 30)}...` : null,
      expires: this.tokenExpires,
      expiresFormatted: expiryTime ? expiryTime.toLocaleString() : null,
      currentTime: now.toLocaleString(),
      isValid: this.isTokenValid(),
      minutesUntilExpiry: expiryTime ? 
        Math.round((expiryTime.getTime() - now.getTime()) / (1000 * 60)) : null,
      willRefreshIn: expiryTime ? 
        Math.round(((expiryTime.getTime() - 5 * 60 * 1000) - now.getTime()) / (1000 * 60)) : null
    }
  }

  // User login
  async login(username, password) {
    try {
      // ตรวจสอบและรับ token ที่ยังใช้ได้ หรือขอใหม่ถ้าหมดอายุ
      await this.getToken()
      
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
      // ตรวจสอบและรับ token ที่ยังใช้ได้ หรือขอใหม่ถ้าหมดอายุ
      await this.getToken()
      
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