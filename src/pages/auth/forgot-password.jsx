import React from 'react'

function ForgotPassword() {
  return (
    <div className="text-right mt-2">
  <Link to="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
    Forgot Password?
  </Link>
</div>

  )
}

export default ForgotPassword
