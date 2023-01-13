import React from "react"
import { graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"
import {GatsbyImage} from 'gatsby-plugin-image'

import Layout from "../components/layout"
import SEO from "../components/seo"

import "../utils/normalize.css"
import "../utils/css/screen.css"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types"
import { renderRichText } from "gatsby-source-contentful/rich-text"
//TODO: switch to staticQuery, get rid of comments, remove unnecessary components, export as draft template

const Bold = ({ children }) => <span style={{fontWeight:"bold"}}>{children}</span>
const Text = ({ children }) => <p>{children}</p>

const options = {
  renderMark: {
    [MARKS.BOLD]: text => {
      console.log("text", text)
      return(
        <Bold>{text}</Bold>
      )},
  },
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      console.log("INLINES NODE", node)
      if (node.data.uri.indexOf('youtube.com') >= 0) {
        return (
          <div style={{display: "flex", justifyContent:"center"}}>
            <iframe width="340" height="315" src={node.data.uri} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        )
      }
      else {
        return (
          <a href={node.data.uri}>{children}</a>
        )
      }
    },
    [BLOCKS.PARAGRAPH]: (node, children) => {
      console.log(node)
      return (
        <Text>{children}</Text>
      )
    },
    [BLOCKS.EMBEDDED_ASSET]: node => {
      return (
        <>
          <h2>Embedded Asset</h2>
          <pre>
            <code>{JSON.stringify(node, null, 2)}</code>
          </pre>
        </>
      )
    },
  },
}

const AboutPage = ({ data }, location) => {
  const siteTitle = data.site.siteMetadata.title
  const post = data.contentfulAboutPage

  return (
    <Layout title={siteTitle}>
      <SEO title="ABout" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />

      <article className="post-content page-template no-image">
        <div className="post-content-body">
          <h2 id="clean-minimal-and-deeply-customisable-london-is-a-theme-made-for-people-who-appreciate-simple-lines-">
            {post.briefIntroduction}
          </h2>
          <figure className="kg-card kg-image-card kg-width-full">
            <GatsbyImage className="kg-image" image={post.selfPortrait.gatsbyImageData} />
          </figure>
          <h3 id="dynamic-styles">About Me</h3>
          {documentToReactComponents(JSON.parse(post.description.raw), options)}
        </div>
      </article>
    </Layout>
  )
}

const indexQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }

    contentfulAboutPage {
      briefIntroduction
      selfPortrait{
        gatsbyImageData(layout: FULL_WIDTH)
      }
      description {
        raw
      }
    }

    benchAccounting: file(
      relativePath: { eq: "bench-accounting-49909-unsplash.jpg" }
    ) {
      childImageSharp {
        fluid(maxWidth: 1360) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

export default props => (
  <StaticQuery
    query={indexQuery}
    render={data => (
      <AboutPage location={props.location} data={data} {...props} />
    )}
  />
)
