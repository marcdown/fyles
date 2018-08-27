import React from 'react';
import { Image, ResponsiveEmbed } from 'react-bootstrap';
import document from '../img/document.png';
import unknown from '../img/unknown.png';

export default function FyleInfo(props) {
    switch (props.file.type) {
        // Image
        case 1:
            return (
                <div className="App-fyle" key={props.index}>
                    <h1>Image</h1>
                    <div><a href={props.file.url} target="_blank"><Image src={props.file.url} alt="Image" responsive /></a></div><br/>
                    <p>File hash: <a href={props.file.url} target="_blank">{props.file.hash}</a></p>
                </div>
            );

        // Video
        case 2:
            return (
                <div className="App-fyle" key={props.index}>
                    <h1>Video</h1>
                    <ResponsiveEmbed a16by9>
                        <video controls>
                            <source src={props.file.url} />
                        </video>
                    </ResponsiveEmbed><br/>
                    <p>File hash: <a href={props.file.url} target="_blank">{props.file.hash}</a></p>
                </div>
            );

        // Document
        case 3:
            return (
                <div className="App-fyle" key={props.index}>
                    <h1>Document</h1>
                    <div><a href={props.file.url} target="_blank"><Image src={document} alt="Document" responsive /></a></div><br/>
                    <p>File hash: <a href={props.file.url} target="_blank">{props.file.hash}</a></p>
                </div>
            );

        // Other
        default:
            return (
                <div className="App-fyle" key={props.index}>
                    <h1>Other</h1>
                    <div><a href={props.file.url} target="_blank"><Image src={unknown} alt="Other"  responsive/></a></div><br/>
                    <p>File hash: <a href={props.file.url} target="_blank">{props.file.hash}</a></p>
                </div>
            );
    }
}