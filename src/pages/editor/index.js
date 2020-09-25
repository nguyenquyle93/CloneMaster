import { Component } from 'react'
import { Editor, Page } from 'components'
import { convertToRaw } from 'draft-js'
import { message, Row, Col, Card, Button, Input, AutoComplete } from 'antd'
import { Trans } from '@lingui/react'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { EditorState, ContentState } from 'draft-js'
import draftToMarkdown from 'draftjs-to-markdown'
import * as firebase from 'firebase'
import { connectData } from '../../components/FIrebase/firebaseConnect'


export default class EditorPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorContent: null,
      htmlContent: null,
      title: null,
      imageLink: null,
      data: [],
      dataFilter: [],
    }
  }

  componentWillMount() {
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
      this.setState({ data: arrayData })
    })
  }

  onEditorStateChange = (editorContent) => {
    this.setState({
      editorContent: editorContent,
      htmlContent: draftToHtml(convertToRaw(editorContent.getCurrentContent())),
    })
  }

  handleInputChange = (e) => {
    this.setState({
      title: e.target.value,
    })
  }

  handleImageLinkChange = (e) => {
    this.setState({
      imageLink: e.target.value,
    })
  }

  handleRequest = () => {
    connectData.push({
      title: this.state.title,
      content: this.state.htmlContent,
      imageLink: this.state.imageLink,
      createAt: new Date().getTime(),
    })
    message.success(`Bạn đã đăng bài ${this.state.title} thành công !!!`)
  }

  handleEdit = (id) => {
    connectData.child(id).set({
      title: this.state.title,
      content: this.state.htmlContent,
      imageLink: this.state.imageLink,
      createAt: this.state.dataFilter[0].createAt,
    })
    message.success(`Bạn đã chỉnh sữa bài ${this.state.title} thành công !!!`)
  }

  handleDelete = (id) => {
    connectData.child(id).remove();
    message.success(`Bạn đã xóa bài ${this.state.dataFilter[0].title} thành công !!!`)
  }

  onSelect = (value) => {
    const a = this.state.data.filter((item) => {
      return item.title === value.toString()
    })
    const content = ContentState.createFromText(a[0].content)
    this.setState({
      dataFilter: a,
      title: a[0].title,
      imageLink: a[0].imageLink,
      editorContent: EditorState.createWithContent(content),
    })

  }

  render() {
    const { editorContent, dataFilter, title, imageLink } = this.state
    const colProps = {
      lg: 12,
      md: 24,
      style: {
        marginBottom: 32,
      },
    }
    const textareaStyle = {
      minHeight: 496,
      width: '100%',
      background: '#f7f7f7',
      borderColor: '#F1F1F1',
      padding: '16px 8px',
    }
    console.log('11111', dataFilter)
    return (
      <Page inner>
        <Row>
          <Col lg={24} md={24}>
            <Row>
              <Col>
                <Button
                  size="large"
                  type="primary"
                  style={{ width: 100 }}
                  onClick={this.handleRequest}
                >
                  <Trans>Create</Trans>
                </Button>
              </Col>
              <Col>
                <Button
                  size="large"
                  style={{
                    width: 100,
                    marginLeft: '10px',
                    backgroundColor: '#00FA9A',
                  }}
                  onClick={() => this.handleEdit(dataFilter[0].id)}
                >
                  <Trans>Edit</Trans>
                </Button>
              </Col>
              <Col>
                <Button
                  size="large"
                  type="danger"
                  style={{ width: 100, marginLeft: '10px' }}
                  onClick={() => this.handleDelete(dataFilter[0].id)}
                >
                  <Trans>Delete</Trans>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col lg={24} md={12}>
                <AutoComplete
                  style={{ width: "100%", marginTop:10 }}
                  size="large"
                  placeholder="tile search"
                  options={this.state.data?.map((item) => {
                    return { ...item, value: item.title }
                  })}
                  onSelect={this.onSelect}
                  filterOption={(inputValue, option) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                    -1
                  }
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col  md={24} xl={24}>
                <Input
                  size="large"
                  style={{ width: "100%", marginTop:10 }}
                  value={title}
                  onChange={this.handleInputChange}
                  placeholder="tile input"
                />
              </Col>
              <Col  md={24} xl={24}>
                <Input
                  size="large"
                  value={imageLink}
                  onChange={this.handleImageLinkChange}
                  style={{ width: "100%", marginTop:10 }}
                  placeholder="image link input"
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24} xl={24}>
                  <Editor
                    value={dataFilter[0]?.content}
                    wrapperStyle={{
                      overflow:"auto",
                      height: "100vh"
                    }}
                    editorStyle={{
                      height: "90vh"
                    }}
                    contentBlock={'contentState'}
                    editorState={editorContent}
                    onEditorStateChange={this.onEditorStateChange}
                  />
              </Col>
              {/* <Col {...colProps}>
            <Card title="HTML">
              <textarea
                style={textareaStyle}
                disabled
                value={
                  editorContent
                    ? draftToHtml(
                        convertToRaw(editorContent.getCurrentContent())
                      )
                    : ''
                }
              />
            </Card>
          </Col> */}
              {/* <Col {...colProps}>
            <Card title="Markdown">
              <textarea
                style={textareaStyle}
                disabled
                value={
                  editorContent
                    ? draftToMarkdown(
                        convertToRaw(editorContent.getCurrentContent())
                      )
                    : ''
                }
              />
            </Card>
          </Col>
          <Col {...colProps}>
            <Card title="JSON">
              <textarea
                style={textareaStyle}
                disabled
                value={
                  editorContent
                    ? JSON.stringify(
                        convertToRaw(editorContent.getCurrentContent())
                      )
                    : ''
                }
              />
            </Card>
          </Col> */}
            </Row>
          </Col>
        </Row>
      </Page>
    )
  }
}
