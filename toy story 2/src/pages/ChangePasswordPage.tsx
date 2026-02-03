/**
 * Change Password Page
 * Change account password
 */

import React from 'react'
import ProfileLayout from '../layouts/ProfileLayout'
import ChangePassword from '../components/profile/ChangePassword'

const ChangePasswordPage: React.FC = () => {
  return (
    <ProfileLayout>
      <ChangePassword />
    </ProfileLayout>
  )
}

export default ChangePasswordPage
