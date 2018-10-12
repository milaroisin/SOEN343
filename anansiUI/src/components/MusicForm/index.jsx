import React from 'react';
import { Form, Input, Button, DatePicker, Radio } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class MusicForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { type, title, artist, label, releaseDate, asin } = values;
                const { token } = this.props;

                if (this.props.action == "insert") {
                    // createNewMusic(type, title, artist, label, releaseDate, asin, token)
                    //     .then(response => {
                    //         console.log(response);
                    //     });
                } else if (this.props.action == "update") {
                    // updateMusic(type, title, artist, label, releaseDate, asin, token)
                    //     .then(response => {
                    //         console.log(response);
                    //     });
                }
            }
        });
    };

    render() {

        const { getFieldDecorator } = this.props.form;
        const item = this.props.item ? this.props.item : {};

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };

        return (
            <Form onSubmit={this.handleSubmit} className="MusicForm">

                <FormItem {...formItemLayout} label="Type">
                    {getFieldDecorator('format', {
                        rules: [
                            {
                                required: true,
                                message: 'Please select type'
                            }
                        ],
                        initialValue: item.format
                    })(<RadioGroup>
                        <RadioButton value="cd">CD</RadioButton>
                        <RadioButton value="vinyl">Vinyl</RadioButton>
                        <RadioButton value="casette">Cassette</RadioButton>
                    </RadioGroup>)}
                </FormItem>

                <FormItem {...formItemLayout} label="Title">
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input title'
                            }
                        ],
                        initialValue: item.title
                    })(<Input placeholder="Anastasis" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Artist">
                    {getFieldDecorator('artist', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input artist'
                            }
                        ],
                        initialValue: item.artist
                    })(<Input placeholder="Dead Can Dance" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Label">
                    {getFieldDecorator('label', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input label'
                            }
                        ],
                        initialValue: item.label
                    })(<Input placeholder="Sony Music" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Release date">
                    {getFieldDecorator('releaseDate', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input release date'
                            }
                        ],
                        initialValue: item.releaseDate
                    })(<DatePicker placeholder="2012-08-14" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="ASIN">
                    {getFieldDecorator('asin', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input ASIN'
                            },
                            {
                                len: 10,
                                message: "Must be 10 characters long"
                            }
                        ],
                        initialValue: item.asin
                    })(<Input placeholder="B008FOB124" disabled={this.props.action == "update"} />)}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedMusicForm = Form.create()(MusicForm);
export default WrappedMusicForm;