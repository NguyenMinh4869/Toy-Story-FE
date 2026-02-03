/**
 * Address Book Page
 * Manage delivery addresses
 */

import React from 'react'
import ProfileLayout from '../layouts/ProfileLayout'
import AddressBook from '../components/profile/AddressBook'

const AddressBookPage: React.FC = () => {
  return (
    <ProfileLayout>
      <AddressBook />
    </ProfileLayout>
  )
}

export default AddressBookPage
