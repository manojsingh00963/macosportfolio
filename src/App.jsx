import { Draggable } from "gsap/Draggable"
import gsap from "gsap"

import { Finder, Resume, Safari, Terminal, Text, Image, Figma, Contact, Gallery, Map, Trash } from "#windows";
import { Dock, Home, Navbar, Welcome } from "#components"

gsap.registerPlugin(Draggable);

const App = () => {


  return (
  <main>
    <Navbar/>
    <Welcome/>
    <Dock/>
    <Home/>


    <Terminal/>
    <Safari/>
    <Resume/>
    <Finder/>
    <Text/>
    <Image/>
    <Figma/>
    <Contact/>

    {/* <Map/> */}
    {/* <Gallery/> */}
    {/* <Trash/> */}
  </main>  
  )
}

export default App