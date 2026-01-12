import { WindowControls } from '#components'
import { locations } from '#constants'
import WindowWrapper from '#hoc/windowWrapper'
import useLocationStore from '#store/location'
import useWindowStore from '#store/window'
import clsx from 'clsx'
import { Search } from 'lucide-react'
import React from 'react'


const Finder = () => {
    const { openWindow } = useWindowStore();
    const { activeLocation, setActiveLocation } = useLocationStore();

    const openItem = (item) => { 
        if(item.fileType === 'pdf') return openWindow("resume");
        if(item.fileType === 'txt') return openWindow("txtfile", item);
        if(item.fileType === 'img') return openWindow("imgfile", item);
        if(item.fileType === 'fig') return openWindow("figfile", item);
        if(item.kind === 'folder') return setActiveLocation(item);
        if(item.kind === 'file') return openWindow("editor");
        if(['url'].includes(item.fileType) && item.href) return window.open(item.href, "_blank");

        openWindow(`${item.fileType}${item.kind}`, item);
    }

const renderList = (name, items) =>
(<div>
    <h3>{name}</h3>
    <ul>
        {items.map((item) => (
            <li key={item.id} onClick={() => setActiveLocation(item)}
                className={clsx(item.id === activeLocation.id ? "active" : "not-active")} >
                <img src={item.icon} className='w-4' alt={item.name} />
                <p className='text-sm font-medium truncate' >{item.name}</p>
            </li>
        ))}
    </ul>
</div>
);

return (
    <>
        <div className="window-header">
            <WindowControls target="finder" />
            <Search className='icon' />
        </div>
        <div className="bg-white flex h-full ">
            <div className="sidebar">
                {renderList("Favorite", Object.values(locations))}
                {renderList("My Projects", locations.work.children)}
            </div>

        <ul className='content' >
            {activeLocation?.children.map((item) => (
                <li key={item.id}
                    className={item.position}
                    onClick={() => openItem(item)}
                >
                    <img src={item.icon}
                         className=' w-12 h-12 cursor-pointer ' 
                        alt={item.name} />
                    <p className='text-sm font-medium truncate' >{item.name}</p>
                </li>
            ))}
        </ul>

        </div>
    </>
)
}


const FinderWindow = WindowWrapper(Finder, 'finder');
export default FinderWindow;