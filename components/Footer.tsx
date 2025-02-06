import { loggoutAccount } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'react-toastify';

const Footer = ({ user, type = 'desktop' }: FooterProps) => {
  const router = useRouter();

  const handleLogOut = async () => {
    const loggedOut = await loggoutAccount();

    if (loggedOut) router.push('/sign-in');
  }

  return (
    <footer className="footer">
      <div className={type === 'mobile' ? 'footer_email_mobile' : 'footer_email'}>
        <div className='flex justify-between'>
          <h1 className="text-14 truncate font-semibold text-gray-700">
            {user?.name}
          </h1>
          <div className="footer_image active:shadow-xl" onClick={handleLogOut}>
            <Image src="icons/logout.svg" fill alt="loggout icon" />
          </div>
        </div>

        <p className="text-14 truncate font-normal text-gray-600">
          {user?.email}
        </p>
      </div>
    </footer>
  )
}

export default Footer