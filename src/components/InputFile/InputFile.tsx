import { useRef } from 'react';
import { toast } from 'react-toastify';
import { parseFileSize } from '~/utils/utils';

const MAX_FILE_SIZE_MB = 1;

interface InputFileProps {
  onChange?: (file?: File) => void;
}

const InputFile = ({ onChange }: InputFileProps) => {
  // const [file, setFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0];

    const fileSize = parseFileSize(fileFromLocal?.size || 0);

    // console.log('>>> File Size:', fileSize);

    if (!fileFromLocal || fileSize.value > MAX_FILE_SIZE_MB || !fileFromLocal.type.match(/image\/(jpeg|png|jpg)/)) {
      toast.error(`Vui lòng chọn ảnh có định dạng .JPEG, .PNG và kích thước tối đa ${MAX_FILE_SIZE_MB} MB`, {
        position: 'top-center',
        autoClose: 1000
      });
      return;
    }

    // setFile(fileFromLocal);
    if (onChange && typeof onChange === 'function') {
      onChange(fileFromLocal);
    }
  };

  return (
    <>
      <input
        onClick={(e) => {
          (e.target as HTMLInputElement).value = ''; // Reset file input value to allow re-uploading the same file
        }}
        onChange={onFileChange}
        ref={fileInputRef}
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
      />
      <button
        onClick={handleUpload}
        type='button'
        className='flex h-10 cursor-pointer items-center justify-center rounded-sm border bg-white px-6 text-sm text-gray-600 capitalize shadow-sm'
      >
        Chọn ảnh
      </button>
    </>
  );
};

export default InputFile;
