import React from 'react';
import document from '../img/document.png';
import unknown from '../img/unknown.png';

export default function FileInfo(props) {
    switch (props.file.type) {
        // Image
        case 1:
            return (
                <p key={props.index}>File Type: Image<br />
                    File Hash: <a href={props.file.url} target="_blank">{props.file.hash}</a><br />
                    <a href={props.file.url} target="_blank"><img src={props.file.url} alt="Image"/></a>
                </p>
            );

        // Video
        case 2:
            return (
                <p key={props.index}>File Type: Video<br />
                    File Hash: <a href={props.file.url} target="_blank">{props.file.hash}</a><br />
                    <video width="640" height="360" controls>
                        <source src={props.file.url} />
                    </video>
                </p>
            );

        // Document
        case 3:
            return (
                <p key={props.index}>File Type: Document<br />
                    File Hash: <a href={props.file.url} target="_blank">{props.file.hash}</a><br />
                    <a href={props.file.url} target="_blank"><img src={document} alt="Document"/></a>
                </p>
            );

        // Other
        default:
            return (
                <p key={props.index}>File Type: Other<br />
                    File Hash: <a href={props.file.url} target="_blank">{props.file.hash}</a><br />
                    <a href={props.file.url} target="_blank"><img src={unknown} alt="Other"/></a>
                </p>
            );
    }
}