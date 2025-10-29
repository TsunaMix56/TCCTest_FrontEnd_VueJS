import axios from 'axios'

const API_BASE_URL = 'http://localhost:5214/api'

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
      this.token = response.data.token || response.data.access_token || response.data
      return this.token
    } catch (error) {
      console.error('Error getting token:', error)
      throw error
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
      console.error('Login error:', error)
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
      console.error('Registration error:', error)
      throw error
    }
  }
}

export default new ApiService()