import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import { connectData } from './../../components/FIrebase/firebaseConnect'
import { Page } from 'components'
import { message, Row, Col, Card, Button, Input, AutoComplete } from 'antd'
const { Meta } = Card

function User(props) {
  const [data, setData] = useState()
  const [showData, setShowData] = useState()
  useEffect(() => {
    connectData.on('value', (notes) => {
      var arrayData = []
      notes.forEach((element) => {
        const id = element.key
        const title = element.val().title
        const content = element.val().content
        const createAt = element.val().createAt
        arrayData.push({
          id: id,
          title: title,
          content: content,
          createAt: createAt,
        })
      })
      arrayData.sort((a, b) => {
        return parseFloat(b.createAt) - parseFloat(a.createAt)
      })
      setData(arrayData)
      setShowData(arrayData[0])
    })
  }, [])
  console.log("11111", data)
  const handleClick = (id) => {
    const selectData = data.find(item => item.id === id)
    setShowData(selectData)
  }
  return (
    <>
      {data ?
        <div>
          <Page inner>
            <Row>
              <Col md={16}>
                <h1 style={{ color: "red" }}>{showData?.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: showData?.content }} />
              </Col>
              <Col md={2}>
              </Col>
              <Col md={5}>
                {data.map(item =>
                  <Card
                    onClick={()=>handleClick(item.id)}
                    hoverable
                    style={{ width: 240, paddingBottom:10 }}
                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                  >
                    <Meta title={item.title} />
                  </Card>
                )}
              </Col>
            </Row>
          </Page>
        </div>
        : ""}
    </>
  )
}

export default User
