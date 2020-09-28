import { Component } from 'react'
import { Editor, Page } from 'components'
import { convertToRaw } from 'draft-js'
import { message, Row, Col, Card, Button, Input, AutoComplete, Select } from 'antd'
import { Trans } from '@lingui/react'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { convertFromRaw } from 'draft-js';
import { EditorState, ContentState } from 'draft-js'
import draftToMarkdown from 'draftjs-to-markdown'
import * as firebase from 'firebase'
import { connectData, connectData2, connectData3, connectData4, connectData5, connectData6, newPost } from '../../components/FIrebase/firebaseConnect'
import { stateFromHTML } from 'draft-js-import-html'

const { Option } = Select;
const page = ["user", "post", "request", "chart/ECharts", "chart/highCharts", "pages6","chart/Recharts"]
const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
export default class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorContent: EditorState.createEmpty(),
      htmlContent: null,
      title: null,
      imageLink: null,
      data: [],
      dataFilter: [],
      page: connectData,
      pageLink: "user",
    }
  }
  update = (value) => {
    value.on('value', (notes) => {
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
          editorContent: content
        })
      })
      console.log("1111111", arrayData)
      this.setState({ data: arrayData })
    })
  }
  onsuccess = () => {
    this.setState({
      editorContent: null,
      htmlContent: null,
      title: null,
      imageLink: null,
      data: [],
      dataFilter: [],
    })
  }
  componentWillMount() {
    this.update(this.state.page)
  }

  // componentDidUpdate(){
  //   componentDidUpdate(this.state.page) {
  //     if (this.props.name !== prevProps.name) {
  //       console.log("Name has changed!");
  //     }
  //   }
  // }
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

  handleCreate = () => {
    this.state.page.push({
      title: this.state.title,
      content: this.state.htmlContent,
      imageLink: this.state.imageLink,
      createAt: new Date().getTime(),
    })
    newPost.push({
      title: this.state.title,
      content: this.state.htmlContent,
      imageLink: this.state.imageLink,
      createAt: new Date().getTime(),
      pageLink: this.state.pageLink
    })
    message.success(`Bạn đã đăng bài ${this.state.title} thành công !!!`)
    this.onsuccess()
  }

  handleEdit = (id) => {
    this.state.page.child(id).set({
      title: this.state.title,
      content: this.state.htmlContent,
      imageLink: this.state.imageLink,
      createAt: this.state.dataFilter[0].createAt,
    })
    message.success(`Bạn đã chỉnh sữa bài ${this.state.title} thành công !!!`)
    this.onsuccess()
  }

  handleDelete = (id) => {
    this.state.page.child(id).remove();
    message.success(`Bạn đã xóa bài ${this.state.dataFilter[0].title} thành công !!!`)
    this.onsuccess()
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
      // editorContent: EditorState.createWithContent(a[0].content),
    })
  }

  onChangePage = (index) => {
    const pageSelect = [connectData, connectData2, connectData3, connectData4, connectData5, connectData6, newPost]
    this.onsuccess()
    this.setState({
      page: pageSelect[index],
      pageLink: page[index],
    })
    this.update(pageSelect[index])
  }

  render() {

    const { editorContent, dataFilter, data, title, imageLink } = this.state
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
          <Col lg={24} md={24}>
            <Row>
              <Col>
                <Button
                  size="large"
                  type="primary"
                  style={{ width: 100 }}
                  onClick={this.handleCreate}
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
              <Col>
                <Select
                  placeholder="Select page"
                  size="large"
                  style={{
                    width: 200,
                    marginLeft: '10px',
                  }}
                  onChange={this.onChangePage}
                >
                  {page.map((item, index) => <Option value={index}>{item}</Option>)}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col lg={24} md={12}>
                <AutoComplete
                  style={{ width: "100%", marginTop: 10 }}
                  size="large"
                  placeholder="tile search"
                  options={data?.map((item) => {
                    return { ...item, value: item.title }
                  })}
                  onSelect={this.onSelect}
                // filterOption={(inputValue, option) =>
                //   option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                //   -1
                // }
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24} xl={24}>
                <Input
                  size="large"
                  style={{ width: "100%", marginTop: 10 }}
                  value={title}
                  onChange={this.handleInputChange}
                  placeholder="tile input"
                />
              </Col>
              <Col md={24} xl={24}>
                <Input
                  size="large"
                  value={imageLink}
                  onChange={this.handleImageLinkChange}
                  style={{ width: "100%", marginTop: 10 }}
                  placeholder="image link input"
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col md={24} xl={24}>
                <Editor
                  value={dataFilter[0]?.content}
                  wrapperStyle={{
                    overflow: "auto",
                    height: "100vh"
                  }}
                  editorStyle={{
                    height: "85vh"
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
      </Page >
    )
  }
}
