import Image from 'next/image';
import logo from '@/assets/img/logo.png';
import Button from './Button';
import Link from 'next/link';

const Navbar = () => {
   return (
      <div className='container'>
         <nav className='flex items-center justify-between rounded-xl bg-blue-2 px-8 py-3'>
            <Link href='/'>
               <Image src={logo} alt='logo' width={120} height={80} />
            </Link>
            <ul className='flex items-center gap-4 text-white'>
               <Link href='/about'>
                  <li>About Us</li>
               </Link>
               <li>Industry</li>
               <li>Custom research</li>
               <li>Company profiles</li>
               <li>Reading</li>
            </ul>
            <div>
               <Button>Become our client</Button>
            </div>
         </nav>
      </div>
   );
};

export default Navbar;
