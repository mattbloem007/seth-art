const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const blogPost2 = path.resolve(`./src/templates/blog-post2.js`)
  const blogArchive = path.resolve(`./src/templates/blog-archive.js`)

  return graphql(
    `
      {
        allContentfulArtDetails {
          edges {
            node {
              slug
              title
            }
          }
        }

        allContentfulBlogPost {
          edges {
            node {
              slug
              title
            }
          }
        }

        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
  //  const posts = result.data.allMarkdownRemark.edges
    const posts = result.data.allContentfulArtDetails.edges
    const posts2 = result.data.allContentfulBlogPost.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.slug,
        component: blogPost,
        context: {
          slug: post.node.slug,
          previous,
          next,
        },
      })
    })

    const postsPerPage = 6
    const numPages = Math.ceil(posts2.length / postsPerPage)

    // posts2.forEach((post, index) => {
    //   console.log("POST", post, index, postsPerPage)
    //   createPage({
    //     path: index === 0 ? `/blog` : `/blog/${index + 1}`,
    //     component: blogArchive,
    //     context: {
    //       limit: 6,
    //       skip: index * postsPerPage,
    //       numPages,
    //       currentPage: index + 1,
    //     },
    //   })
    // })

    posts2.forEach((post, index) => {
      const previous = index === posts2.length - 1 ? null : posts2[index + 1].node
      const next = index === 0 ? null : posts2[index - 1].node

      createPage({
        path:  `blog/${post.node.slug}`,
        component: blogPost2,
        context: {
          slug: post.node.slug,
          previous,
          next,
          limit: postsPerPage,
          skip: index * postsPerPage,
          numPages,
          currentPage: index + 1,
        },
      })
    })

    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
