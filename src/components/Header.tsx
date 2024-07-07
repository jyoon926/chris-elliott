import { Link } from 'react-router-dom'

function Header() {
  return (
    <>
      <div className='header fixed top-0 left-0 w-full flex flex-row justify-between items-center px-5 h-14 z-50'>
        <Link to='/' className='text-2xl font-serif'>Chris Elliott</Link>
        <div className='flex flex-row gap-8'>
          <Link to='/gallery' className='link'>Gallery</Link>
          <Link to='/about' className='link'>About</Link>
          <Link to='/contact' className='link'>Contact</Link>
        </div>
      </div>
      <div className='blur fixed top-0 left-0 w-full h-20 z-40 pointer-events-none'></div>
    </>
  )
}

export default Header
