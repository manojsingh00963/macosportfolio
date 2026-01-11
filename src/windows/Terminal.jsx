import { WindowControls } from '#components'
import { techStack } from '#constants'
import WindowWrapper from '#hoc/windowWrapper.jsx'
import { Check, Flag, Terminal as TerminalIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

const COMMAND = "@MANic's show tech stack"

function Terminal() {
  const [typed, setTyped] = useState('')
  const [visibleIndex, setVisibleIndex] = useState(0)

  const totalStacks = techStack.length
  const progress = Math.round((visibleIndex / totalStacks) * 100)

  /* ───── Typing Effect ───── */
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setTyped(COMMAND.slice(0, i + 1))
      i++
      if (i === COMMAND.length) clearInterval(interval)
    }, 45)
    return () => clearInterval(interval)
  }, [])

  /* ───── Stack Loading Effect ───── */
  useEffect(() => {
    if (typed.length !== COMMAND.length) return

    const loader = setInterval(() => {
      setVisibleIndex(prev => {
        if (prev >= totalStacks) {
          clearInterval(loader)
          return prev
        }
        return prev + 1
      })
    }, 220)

    return () => clearInterval(loader)
  }, [typed, totalStacks])

  const visibleStacks = useMemo(
    () => techStack.slice(0, visibleIndex),
    [visibleIndex]
  )

  return (
    <>
      <div id="window-header">
        <WindowControls target="terminal" />
        <h2>Tech Stack</h2>
         <TerminalIcon size={18} />
      </div>

      <div className="techstack terminal-font">
        {/* Command */}
        <p className="command-line">
          <span className="prompt">:~$</span> {typed}
          <span className="cursor" />
        </p>

        {/* Progress Bar */}
        <div className="progress-wrap">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Labels */}
        <div className="label">
          <p className="w-32">Category</p>
          <p>Technologies</p>
        </div>

        {/* Stack Content */}
        <ul className="content">
          {visibleStacks.slice(0, visibleIndex).map(({ category, items }) => (
            <li key={category} className="stack-row">
              <Check className="check" size={16} />
              <h3>{category}</h3>
              <ul className="stack-items">
                {items.map((item, i) => (
                  <li key={i}>
                    {item}
                    {i < items.length - 1 && ','}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="footnote">
          <p className="success">
            <Check size={16} />
            {visibleIndex} of {totalStacks} stacks loaded ({progress}%)
          </p>
          <p className="render">
            <Flag size={14} />
            Render time: 6ms
          </p>
        </div>
      </div>
    </>
  )
}

const TerminalWindow = WindowWrapper(Terminal, 'terminal')
export default TerminalWindow
