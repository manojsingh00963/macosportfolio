import { Draggable } from "gsap/Draggable"
import gsap from "gsap"

import { Finder, Resume, Safari, Terminal, Text } from "#windows";
import { Dock, Navbar, Welcome } from "#components"

gsap.registerPlugin(Draggable);

const App = () => {


  return (
  <main>
    <Navbar/>
    <Welcome/>
    <Dock/>


    <Terminal/>
    <Safari/>
    <Resume/>
    <Finder/>
    <Text/>
  </main>  
  )
}

export default App