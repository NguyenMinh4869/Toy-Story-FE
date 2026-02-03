/**
 * Profile Page
 * Main profile page with personal information
 */

import React from 'react'
import ProfileLayout from '../layouts/ProfileLayout'
import ProfileInfo from '../components/profile/ProfileInfo'

const ProfilePage: React.FC = () => {
  return (
    <ProfileLayout>
      <ProfileInfo />
    </ProfileLayout>
  )
}

export default ProfilePage
