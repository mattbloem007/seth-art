import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import {GatsbyImage} from 'gatsby-plugin-image'

import Layout from "../components/layout"
import SEO from "../components/seo"
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

class BlogPostTemplate2 extends React.Component {
  render() {
    const post = this.props.data.contentfulBlogPost
    const siteTitle = this.props.data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.title}
        />
        <article
          className={`post-content ${post.image || `no-image`}`}
        >
          <header className="post-content-header">
            <h1 className="post-content-title">{post.title}</h1>
          </header>

          {/**post.description && (
            <p class="post-content-excerpt">{documentToReactComponents(JSON.parse(post.description.raw), options)}</p>
          )*/}

          {post.image && (
            <div className="post-content-image-blog">
              {/**<Img
                className="kg-image"
                fluid={post.frontmatter.thumbnail.childImageSharp.fluid}
                alt={post.frontmatter.title}
              />*/}
              <GatsbyImage className="sm-image" image={post.image.gatsbyImageData} alt={post.title}/>
            </div>
          )}

          <div className="post-content-body" style={{textAlign: "center"}}>
            {documentToReactComponents(JSON.parse(post.blogWriteUp.raw), options)}
          </div>

          <footer className="post-content-footer">
            {/* There are two options for how we display the byline/author-info.
        If the post has more than one author, we load a specific template
        from includes/byline-multiple.hbs, otherwise, we just use the
        default byline. */}
          </footer>
        </article>
      </Layout>
    )
  }
}

export default BlogPostTemplate2

export const pageQuery = graphql`
  query BlogPostBySlug2($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }

    contentfulBlogPost(slug: { eq: $slug }) {
      title
      slug
      image {
        gatsbyImageData(layout: FULL_WIDTH)
      }
      description
      blogWriteUp {
        raw
      }
    }

    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        thumbnail {
          childImageSharp {
            fluid(maxWidth: 1360) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
