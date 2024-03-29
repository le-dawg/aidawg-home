import React from 'react'
import { graphql } from 'gatsby'

import Hero from './../components/general/Hero'
import Blurb from './../components/general/Blurb'
import List from './../components/general/contentList'

import styled from 'styled-components'

import SEO from './../components/general/SEO'

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'ContentCover' 'ContentStart';
  @media screen and (min-width: 52em) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'ContentStart ContentCover';
  }
  @media screen and (min-width: 64em) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'ContentStart ContentCover ContentCover';
  }
`
const ContentStart = styled.div`
  grid-area: ContentStart;
  display: grid;
  grid-template-areas: 'ContentCopy' 'ContentSecondary';
  padding: 1.5rem;
  margin-bottom: 5rem;
  @media screen and (min-width: 52em) {
    margin-bottom: 0rem;
    padding: 2.5rem;
  }
  @media screen and (min-width: 64em) {
    padding: 3.5rem;
  }
`
const ContentCopy = styled(Blurb)`
  grid-area: ContentCopy;
`
const ContentSecondary = styled.div`
  grid-area: ContentSecondary;
`
const ContentCover = styled.div`
  grid-area: ContentCover;
`

const MainBlog = ({ data }) => {
  const posts = data.allContentfulPost.edges
  const blog = data.contentfulBlog
  return (
    <>
      <SEO
        title="BLOG"
        image={blog.shareImage}
        description="A sporadic collection of thoughts mostly about the web"
      />
      <Content>
        <ContentStart>
          <ContentCopy content={blog.body} />
          <ContentSecondary>
            {posts.map(({ node: post }) => (
              <List
                blogList
                key={post.id}
                slug={post.slug}
                image={post.heroImage}
                title={post.title}
                date={post.publishDate}
                time={post.body.childMarkdownRemark.timeToRead}
                excerpt={post.body}
              />
            ))}
          </ContentSecondary>
        </ContentStart>
        <ContentCover className="hide">
          <Hero image={blog.heroImage} />
        </ContentCover>
      </Content>
    </>
  )
}

export const query = graphql`
  query {
    allContentfulPost(
      limit: 1000
      sort: { fields: [publishDate], order: DESC }
    ) {
      edges {
        node {
          title
          id
          slug
          publishDate(formatString: "DD MMM YYYY")
          heroImage {
            title
            fluid(quality: 65) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
          body {
            childMarkdownRemark {
              html
              excerpt(pruneLength: 140)
              timeToRead
            }
          }
        }
      }
    }
    contentfulBlog {
      title
      id
      heroImage {
        title
        fluid(maxWidth: 1600, quality: 50) {
          ...GatsbyContentfulFluid_withWebp
        }
      }
      shareImage {
        ogimg: resize(width: 1200, quality: 50) {
          src
          width
          height
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`

export default MainBlog
