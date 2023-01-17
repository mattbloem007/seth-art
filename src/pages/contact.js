import React, { useState } from "react"
import { graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"
import axios from 'axios'
import { useForm } from "react-hook-form";

import Layout from "../components/layout"
import SEO from "../components/seo"

import "../utils/normalize.css"
import "../utils/css/screen.css"

const Contact = ({ data }, location) => {
  const siteTitle = data.site.siteMetadata.title

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onBlur"
  })

  const [serverState, setServerState] = useState({
    submitting: false,
    status: null
  });

  const [value, setValue] = useState({
    name: '',
    email: '',
    message: ''
  });

    const handleServerResponse = (ok, msg, form) => {
      setServerState({
        submitting: false,
        status: { ok, msg }
      });
      if (ok) {
        form.reset();
        setValue({
          name: '',
          email: '',
          message: ''
        })
      }
    };


    const onSubmit = (data, e) => {
      const form = e.target;
      console.log("data", data)
      setServerState({ submitting: true });
      axios({
        method: "post",
        url: "https://getform.io/f/d5a562a3-6d7a-43c4-981c-a402161790b2",
        data
      })
        .then(res => {
          handleServerResponse(true, "Thanks! for contacting.. Seth will reply soonest :)", form);
        })
        .catch(err => {
          handleServerResponse(false, err.response.data.error, form);
        });
    }

  const onChangeHandler = e => {
    setValue({ ...value, [e.target.name]: e.target.value })
  }

  return (
    <Layout title={siteTitle}>
      <SEO
        title="All posts"
        keywords={[`blog`, `gatsby`, `javascript`, `react`]}
      />

      <article className="post-content page-template no-image">
        <header className="contact-head">
          <h2 className="page-head-title">
            Contact Me
          </h2>
        </header>
        <div className="post-content-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row gtr-uniform">
            <div className="col-6 col-12-xsmall">
              <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  {...register('name', {
                    onChange: (e) => {onChangeHandler(e)},
                    required: 'Full Name Required'
                  })}
              />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>
            <div className="col-6 col-12-xsmall">
              <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register('email', {
                    onChange: (e) => {onChangeHandler(e)},
                    required: 'Email Required',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "invalid email address"
                    }
                   })}
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            {/* Break */}
            {/* Break */}
            <div className="col-12">
            <textarea
                id="message"
                placeholder="Enter your message"
                {...register('message', {
                  onChange: (e) => {onChangeHandler(e)},
                  required: 'Message Required',
                  minLength: { value: 10, message: "Minimum length is 10" }
                })}

            >
            </textarea>
            {errors.message && <span className="error">{errors.message.message}</span>}
            </div>
            {/* Break */}
            <div className="col-12">
              {serverState.status && (
                  <p>
                      {serverState.status.msg}
                  </p>
              )}
              <ul className="actions">
                <li>
                  <input
                    type="submit"
                    defaultValue="Send Message"
                    className="primary"
                  />
                </li>
                {/**<li>
                  <input type="reset" defaultValue="Reset" />
                </li>*/}
              </ul>
            </div>

          </div>
        </form>
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
    smallPic: file(
      relativePath: { eq: "fabio-comparelli-696506-unsplash.jpg" }
    ) {
      childImageSharp {
        fluid(maxWidth: 1360) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    medPic: file(relativePath: { eq: "sophia-valkova-30139-unsplash.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1360) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    largePic: file(
      relativePath: { eq: "vladimir-malyutin-98174-unsplash.jpg" }
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
      <Contact location={props.location} data={data} {...props} />
    )}
  />
)
