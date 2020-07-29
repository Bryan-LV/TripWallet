import React, { useEffect, useState, useCallback } from 'react'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_PHOTOS } from '../../queries/trips'

function PhotoSearchResults({ searchProp, closeModal, setSelectedPhoto }) {
  const [photos, setPhotos] = useState(null);
  const [searchPhotos] = useLazyQuery(SEARCH_PHOTOS, {
    onCompleted: data => setPhotos(data.getPhotos)
  });

  useEffect(() => {
    try {
      searchPhotos({ variables: { query: searchProp } })
    } catch (error) {
      console.log(error);
    }
  }, [searchProp])

  const handleSelection = useCallback(
    (photo) => {
      setSelectedPhoto(photo)
    },
    [photos],
  )

  if (!searchProp) {
    return null
  }

  return (
    <div style={{ top: '0px', left: '0px' }} className="absolute h-auto max-w-lg w-full rounded-lg shadow-2xl py-8 bg-white z-10">
      <div className="text-right mr-4 mb-4 cursor-pointer">
        <h2 onClick={closeModal} className="py-1 px-3 text-xl border rounded-full inline-block hover:bg-gray-200">X</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        {photos && photos.map(photo => {
          return (
            <div style={{ justifySelf: 'center' }} className="cursor-pointer" key={photo.id} onClick={() => handleSelection(photo.src.small)}>
              <img src={photo.src.small} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PhotoSearchResults
