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
        const content = element.val().content
        const createAt = element.val().createAt
        arrayData.push({
          id : id,
          title: title,
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

  handleRequest = () => {
    connectData.push({
      title: this.state.title,
      content: this.state.htmlContent,
      createAt: new Date().getTime(),
    })
    message.success(`Bạn đã đăng bài ${this.state.title} thành công !!!`)
  }

  handleEdit = (id) => {
    connectData.child(id).set({
      title: this.state.title,
      content: this.state.htmlContent,
      createAt:  this.state.dataFilter[0].createAt,
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
      editorContent: EditorState.createWithContent(content),
    })
    
  }

  render() {
    const { editorContent, dataFilter, title } = this.state
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

    return (
      <Page inner>
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
              onClick={()=>this.handleEdit(dataFilter[0].id)}
            >
              <Trans>Edit</Trans>
            </Button>
          </Col>
          <Col>
            <Button
              size="large"
              type="danger"
              style={{ width: 100, marginLeft: '10px' }}
              onClick={()=>this.handleDelete(dataFilter[0].id)}
            >
              <Trans>Delete</Trans>
            </Button>
          </Col>
          <Col md={8}>
            <Input
              size="large"
              value={title}
              onChange={this.handleInputChange}
              style={{ marginLeft: '10px' }}
              placeholder="tile input"
            />
          </Col>
          <Col md={10}>
            <AutoComplete
              style={{ width: 500 }}
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
        <Row gutter={32}>
          <Col>
            <Card title="Editor" style={{ overflow: 'auto', width: '80vw' }}>
              <Editor
                // value={dataFilter[0]?.content}
                wrapperStyle={{
                  minHeight: 500,
                }}
                editorStyle={{
                  minHeight: 376,
                }}
                contentBlock={'contentState'}
                editorState={editorContent}
                onEditorStateChange={this.onEditorStateChange}
              />
            </Card>
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
      </Page>
    )
  }
}
