'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Progress, Image } from '@nextui-org/react';
import { TrashCanIcon } from '../icons';
import * as actions from '@/actions';
import FormButton from './form-button';
import { useSession } from 'next-auth/react';

interface DropzoneProps {
    onFilesAccepted: (files: File[]) => void;
}

interface PreviewFile extends File {
    preview: string;
}

export default function DragNDropUploader({ onFilesAccepted }: DropzoneProps) {
    const { data: session } = useSession();
    const [files, setFiles] = useState<PreviewFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    console.log('session:', session);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const previewFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setFiles(previewFiles);
            onFilesAccepted(acceptedFiles);
        },
        [onFilesAccepted] // Add onFilesAccepted as a dependency
    );

    const processFile = async (files: File[]) => {
        setUploadProgress(0);
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        let uploadedSize = 0;

        try {
            setFormState('uploading...');
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('documentHash', 'documentHash');
                if (session?.user) {
                    //  formData.append('userId', session.user.id);
                }
                setFormState('saving...');

                await actions.processFile(formData);
                uploadedSize += file.size;
                setUploadProgress(Math.min((uploadedSize / totalSize) * 100, 100));
            }
            setUploadProgress(100);
            setFormState('complete');
        } catch (error) {
            console.error('Error uploading files:', error);
            setFormState('error');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        noClick: true,
        maxFiles: 1,
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
    });

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
                onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
            >
                <TrashCanIcon />
            </Button>
            <Image
                isBlurred
                width={240}
                src={file.preview}
                alt={file.name}
                className="object-cover w-full h-full"
                onLoad={() => URL.revokeObjectURL(file.preview)}
            />
        </div>
    ));

    useEffect(() => {
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    return (
        <section className="container">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    processFile(files);
                }}
                {...getRootProps({
                    className: `dropzone p-6 min-h-64 border-2 border-dashed rounded-md ${isDragActive ? 'border-blue-500' : 'border-gray-300'
                        }`,
                    'aria-label': isDragActive
                        ? 'Dropzone active, drop the files here'
                        : 'File upload dropzone',
                })}
            >
                <div className="text-center">
                    <input aria-label="File upload input" {...getInputProps()} />
                    <p className="text-center text-gray-500">
                        {isDragActive
                            ? 'Drop the files here ...'
                            : "Drag 'n' drop some files here, or click to select files"}
                    </p>
                </div>
                {uploadProgress !== null && (
                    <div className="mt-4">
                        <Progress value={uploadProgress} size="sm" color="primary" />
                    </div>
                )}
                <aside
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 16,
                    }}
                >
                    {thumbs}
                </aside>
                <FormButton>Save</FormButton>
            </form>
        </section>
    );
}

function setFormState(state: string) {
    console.log('Form state:', state);
}
