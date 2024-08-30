'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Button, ButtonGroup, Card, CardBody, Divider, Progress } from '@nextui-org/react';
import { CloseIcon, SaveIcon, TrashCanIcon } from '../icons';
import * as actions from '@/actions';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import { createProfileImagePath } from '@/utils/public-paths';
import { set } from 'zod';

interface DropzoneProps {
    onFilesAccepted: (files: File[]) => void;
    onFilesRejected?: (files: File[]) => void;
    onClose: () => void;

}

interface PreviewFile extends File {
    preview: string;
}

type DropState = {
    errors: {
        _form: string[];  // Changed to a simple array of strings
    };
};

export default function DragNDropUploader({ onFilesAccepted, onFilesRejected, onClose }: DropzoneProps) {
    const { data: session, status, update } = useSession()
    const [formDrop, setDropState] = useState<DropState>({ errors: { _form: [] } });
    const [files, setFiles] = useState<PreviewFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [pending, setPending] = useState<boolean>(false);
    const [saveEnabled, setSaveEnabled] = useState<boolean>(true);

    const onDropFilesAccepted = useCallback(
        (acceptedFiles: File[]) => {
            setDropState({ errors: { _form: [] } });
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
            const errorMessages = rejectedFiles.reduce((acc, fileRejection) => {
                acc.push(fileRejection.errors.map((error) => error.message).join(', '));
                return acc;
            }, [] as string[]);

            setDropState({ errors: { _form: errorMessages } });
            if (onFilesRejected) {
                onFilesRejected(rejectedFiles.map((r) => r.file));
            }
            // console.log(errorMessages);
        },
        [onFilesRejected]
    );

    const processFile = async (files: File[]) => {
        setSaveEnabled(false);
        if (status === "authenticated") {

            if (!session?.user?.id) {
                setDropState({ errors: { _form: ['User ID not found'] } });
                return;
            }

            if (files.length === 0) {
                setDropState({ errors: { _form: ['No files to upload'] } });
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
                    formData.append('documentHash', 'documentHash'); // Ensure this is correct
                    formData.append('userid', session.user.id);

                    // Change File exist check to trigger on Drop
                    await actions.processFile(formData);

                    uploadedSize += file.size;
                    setUploadProgress(Math.min((uploadedSize / totalSize) * 100, 100));
                }
                console.log()
                update({ image: createProfileImagePath(session.user.id, files[0].name) });
                // update({ image: files[0].name as string });
                setUploadProgress(100);
                setPending(false);
                //  console.log('session updated', session);



            } catch (error) {
                setPending(false);
                console.error('Error uploading files:', error);
                setDropState({ errors: { _form: [(error as Error).message || 'An error occurred during file upload'] } });
                await getSession();
            }
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        noClick: true,
        maxFiles: 1,
        maxSize: 107200,
        minSize: 30,
        onDropAccepted: onDropFilesAccepted,
        onDropRejected: onDropFilesRejected,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/gif': [],
            'image/svg+xml': [],
            'image/webp': [],
        },
    });

    const removeFile = (file: PreviewFile) => {
        setFiles(files.filter((f) => f.name !== file.name));
        setSaveEnabled(true);
    }


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
                onClick={() => removeFile(file)}
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
    ));

    useEffect(() => {
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    return (
        <section className="container">
            <div
                {...getRootProps({
                    className: `dropzone p-6 min-h-64 border-2 border-dashed rounded-md ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`,
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
                            : "Drag 'n' drop some images here, or click to select files"}
                    </p>
                </div>
                {uploadProgress !== null && (
                    <div className="mt-4">
                        <Progress value={uploadProgress} size="sm" color="primary" />
                    </div>
                )}
            </div>
            {formDrop.errors._form.length > 0 && (
                <Card className="bg-red-200 border-2 border-rose-600 mt-3">
                    <CardBody>
                        <div className="mt-4 text-red-600">
                            <strong>Errors:</strong>
                            <ul>
                                {formDrop.errors._form.map((error, index) => (
                                    <li key={index}>{error}</li>
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
            <div className="flex justify-end">
                <ButtonGroup>

                    <Button disabled={!saveEnabled} startContent={<SaveIcon />} color="primary" onClick={() => processFile(files)} isLoading={pending}>
                        Save
                    </Button>
                    <Button startContent={<CloseIcon />} color='secondary' onClick={onClose}>Close</Button>
                </ButtonGroup>
            </div>
        </section>
    );
}
