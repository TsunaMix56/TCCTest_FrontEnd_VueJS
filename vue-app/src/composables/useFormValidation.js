import { ref, computed } from 'vue'

// Custom hook สำหรับ Form Validation
export function useFormValidation() {
  const errors = ref({})

  // Validate required fields
  const validateRequired = (fields) => {
    const newErrors = {}
    
    Object.keys(fields).forEach(fieldName => {
      const value = fields[fieldName]
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[fieldName] = `กรุณากรอก${fieldName}`
      }
    })
    
    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  // Validate password confirmation
  const validatePasswordConfirmation = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      errors.value = {
        ...errors.value,
        confirmPassword: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน'
      }
      return false
    }
    
    // ลบ error ของ confirmPassword ถ้ามี
    const { confirmPassword: _, ...otherErrors } = errors.value
    errors.value = otherErrors
    return true
  }

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      errors.value = {
        ...errors.value,
        email: 'รูปแบบอีเมลไม่ถูกต้อง'
      }
      return false
    }
    
    const { email: _, ...otherErrors } = errors.value
    errors.value = otherErrors
    return true
  }

  // Clear specific error
  const clearError = (fieldName) => {
    const { [fieldName]: _, ...otherErrors } = errors.value
    errors.value = otherErrors
  }

  // Clear all errors
  const clearAllErrors = () => {
    errors.value = {}
  }

  // Check if form is valid
  const isFormValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  // Get error message for specific field
  const getError = (fieldName) => {
    return errors.value[fieldName] || ''
  }

  return {
    errors,
    validateRequired,
    validatePasswordConfirmation,
    validateEmail,
    clearError,
    clearAllErrors,
    isFormValid,
    getError
  }
}