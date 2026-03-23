import { NavLink } from 'react-router-dom'
import { pages } from '../App';
import './navbar.scss';

export default function Navbar() {

  return (
    <nav className="nav-bar">
        <div className='title'>
            Tix
        </div>
        <div className='nav-links'>
        {Object.values(pages)
        .map((page, index) => (
            <NavLink to={page.path} key={index} className="nav-link">
                {page.label}
            </NavLink>
        ))}
        </div>
    </nav>
  );
}