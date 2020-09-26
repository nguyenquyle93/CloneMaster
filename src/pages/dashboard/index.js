import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import { newPost, connectData6 } from './../../components/FIrebase/firebaseConnect'
import { Page } from 'components'
import { message, Row, Col, Card, Carousel, Image, Pagination } from 'antd'
const { Meta } = Card

function User(props) {
  const [data, setData] = useState()
  const [direction, setDirection] = useState()
  const [showData, setShowData] = useState()

  const contentStyle = {
    height: '40vh',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  useEffect(() => {
    newPost.on('value', (notes) => {
      var arrayData = []
      notes.forEach((element) => {
        const id = element.key
        const title = element.val().title
        const imageLink = element.val().imageLink
        const content = element.val().content
        const createAt = element.val().createAt
        const pageLink = element.val().pageLink
        arrayData.push({
          id: id,
          title: title,
          imageLink: imageLink,
          content: content,
          createAt: createAt,
          pageLink: pageLink
        })
      })
      arrayData.sort((a, b) => {
        return parseFloat(b.createAt) - parseFloat(a.createAt)
      })
      setData(arrayData.splice(0, 4))
    })
    connectData6.on('value', (notes) => {
      var arrayData = []
      notes.forEach((element) => {
        const id = element.key
        const title = element.val().title
        const imageLink = element.val().imageLink
        const content = element.val().content
        const createAt = element.val().createAt
        const pageLink = "page7"
        arrayData.push({
          id: id,
          title: title,
          imageLink: imageLink,
          content: content,
          createAt: createAt,
          pageLink: pageLink
        })
      })
      arrayData.sort((a, b) => {
        return parseFloat(b.createAt) - parseFloat(a.createAt)
      })
      setDirection(arrayData.splice(0, 8))
    })
  }, [])
  const handleClick = (id) => {
    const selectData = data.find(item => item.id === id)
    setShowData(selectData)
  }
  console.log("111111", direction)

  return (
    <>
      {data ?
        <div>
          <Page >
            <Row>
              <Col>
            <Carousel autoplay>
                  <div>
                    <h3 style={contentStyle}>1</h3>
                  </div>
                  <div>
                    <h3 style={contentStyle}>2</h3>
                  </div>
                  <div>
                    <h3 style={contentStyle}>3</h3>
                  </div>
                  <div>
                    <h3 style={contentStyle}>4</h3>
                  </div>
                </Carousel>
                </Col>
            </Row>
            <Row >
              <Col lg={14} md={24}>
                    <Row>
                    <Col>
                    <h1>New Post</h1>
                    </Col>
                    </Row>
                  <Row gutter={24}>
                  {data?.map(item =>
                    <Col lg={12} md={12}>
                      <Card
                        onClick={() => handleClick(item)}
                        hoverable
                        style={{
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
                        <div style={{ text: "bold" }}>{item.title}</div>
                      </Card>
                    </Col>
                    )}
                  </Row>
              </Col>
              <Col lg={1} >
              </Col>
              <Col lg={9} md={24}>
              <Row>
                    <Col>
                    <h1>Direction Post</h1>
                    </Col>
                    </Row>
                {direction?.map(item =>
                  <Row gutter={24}>
                    <Col lg={24} md={12}>
                      <Card
                        onClick={() => handleClick(item)}
                        hoverable
                        style={{
                          marginBottom: 10
                        }}
                        bodyStyle={{
                          padding: 10,
                        }}
                      >
                        <h3>{item.title}</h3>
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
