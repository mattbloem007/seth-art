import React from "react"
import { Link } from "gatsby"

export default props => (
  <article
    className="post-feed"
    style={{display: "flex", flexDirection: "row", marginTop: "150px"}}
  >
    <article
      className={`blog-card ${
        props.postClass
      } ${props.node.image ? `with-image` : `no-image`}`}
      style={
        props.node.image && {
          backgroundImage: `url(${
            props.node.image.gatsbyImageData.images.fallback.src
          })`,
        }
      }
    >
    <Link to={props.node.slug} className="post-card-link">
    </Link>
    </article>
    <div className="post-content-body" style={{display: "flex", flexDirection: "column", paddingLeft: "50px"}}>
        <h2 className="page-head-title">
        {props.node.title}
        </h2>
      {props.node.description}
      <Link to={props.node.slug}>Read more...</Link>
    </div>
    <footer className="post-content-footer">
      {/* There are two options for how we display the byline/author-info.
  If the post has more than one author, we load a specific template
  from includes/byline-multiple.hbs, otherwise, we just use the
  default byline. */}
    </footer>
  </article>
)
