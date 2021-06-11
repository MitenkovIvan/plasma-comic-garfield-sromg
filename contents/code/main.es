/*
 *   Copyright (C) 2007 Tobias Koenig <tokoe@kde.org>
 *   Copyright (C) 2009 Matthias Fuchs <mat69@gmx.net>
 *   Copyright (C) 2021 Ivan Mitenkov <m1t3nk0v@internet.ru>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License version 2 as
 *   published by the Free Software Foundation
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the
 *   Free Software Foundation, Inc.,
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

function init()
{
    comic.comicAuthor = "mezzacotta";
    comic.websiteUrl = "https://www.mezzacotta.net/garfield/";
    comic.shopUrl = "https://www.mezzacotta.net/garfield/";
    comic.firstIdentifier = 1;
    comic.requestPage(comic.websiteUrl, comic.User);
}

function pageRetrieved(id, data)
{
    print("pageRetrieved - id: " + id);

    // find the latest strip
    if (id == comic.User) {
        var re = new RegExp('<h2>No. (\\d+)');
        var match = re.exec(data);
        if (match != null) {
            comic.lastIdentifier = match[1];
            comic.websiteUrl += "?comic=" + comic.identifier;
            print("Last identifier: " + comic.lastIdentifier);
            comic.requestPage(comic.websiteUrl, comic.Page);
        } else {
            print("Failed to parse the last identifier.");
            comic.error();
        }
    }

    if (id == comic.Page) {
        var re = new RegExp('img src=\"(/garfield/comics/[^\"]+)');
        var match = re.exec(data);
        if (match != null) {
            var imageURL = "https://www.mezzacotta.net" + match[1];
            print(imageURL);
            comic.requestPage(imageURL, comic.Image);
        } else {
            print("Failed to parse the image URL.");
            comic.error();
        }
        
        // find the previous strip
        comic.previousIdentifier = comic.identifier - 1;
        print("Previous identifier: " + comic.previousIdentifier);

        // find the next strip
        comic.nextIdentifier = comic.identifier + 1;
        print("Next identifier: " + comic.nextIdentifier);
    }
}