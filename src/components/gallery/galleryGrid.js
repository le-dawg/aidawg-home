// @flow

import React, { useState } from 'react'
import Img from 'gatsby-image'
import { chunk, sum } from 'lodash'
import { Box } from 'rebass'
import Carousel, { Modal, ModalGateway } from 'react-images'

import styled from 'styled-components'

const GalleryContent = styled.div`
  padding: 1.5rem;
  margin-bottom: 5rem;
  @media screen and (min-width: 52em) {
    padding: 2.5rem;
    margin-bottom: 0rem;
  }
  @media screen and (min-width: 64em) {
    padding: 3.5rem;
  }
  h2 {
    margin: 0;
  }
`

type Props = {
  images: {
    map: string,
    id: string,
    src: string,
    srcSet: string,
    fluid: string,
    title: string,
    thumbnail: string,
  },
  itemsPerRow?: number,
  title: string,
  slug: string,
}

const Gallery = ({
  title,
  images,
  itemsPerRow: itemsPerRowByBreakpoints,
}: Props) => {
  const aspectRatios = images.map(image => image.fluid.aspectRatio)
  const rowAspectRatioSumsByBreakpoints = itemsPerRowByBreakpoints.map(
    itemsPerRow =>
      chunk(aspectRatios, itemsPerRow).map(rowAspectRatios =>
        sum(rowAspectRatios)
      )
  )

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0)

  const closeModal = () => setModalIsOpen(false)
  const openModal = (imageIndex: number) => {
    setModalCurrentIndex(imageIndex)
    setModalIsOpen(true)
  }

  return (
    <GalleryContent>
      <h2 key={title}>{title}</h2>
      {images.map((image, i) => (
        <a key={image.src} onClick={() => openModal(i)}>
          <Box
            as={Img}
            key={image.id}
            fluid={image.thumbnail}
            title={image.title}
            width={rowAspectRatioSumsByBreakpoints.map(
              (rowAspectRatioSums, j) => {
                const rowIndex = Math.floor(i / itemsPerRowByBreakpoints[j])
                const rowAspectRatioSum = rowAspectRatioSums[rowIndex]
                return `${(image.fluid.aspectRatio / rowAspectRatioSum) * 100}%`
              }
            )}
            css={`
              display: inline-block;
              vertical-align: middle;
              width: auto;
            `}
          />
        </a>
      ))}
      {ModalGateway && (
        <ModalGateway>
          {modalIsOpen && (
            <Modal
              onClose={closeModal}
              styles={{
                blanket: base => ({
                  ...base,
                  backgroundColor: 'rgba(16,11,0,0.95)',
                  zIndex: 900,
                }),
                dialog: base => ({ ...base, width: '100%' }),
                positioner: base => ({ ...base, zIndex: 901 }),
              }}
            >
              <Carousel
                views={images.map(({ fluid }) => ({
                  source: fluid.src,
                }))}
          
                currentIndex={modalCurrentIndex}
                components={{ FooterCount: () => null }}
                styles={{
                  footer: base => ({
                    ...base,
                    background: 'none !important',
                    color: '#666',
                    padding: 0,
                    paddingTop: 20,
                    position: 'static',
                    '& a': { color: 'black' },
                  }),
                  header: base => ({
                    ...base,
                    background: 'none !important',
                    padding: 0,
                    paddingBottom: 10,
                    position: 'static',
                  }),
                  headerClose: base => ({
                    ...base,
                    color: '#666',
                    ':hover': { color: '#DE350B' },
                  }),
                  view: base => ({
                    ...base,
                    overflow: 'hidden',
                    objectFit: 'contain',
                    '& > img': {
                      maxHeight: '75vh',
                      height: 'auto',
                      width: 'auto',
                      margin: '0 auto',
                    },
                  }),
                }}
              />
            </Modal>
          )}
        </ModalGateway>
      )}
    </GalleryContent>
  )
}
export default Gallery
