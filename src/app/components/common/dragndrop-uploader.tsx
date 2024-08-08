'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Button, Card, CardBody, Divider, Progress } from '@nextui-org/react';
import { SaveIcon, TrashCanIcon } from '../icons';
import * as actions from '@/actions';
import FormButton from './form-button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { set } from 'zod';

interface DropzoneProps {
    onFilesAccepted: (files: File[]) => void;
    onFilesRejected?: (files: File[]) => void;
}

interface PreviewFile extends File {
    preview: string;
}

export default function DragNDropUploader({ onFilesAccepted }: DropzoneProps) {
    const { data: session } = useSession();
    const [formDrop, setDropState] = useState({ errors: {} });
    const [files, setFiles] = useState<PreviewFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [pending, setPending] = useState<boolean>(false);



    const onDropFilesAccepted = useCallback(
        (acceptedFiles: File[]) => {
            setDropState((prevState) => ({
                ...prevState,
                errors: {},
            }));
            const previewFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
            setFiles(previewFiles);
            onFilesAccepted(acceptedFiles);
        },
        [onFilesAccepted]
    );

    const onDropFilesRejected = useCallback(
        (rejectedFiles: FileRejection[]) => {
            setDropState((prevState) => ({
                ...prevState,
                errors: {},
            }));

            const errorMessages = rejectedFiles.reduce((acc, fileRejection) => {
                acc[fileRejection.file.name] = fileRejection.errors.map((error) => error.message).join(', ');
                return acc;
            }, {} as { [key: string]: string });

            setDropState((prevState) => ({
                ...prevState,
                errors: errorMessages,
            }));
            console.log(errorMessages)
        },
        []
    );

    const processFile = async (files: File[]) => {

        if (!session?.user?.id) {
            setDropState((prevState) => ({
                ...prevState,
                errors: {
                    upload: 'User ID not found',
                },
            }));
            return;
        }
        if (files.length === 0) {

            setDropState((prevState) => ({
                ...prevState,
                errors: {
                    upload: 'No files to upload',
                },
            }));
            return;
        }

        setPending(true);

        setUploadProgress(0);
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        let uploadedSize = 0;

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('documentHash', 'documentHash');
                formData.append('userId', session?.user?.id as string);

                await actions.processFile(formData);
                uploadedSize += file.size;
                setUploadProgress(Math.min((uploadedSize / totalSize) * 100, 100));
            }
            setUploadProgress(100);
            setPending(false);
        } catch (error) {
            console.error('Error uploading files:', error);

            // Adding error to setDropState
            setDropState((prevState) => ({
                ...prevState,
                errors: {
                    ...prevState.errors,
                    upload: (error as Error).message || 'An error occurred during file upload',
                },
            }));
        }
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        noClick: true,
        maxFiles: 1,
        maxSize: 307200,
        minSize: 30,  //TODO: Test to see if this is necessary
        onDropAccepted: onDropFilesAccepted,
        onDropRejected: onDropFilesRejected,
        accept: {
            'image/jpeg': [],
            'image/png': [],
        },
    });

    const thumbs = files.map((file) => (
        <div>

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
                    width={240}
                    height={240}
                    src={file.preview}
                    alt={file.name}
                    className="object-cover w-full h-full"
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                />
            </div>
        </div>
    ));

    useEffect(() => {
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    return (
        <section className="container">
            <div {...getRootProps({
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
                            ? 'Drop your image here ...'
                            : "Drag 'n' drop some your image here, or click to select files"}
                    </p>
                </div>
                {uploadProgress !== null && (
                    <div className="mt-4">
                        <Progress value={uploadProgress} size="sm" color="primary" />
                    </div>
                )}
            </div>
            {Object.keys(formDrop.errors).length > 0 && (
                <Card className='bg-red-200 border-2 border-rose-600 mt-3'>
                    <CardBody>
                        <div className="mt-4 text-red-600">
                            <strong>Errors:</strong>
                            <ul>
                                {Object.entries(formDrop.errors).map(([fileName, error], index) => (
                                    <li key={index}>
                                        <strong>{fileName}</strong>: {error as React.ReactNode}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            )}
            <div>
                <aside
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 16,
                    }}
                >
                    <Divider className="my-4" />
                    {thumbs}
                </aside>
            </div>
            <Button startContent={<SaveIcon />} color='primary' type='submit' isLoading={pending}>
                Save
            </Button>
        </section>
    );
}
