import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import Cropper from 'react-easy-crop';
import { Slider, Button } from '@mui/material';
import getCroppedImg from "@/lib/cropImage";

type ProfileUploaderProps = {
  fieldChange: (file: File | null) => void;
  mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null); // Type accordingly
  const [showCropper, setShowCropper] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
      setShowCropper(true); // Show cropper after file is selected
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCropComplete = useCallback((croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!file || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(fileUrl, croppedAreaPixels);
      if (croppedImage) {
        setFileUrl(URL.createObjectURL(croppedImage));
        setShowCropper(false);
        fieldChange(croppedImage); // Pass the cropped image file
      }
    } catch (e) {
      console.error(e);
    }
  }, [file, croppedAreaPixels, fileUrl, fieldChange]);

  return (
    <div>
      {showCropper ? (
        <div className="relative w-full h-64">
          <Cropper
            image={fileUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round" // Makes the crop circular
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{ containerStyle: { backgroundColor: 'rgb(0 0 0 / 0%)!important' }}}
          />
          <div className="mt-4">
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(zoom) => setZoom(Number(zoom))}
              style={{ marginTop: '13rem' }}
            />
            <div className="flex justify-end gap-4 mt-2">
              <Button
                variant="contained"
                color="primary"
                onClick={handleCrop}
                className="bg-primary-500 text-white hover:bg-primary-500 focus:ring-4 focus:ring-primary-500 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Crop & Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowCropper(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div {...getRootProps()} className="cursor-pointer flex-center gap-4">
          <input {...getInputProps()} className="cursor-pointer" />
          <img
            src={fileUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-24 w-24 rounded-full object-cover object-top"
          />
          <p className="text-primary-500 small-regular md:bbase-semibold">
            Change profile photo
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileUploader;
