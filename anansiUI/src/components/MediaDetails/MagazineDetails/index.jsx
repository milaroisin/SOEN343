import React from 'react';
import MediaDetailsList from '../../MediaDetailsList';
import { prettifyTimeStamp } from '../../../utils/formatUtils';

export default class MagazineDetails extends React.Component {
    render() {
        const { item, isAdmin } = this.props;
        const data = [
            {
                title: 'Publisher:',
                content: item.itemInfo.publisher
            },
            {
                title: 'Publication Date:',
                content: prettifyTimeStamp(item.itemInfo.publicationDate)
            },
            {
                title: 'Language:',
                content: item.itemInfo.language
            },
            {
                title: 'ISBN-10:',
                content: item.itemInfo.isbn10
            },
            {
                title: 'ISBN-13:',
                content: item.itemInfo.isbn13
            }
        ];

        return (
            <MediaDetailsList
                isAdmin={isAdmin}
                type="Magazine"
                data={data}
                copies={item.itemInfo.copies}
            />
        );
    }
}
