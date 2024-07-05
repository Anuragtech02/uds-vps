import Image from 'next/image';
import logo from '@/assets/img/logo.png';
import Button from './Button';

const Navbar = () => {
   return (
      <div className='container'>
         <nav className='flex items-center justify-between rounded-xl bg-[#1D2C60] px-8 py-3'>
            <div>
               <Image src={logo} alt='logo' width={120} height={80} />
            </div>
            <ul className='flex items-center gap-4 text-white'>
               <li>About Us</li>
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
