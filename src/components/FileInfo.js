import React from 'react';
import document from '../img/document.png';
import unknown from '../img/unknown.png';

export default function FileInfo(props) {
    switch (props.file.type) {
        // Image
        case 1:
            return (
                <div className="box" key={props.index}>
                    <h1>Image</h1>
                    <a href={props.file.url} target="_blank"><img src={props.file.url} alt="Image" width="500"/></a>
                    <p>File hash: <code><a href={props.file.url} target="_blank">{props.file.hash}</a></code></p>
                </div>
            );

        // Video
        case 2:
            return (
                <div className="box" key={props.index}>
                    <h1>Video</h1>
                    <video width="500" controls>
                        <source src={props.file.url} />
                    </video>
                    <p>File hash: <code><a href={props.file.url} target="_blank">{props.file.hash}</a></code></p>
                </div>
            );

        // Document
        case 3:
            return (
                <div className="box" key={props.index}>
                    <h1>Document</h1>
                    <a href={props.file.url} target="_blank"><img src={document} alt="Document" width="380"/></a>
                    <p>File hash: <code><a href={props.file.url} target="_blank">{props.file.hash}</a></code></p>
                </div>
            );

        // Other
        default:
            return (
                <div className="box" key={props.index}>
                    <h1>Other</h1>
                    <a href={props.file.url} target="_blank"><img src={unknown} alt="Other" width="380"/></a>
                    <p>File hash: <code><a href={props.file.url} target="_blank">{props.file.hash}</a></code></p>
                </div>
            );
    }
}