import { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';
import { useTheme } from '@/context/ThemeContext';

type FileUploaderProps ={
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl);

    const { isDarkMode } = useTheme();

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    }, [file]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop, 
        accept: { 'image/*': ['.png', '.svg', '.jpg', '.jpeg'] }
    });
  
    return (
        <div {...getRootProps()} className={`flex flex-center flex-col rounded-xl cursor-pointer ${isDarkMode ? 'bg-dark-3' : 'bg-white-3 border-2'}`}>
            <input {...getInputProps()} className='cursor-pointer'/>
            {
            fileUrl ? (
                <>
                    <div className={`flex flex-1 justify-center w-full p-5 lg:p-10 ${isDarkMode ? 'bg-black' : ''}`}>
                        <img 
                            src={fileUrl} 
                            alt='uploaded-image' 
                            className='file_uploader-img' 
                            style={{
                                maxHeight: '400px', // Limit max height
                                maxWidth: '100%', // Ensure it doesn’t overflow the container
                                objectFit: 'contain', // Ensures image fills the box without distortion
                                borderRadius: '10px' // Rounded corners
                            }}
                        />
                    </div>
                    <p className='file_uploader-label'>Click or drag photo to replace</p>
                </>
            ) : (
                <div className='file_uploader-box'>
                    <img src='/assets/icons/file-upload.svg' width={96} height={77} alt='file-upload' />
                    <h3 className={`base-medium mb-2 mt-6 ${isDarkMode ? 'text-light-2' : 'text-dark-2'}`}>Drag photo here</h3>
                    <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>
                    <Button className='shad-button_dark_4'>Select</Button>
                </div>
                )
            }
        </div>
    )
}

export default FileUploader;