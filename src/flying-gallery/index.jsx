import React from "react"
import ReactDOM from "react-dom/client"

import { HamburgerNav } from "../nav/HamburgerNav"
import { FlyingGallery } from "./FlyingGallery"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HamburgerNav />
    <FlyingGallery />
  </React.StrictMode>
)
