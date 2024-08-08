import Image from 'next/image';
import logo from '@/assets/img/logo.png';
import Button from './Button';
import Link from 'next/link';

const Navbar = () => {
   return (
      <div className='container'>
         <nav className='flex items-center justify-between rounded-xl bg-blue-2 px-6 py-3 md:px-8'>
            <Link href='/'>
               <img
                  src={logo.src}
                  alt='logo'
                  className='h-10 w-24 object-contain md:h-16 md:w-32'
               />
            </Link>
            <ul className='hidden items-center gap-4 text-white md:flex'>
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
