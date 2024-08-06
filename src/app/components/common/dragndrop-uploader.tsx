'use client'
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Progress } from '@nextui-org/react';
import { TrashCanIcon } from '../icons';
import * as actions from '@/actions';
import { useFormState } from 'react-dom'
import FormButton from './form-button';

interface DropzoneProps {
    onFilesAccepted: (files: File[]) => void;
}

interface PreviewFile extends File {
    preview: string;
}

export default function DragNDropUploader({ onFilesAccepted }: DropzoneProps) {
    const [files, setFiles] = useState<PreviewFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const previewFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
            setFiles(previewFiles);
            //  onFilesAccepted(acceptedFiles);
            // handleFileUpload(previewFiles);
        },
        [onFilesAccepted]
    );

    const handleFileUpload = async (files: File[]) => {
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        let uploadedSize = 0;
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            actions.processFile(formState, formData);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('File upload failed');
                }

                // Simulate upload progress for demonstration purposes
                uploadedSize += file.size;
                const progress = Math.round((uploadedSize / totalSize) * 100);
                setUploadProgress(progress);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
        setUploadProgress(100);
    };

    // Use the react-dropzone hook to handle file uploads
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        noClick: true,
        maxFiles: 1,
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
    });

    // Display the uploaded files as thumbnails in the dropzone area 
    const thumbs = files.map((file) => (
        <div
            key={file.name}
            className="relative inline-flex rounded border border-gray-300 mb-2 mr-2 w-[200px] h-[200px] box-border overflow-hidden"
        >
            <Button
                isIconOnly
                color="warning"
                variant="faded"
                aria-label="Remove image"
                className="absolute top-1 right-1 z-10"
            >
                <TrashCanIcon />
            </Button>
            <img
                src={file.preview}
                className="object-cover w-full h-full"
                onLoad={() => { URL.revokeObjectURL(file.preview) }}
                alt={file.name}
            />
        </div>
    ));

    // Clean up the preview URL when the component is unmounted
    useEffect(() => {
        return () => {
            // Revoke the preview URL to avoid memory leaks
            files.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [files]);



    console.log(FormData)

    return (
        <section className="container">
            <form
                action={ }
                <div
                {...getRootProps({
                    className: `dropzone p-6 min-h-64 border-2 border-dashed rounded-md ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`,
                    'aria-label': isDragActive ? 'Dropzone active, drop the files here' : 'File upload dropzone'
                })}
            >
                <input aria-label="File upload input" {...getInputProps()} />
                <p className="text-center text-gray-500">
                    {isDragActive
                        ? "Drop the files here ..."
                        : "Drag 'n' drop some files here, or click to select files"}
                </p>
            </div>
            {uploadProgress !== null && (
                <div className="mt-4">
                    <Progress value={uploadProgress} size="sm" color="primary" />
                </div>
            )}

            <aside style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}>
                {thumbs}
            </aside>
            <FormButton>
                Save
            </FormButton>
        </form>
        </section >
    );
}