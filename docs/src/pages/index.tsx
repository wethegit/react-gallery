import type { ReactNode } from "react"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"
import Heading from "@theme/Heading"

import { useVersions } from "../components/hooks/use-versions"
import { BasicGallery } from "../components/demos/basic-gallery/basic-gallery"

import styles from "./index.module.scss"

const FEATURES = [
  {
    title: "Accessible by default",
    description:
      "Focus management, tabbing, and live-region announcements follow the WAI carousel pattern out of the box.",
  },
  {
    title: "Compose, don't configure",
    description:
      "Compound components and render props give you full control of the markup for slides, nav, and pagination.",
  },
  {
    title: "Style with CSS variables",
    description:
      "Item width, gaps, and motion are plain CSS custom properties. Theming and reduced-motion support need zero JavaScript.",
  },
]

function Hero() {
  const { siteConfig } = useDocusaurusContext()
  const { galleryVersion } = useVersions()
  return (
    <header className={styles.hero}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>
          Demos and documentation for{" "}
          <code>@wethegit/react-gallery@{galleryVersion}</code>, a customizable,
          accessible gallery component for React.
        </p>
        <div className={styles.heroButtons}>
          <Link className="button button--primary button--lg" to="/docs/getting-started">
            Get started
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/demos/basic">
            See the demos
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home(): ReactNode {
  return (
    <Layout description="Demos and documentation for @wethegit/react-gallery, a customizable, accessible gallery component for React.">
      <Hero />
      <main>
        <section className="container">
          <Heading as="h2" className={styles.sectionTitle}>
            Try it
          </Heading>
          <p className={styles.sectionLead}>
            Click the arrows or dots, or drag the slides.
          </p>
          <BasicGallery />
        </section>

        <section className="container">
          <div className={styles.features}>
            {FEATURES.map((feature) => (
              <div key={feature.title} className={styles.feature}>
                <Heading as="h3">{feature.title}</Heading>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}
