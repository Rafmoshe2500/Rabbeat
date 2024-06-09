import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
    onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileUpload(acceptedFiles[0]);
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "audio/mpeg": [".mp3"],
            "audio/wav": [".wav"],
            "audio/webm": [".webm"],
            "audio/flac": [".flac"],
            "audio/x-m4a": [".m4a"],
        }
    });

    return (
        <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag & drop an audio file here, or click to select one</p>
        </div>
    );
};

export default FileUpload;
