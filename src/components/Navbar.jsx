import React from 'react'
import { navIcons, navLinks } from '#constants' 
import dayjs from 'dayjs'
import useWindowStore from '#store/window'



const Navbar = () => {
    const { openWindow } = useWindowStore();
  return (
    <nav>
        <div>
            <img src="/images/logo.svg" alt="logo.svg" />
            <p className="font-bold">
                 MANic's 
            </p>
            <ul>
                {navLinks.map(({id, name, type})=>(
                    <li key={id} onClick={()=> openWindow(type)} >
                    <p>{name}</p>
                    </li>
                ))}
            </ul>
        </div>
        
        <div>
            <ul>
                {navIcons.map(({id, img, type})=>(
                    <li key={id}>
                        <img src={img} onClick={()=>openWindow(type)} alt={`icon-${id}`} />
                    </li>
                ))}
            </ul>
            <time >{dayjs().format("ddd MMM D h:mm A")}</time>
        </div>
    </nav>
  )
}

export default Navbar