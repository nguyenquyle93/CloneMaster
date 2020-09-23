import { Component } from 'react'
import { Editor, Page } from 'components'
import { convertToRaw } from 'draft-js'
import {message, Row, Col, Card, Button, Input, Form } from 'antd'
import { Trans } from '@lingui/react'
import draftToHtml from 'draftjs-to-html'
import draftToMarkdown from 'draftjs-to-markdown'
import * as firebase from 'firebase';

export default class EditorPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorContent: null,
      htmlContent: null,
      title: null,
    }
  }

  onEditorStateChange = editorContent => {
    this.setState({
      editorContent: editorContent,
      htmlContent: draftToHtml(convertToRaw(editorContent.getCurrentContent()))
    })
  }

  handleInputChange = e => {
    this.setState({
      title : e.target.value
    })
  }

  handleRequest = () => {
    var connectData = firebase.database().ref('pages1');
    connectData.push({
      title: this.state.title,
      content: this.state.htmlContent,
    });
    message.success('Bạn đã đăng bài thành công !!!');
  }

  render() {
    const { editorContent } = this.state
    const colProps = {
      lg: 12,
      md: 24,
      style: {
        marginBottom: 32,
      }
    }
    const textareaStyle = {
      minHeight: 496,
      width: '100%',
      background: '#f7f7f7',
      borderColor: '#F1F1F1',
      padding: '16px 8px'
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
                <Trans>Send</Trans>
              </Button>
          </Col>
          <Col>
          <Input
                  size="large"
                  onChange={this.handleInputChange}
                  style={{ width: 500 }}
                  placeholder= "tile input"
                />
          </Col>
        </Row>
        <Row gutter={32}>
          <Col {...colProps}>
            <Card title="Editor" style={{ overflow: 'visible' }}>
              <Editor
                wrapperStyle={{
                  minHeight: 500,
                }}
                editorStyle={{
                  minHeight: 376,
                }}
                editorState={editorContent}
                onEditorStateChange={this.onEditorStateChange}
              />
            </Card>
          </Col>
          <Col {...colProps}>
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
          </Col>
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
