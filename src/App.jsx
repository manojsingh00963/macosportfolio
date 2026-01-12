import { Draggable } from "gsap/Draggable"
import gsap from "gsap"

import { Finder, Resume, Safari, Terminal, Text, Image, Figma, Contact } from "#windows";
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
  </main>  
  )
}

export default App