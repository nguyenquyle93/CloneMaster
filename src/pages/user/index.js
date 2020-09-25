import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import { connectData } from './../../components/FIrebase/firebaseConnect'
import { Page } from 'components'
import { message, Row, Col, Card, Button, Input, AutoComplete,Image } from 'antd'
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
        const imageLink = element.val().imageLink
        const content = element.val().content
        const createAt = element.val().createAt
        arrayData.push({
          id: id,
          title: title,
          imageLink: imageLink,
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
            <Row >
              <Col lg={18} md={24}>
                            <Card
              bordered={false}
              bodyStyle={{
                padding: '24px 36px 24px 0',
              }}
            >    
                <h1 style={{ color: "red" }}>{showData?.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: showData?.content }} />
                </Card>
              </Col>
              <Col lg={6} md={24}>
                {data.map(item =>
                <Row gutter={24}>
                  <Col lg={24} md={12}>
                  <Card
                    onClick={()=>handleClick(item.id)}
                    hoverable
                    style= {{
                      marginBottom: 10
                    }}
                    bodyStyle={{
                      padding: 10,
                    }}
                    cover={    
                      <Image
                      width={"100%"}
                      height={"40%"}
                      preview={false}
                      src={item.imageLink || "error"}
                      fallback="https://images.unsplash.com/photo-1600622269746-258d4124170a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                    />}
                  >
                    <div style={{text:"bold"}}>{item.title}</div>
                  </Card>
                  </Col>
                  </Row>
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
