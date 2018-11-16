import React from "react";
import { List, Button, Card, Modal, Row, Col, Icon } from "antd";
import MediaForm from "../MediaForm";
import Criteria from './Criteria';
import { deleteItem, viewItems } from "../../utils/httpUtils";
import MediaDetails from "../MediaDetails";

function compareMediaItems(item, type, other, otherType) {
    return item.id === other.id && type === otherType;
}

export default class ItemsList extends React.Component {
    state = {
        itemList: [],
        isEditFormShown: false,
        editFormMediaType: "",
        itemInfo: undefined,
        catalogSize: 0,
        filters: {},
        order: {},
        detailsIndex: -1
    };

    componentDidMount() {
        viewItems(1, { mediaType: null, fields: {} }, {})
            .then(response => {
                this.setState({
                    itemList: response.data.catalog,
                    catalogSize: response.data.size
                });
            })
            .catch(reason => {
                console.debug(reason);
                //workaround not the best way.
                this.setState({ itemList: [] });
            });
    }
    fetchPage = page => {
        viewItems(page, this.state.filters, this.state.order)
            .then(response => {
                this.setState({
                    itemList: response.data.catalog,
                    catalogSize: response.data.size
                });
            })
            .catch(reason => {
                Modal.error({
                    title: "Error fetching catalog items",
                    content: reason.message
                });
            });
    };
    handleEdit = item => {
        this.setState({
            isEditFormShown: true,
            editFormMediaType: item.type,
            itemInfo: item.itemInfo
        });
    };
    handleDelete = item => {
        deleteItem(item.type, item.itemInfo)
            .then(response => {
                this.setState({
                    itemList: this.state.itemList.filter(
                        el => !compareMediaItems(item.itemInfo, item.type, el.itemInfo, el.type)
                    )
                });
            })
            .catch(err => {
                // TODO: Handle error when deleting item in backend
                console.log(err);
            });
    };
    handleClose = itemInfo => {
        if (!itemInfo) {
            this.setState({
                isEditFormShown: false,
                editFormMediaType: ""
            });
            return;
        }
        const items = this.state.itemList;
        items[
            items.findIndex(el =>
                compareMediaItems(itemInfo, this.state.editFormMediaType, el.itemInfo, el.type)
            )
        ].itemInfo = itemInfo;
        this.setState({
            isEditFormShown: false,
            editFormMediaType: "",
            itemsList: items
        });
        console.log(items);
    };
    handleFilters = filters => {
        console.log(filters);
        filters.mediaType = filters.mediaType ? filters.mediaType : null;
        this.setState({
            filters: filters
        });
        this.fetchPage(1);
    };
    handleOrder = order => {
        console.log(order);
        this.setState({
            order: order
        });
        this.fetchPage(1);
    };
    handleDetails = index => {
        this.setState({
            detailsIndex: this.state.detailsIndex === index ? -1 : index
        });
    }
    render() {
        const { isAdmin} = this.props;
        const { itemInfo, itemList } = this.state;

        const listStyle = {
            controlBtn: {
                margin: '5px'
            },
            rightAlign: {
                textAlign: 'right'
            }
        };

        if (!itemList) {
            return <h2>Loading...</h2>;
        }
        return (
            <Card>
                <Criteria onFiltersChanged={this.handleFilters} onOrderChanged={this.handleOrder} />
                <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                        pageSize: 15,
                        onChange: this.fetchPage,
                        total: this.state.catalogSize
                    }}
                    dataSource={this.state.itemList}
                    renderItem={(item, index) => (
                        <List.Item
                            key={`${item.itemInfo.type}.${item.itemInfo.id}`}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <List.Item.Meta
                                    title={`${item.itemInfo.title}`}
                                    description={<div>{item.type}</div>}
                                    />
                                </Col>
                                <Col span={12} style={ listStyle.rightAlign }>
                                    {
                                    isAdmin?
                                        <div>
                                            <Button
                                                key={`Details.${Math.random()}`}
                                                onClick={e => this.handleDetails(index)}
                                                type="default"
                                                style={ listStyle.controlBtn }
                                            >
                                                <Icon type="ellipsis"/>
                                            </Button>
                                            <Button
                                                key={`Edit.${Math.random()}`}
                                                onClick={e => this.handleEdit(item)}
                                                type="primary"
                                                style={listStyle.controlBtn }
                                            >
                                                Edit
                                            </Button>
                                            <Button     
                                                key={`Delete.${Math.random()}`}
                                                onClick={e => this.handleDelete(item)}
                                                type="danger"
                                                style={listStyle.controlBtn }
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                        :
                                        <Button
                                            key={`Details.${Math.random()}`}
                                            onClick={e => this.handleDetails(index)}
                                            type="default"
                                        >
                                            <Icon type="ellipsis" />
                                        </Button>
                                        }
                                </Col>
                            </Row>
                            
                            <MediaDetails
                                item={item}
                                visible={this.state.detailsIndex === index}
                            />
                        </List.Item>
                    )}
                />
                <Modal
                    visible={this.state.isEditFormShown}
                    title="Edit Item"
                    onCancel={e => this.handleClose(null)}
                    // Removes default footer
                    footer={null}
                >
                    <div className="MetaForm">
                        <MediaForm
                            type={this.state.editFormMediaType}
                            action="update"
                            item={itemInfo}
                            handleClose={this.handleClose}
                        />
                    </div>
                </Modal>
            </Card>
        );
    }
}
