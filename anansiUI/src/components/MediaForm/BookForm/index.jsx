import React from 'react';
import { Form, Input, Button, Radio, InputNumber, DatePicker, Card } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class BookForm extends React.Component {
    deleted = [];
    handleAdd = () => {
        const { form } = this.props;
        const copyIds = form.getFieldValue('copyIds') || [];
        const newCopyIds = copyIds.concat(Math.min(...copyIds, 0) - 1);
        form.setFieldsValue({
            copyIds: newCopyIds
        });
    };
    handleDelete = copy => {
        const { form } = this.props;
        const copyIds = form.getFieldValue('copyIds');
        const { [copy]: _, ...copies } = form.getFieldValue('copies');
        if (copy >= 0) {
            this.deleted.push(copy);
            console.log(this.deleted);
        }
        form.setFieldsValue({
            copyIds: copyIds.filter(el => el !== copy),
            ['copies[' + copy + ']']: undefined
        });
    };
    validateCopyName = (_, value, callback) => {
        if (!value) {
            return callback();
        }
        const copyNames = Object.entries(this.props.form.getFieldValue('copies'))
            .filter(pair => pair[0])
            .map(pair => pair[1]);
        let err = undefined;
        if (copyNames.filter(name => name === value).length > 1) {
            err = new Error('Duplicate copy name');
        }
        callback(err);
    };
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const item = this.props.item || {};
        const { formItemLayout, tailFormItemLayout, centerButton } = this.props.styles;

        getFieldDecorator('copyIds', {
            initialValue: (item.copies && item.copies.map(e => e.id)) || []
        });
        return (
            <Form onSubmit={e => this.props.handleSubmit(e, this.props.form, this.deleted)} className="Form">
                <FormItem {...formItemLayout} label="Title">
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input title'
                            }
                        ],
                        initialValue: item.title
                    })(<Input placeholder="Do Androids Dream of Electric Sheep?" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Author">
                    {getFieldDecorator('author', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input author name'
                            }
                        ],
                        initialValue: item.author
                    })(<Input placeholder="Philip K. Dick" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Format">
                    {getFieldDecorator('format', {
                        rules: [
                            {
                                required: true,
                                message: 'Please select format'
                            }
                        ],
                        initialValue: item.format
                    })(
                        <RadioGroup>
                            <RadioButton value="paperback">Paperback</RadioButton>
                            <RadioButton value="hardcover">Hardcover</RadioButton>
                        </RadioGroup>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="Number of Pages">
                    {getFieldDecorator('pages', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input number of pages'
                            },
                            {
                                type: 'integer',
                                message: 'Please input an integer'
                            }
                        ],
                        initialValue: item.pages
                    })(<InputNumber placeholder="240" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Publisher">
                    {getFieldDecorator('publisher', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input publisher'
                            }
                        ],
                        initialValue: item.publisher
                    })(<Input placeholder="Del Rey" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Publication date">
                    {getFieldDecorator('publicationDate', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input publication date'
                            }
                        ],
                        initialValue: moment(item.publicationDate)
                    })(<DatePicker placeholder="2017-09-26" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Language">
                    {getFieldDecorator('language', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input language'
                            }
                        ],
                        initialValue: item.language
                    })(<Input placeholder="English" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="ISBN-10">
                    {getFieldDecorator('isbn10', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input ISBN-10'
                            },
                            {
                                len: 10,
                                message: 'Must be 10 digits long'
                            }
                        ],
                        initialValue: item.isbn10
                    })(<Input placeholder="1524796972" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="ISBN-13">
                    {getFieldDecorator('isbn13', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input ISBN-13'
                            },
                            {
                                len: 13,
                                message: 'Must be 13 digits long'
                            }
                        ],
                        initialValue: item.isbn13
                    })(<Input placeholder="9781524796976" />)}
                </FormItem>

                <Card title="Book Copies">
                    {getFieldValue('copyIds').map((copy, index) => {
                        return (
                            <FormItem key={copy}>
                                {getFieldDecorator(`copies[${copy}]`, {
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: 'Input a non-empty identifier or delete this copy'
                                        },
                                        {
                                            validator: this.validateCopyName
                                        }
                                    ],
                                    validateTrigger: ['onBlur'],
                                    initialValue: item.copies && (item.copies.find(el => el.id === copy)|| {}).name
                                })(<Input placeholder="Copy identifier" style={{ width: '80%', marginRight: 8 }} />)}
                                <Button type="default" onClick={() => this.handleDelete(copy)}>
                                    -
                                </Button>
                            </FormItem>
                        );
                    })}
                    <Button type="default" onClick={this.handleAdd}>
                        Add copy
                    </Button>
                </Card>

                <FormItem {...tailFormItemLayout} style={centerButton}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedBookForm = Form.create()(BookForm);
export default WrappedBookForm;
