import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@nextui-org/react';

interface DropzoneProps {
    onFilesAccepted: (files: File[]) => void;
}

export default function DragNDropUploader({ onFilesAccepted }: DropzoneProps) {
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            onFilesAccepted(acceptedFiles);
            handleFileUpload(acceptedFiles);
        },
        [onFilesAccepted]
    );

    const handleFileUpload = async (files: File[]) => {
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        let uploadedSize = 0;

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            await fetch('/upload-endpoint', {
                method: 'POST',
                body: new ReadableStream({
                    start(controller) {
                        const reader = file.stream().getReader();
                        function read() {
                            reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                if (value) {
                                    uploadedSize += value.length;
                                    const progress = Math.round((uploadedSize / totalSize) * 100);
                                    setUploadProgress(progress);
                                    controller.enqueue(value);
                                    read();
                                }
                            });
                        }
                        read();
                    },
                }),
            });
        }
        setUploadProgress(100);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        } // Specify accepted file types as an array
    });

    return (
        <section className="container">
            <div
                {...getRootProps({
                    className: `dropzone p-6 border-2 border-dashed rounded-md ${isDragActive ? 'border-blue-500' : 'border-gray-300'
                        }`,
                })}
            >
                <input {...getInputProps()} />
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
        </section>
    );
};

