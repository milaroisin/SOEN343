import { Book } from './Book';
import { Magazine } from './Magazine';
import { Movie } from './Movie';
import { Music } from './Music';
import { MediaGateway } from '../db/MediaGateway';
import { Media } from './Media';

const pageSize = 15;

export class Catalog {
    static addItem(type, fields, callback) {
        MediaGateway.findMedia(type, fields, (err, rows) => {
            if (err) {
                err = new Error("There was an error checking for the item's existence");
                callback(err, rows);
                return;
            }
            if (rows.length !== 0) {
                err = new Error('Media item already exists in the database');
                callback(err, rows);
                return;
            }

            MediaGateway.saveMedia(type, fields, callback);
        });
    }

    static editItem(type, fields, callback) {
        var id = fields['id'];

        MediaGateway.findMedia(type, fields, (err, rows) => {
            if (rows.length !== 0 && fields.id !== rows[0].id) {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(
                    new Error(
                        'Media item with the identifier you specified already exists in the database'
                    ),
                    rows
                );
                return;
            }
            MediaGateway.findMediaById(type, id, (err, rows) => {
                if (err) {
                    callback(err, null);
                    return;
                } else if (rows.length === 0) {
                    callback(new Error('Media item does not exist in the database'), rows);
                    return;
                }
                MediaGateway.editMedia(type, id, fields, callback);
            });
        });
    }

    static viewItems(nPage, filters, ordering, callback) {
        var mediaArray = [];
        var jsonArray = [];
        MediaGateway.getItems(filters, ordering, function(err, media) {
            if (err) {
                callback(new Error('Error retrieving media items'));
                return;
            }
            jsonArray = media;

            mediaArray = Catalog.jsonToMedia(jsonArray);
            let size = mediaArray.length;
            mediaArray.slice(nPage * (pageSize - 1), nPage * pageSize);
            callback(mediaArray, size);
        });
    }

    static deleteItem(type, id, callback) {
        MediaGateway.findMediaById(type, id, (err, rows) => {
            if (err) {
                callback(err);
                return;
            } else if (rows.length === 0) {
                callback(new Error('Media item does not exist in the database'));
                return;
            }
            MediaGateway.deleteMedia(type, id, callback);
        });
    }

    static returnCopies(loans, client_id, callback) {
        loans.forEach(id => {
            MediaGateway.updateLoans(id, client_id, (err) => {
                if (err) {
                    callback(err);
                    return;
                }
            });
        });
    }

    static jsonToMedia(jsonArray) {
        var mediaArray = [];

        jsonArray.forEach(el => {
            var media;
            if (el.mediaType === 'Book'){
                media = new Book(el);
            } else if (el.mediaType === 'Magazine'){
                media = new Magazine(el);
            } else if (el.mediaType === 'Movie'){
                media = new Movie(el);
            } else if (el.mediaType === 'Music'){
                media = new Music(el);
            }
            media.copies = JSON.parse(el.copies);
            mediaArray.push(media);
        });
        return mediaArray;
    }

}
