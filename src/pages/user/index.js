import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import { connectData } from './../../components/FIrebase/firebaseConnect'
import { Page } from 'components'

function User(props) {
  const [data, setData] = useState()
  useEffect(() => {
    connectData.on('value', (notes) => {
      var arrayData = []
      notes.forEach((element) => {
        const title = element.val().title
        const content = element.val().content
        const createAt = element.val().createAt
        arrayData.push({
          title: title,
          content: content,
          createAt: createAt,
        })
      })
      arrayData.sort((a, b) => {
        return parseFloat(b.createAt) - parseFloat(a.createAt)
      })
      setData(arrayData)
    })
  }, [])

  return (
    <>
      {data?.map((item) => (
        <Page inner>
          <h1 style = {{color:"red"}}>{item.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </Page>
      ))}
    </>
  )
}

export default User
