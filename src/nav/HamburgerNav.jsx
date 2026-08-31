import { useState, useEffect, useRef } from "react"
import styles from "./hamburger-nav.module.css"

const PAGES = [
  { label: "Basic Gallery", href: "/" },
  { label: "Flying Gallery", href: "/flying-gallery/" },
]

export function HamburgerNav() {
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => e.key === "Escape" && setOpen(false)
    const handleClick = (e) => !navRef.current?.contains(e.target) && setOpen(false)
    document.addEventListener("keydown", handleKey)
    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.removeEventListener("mousedown", handleClick)
    }
  }, [open])

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Site navigation">
      <button
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="hamburger-menu"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span className={`${styles.bar} ${open ? styles.barTop : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barMid : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barBot : ""}`} />
      </button>

      <ul
        id="hamburger-menu"
        className={`${styles.menu} ${open ? styles.menuOpen : ""}`}
        role="list"
      >
        {PAGES.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className={styles.link}
              aria-current={location.pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
