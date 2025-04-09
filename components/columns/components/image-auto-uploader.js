import { useState, useRef } from 'react';
import { Image01Icon } from '@hugeicons/react';
import { uploadImage } from '@/service/upload';
import Spinner from '../spinner';
import { getImageUrl } from '@/utils/utils';
import { useEffect } from 'react';
import { parseJson } from '@/utils/utils';

export default function ImageAutoUploader({
  value,
  onChange = () => {},
  width = 480,
  height = 320,
  rounded = 'xl',
  variant = 'public',
  returnSize = false,
}) {
  const [pValue, setValue] = useState(parseJson(value, value));
  const imageInput = useRef(null);
  const [localUrl, setLocalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({width, height});

  const url = getImageUrl(pValue?.id || pValue, '', variant);
  rounded = {
    xl: 'rounded-xl',
    full: 'rounded-full',
  }[rounded];

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <div className="flex flex-col w-full">
      <input
        ref={imageInput}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={async (evt) => {
          evt.preventDefault();

          if (evt.target.files?.length === 0) {
            setValue('');
            setLocalUrl('');
            onChange('');
            return;
          }
          const file = evt.target.files[0];
          setLoading(true);

          try {
            const { id } = await uploadImage(file);
            if (!returnSize) onChange(id);
            if (localUrl !== '') {
              URL.revokeObjectURL(localUrl);
            }
            const src = URL.createObjectURL(file);
            setLocalUrl(src);

            if (returnSize) {
              await new Promise((resolve) => {
                var reader = new FileReader();
                reader.onload = function(e) {
                  var img = new Image();
                  img.onload = function() {
                    onChange(JSON.stringify({
                      id,
                      width: img.width,
                      height: img.height,
                    }))
                    setSize({width: img.width, height: img.height})
                    resolve();
                  };
                  img.src = e.target.result;
                };
                reader.readAsDataURL(file);
              })
            }
          } catch (e) {
            console.error(e);
            setLocalUrl(localUrl);
          } finally {
            setLoading(false);
            evt.target.value = null;
          }
        }}
      />

      <div className="w-full mt-2 relative">
        {localUrl || url ? (
          <div
            onClick={(evt) => {
              evt.preventDefault();
              if (!loading) imageInput.current.click();
            }}
            style={{
              backgroundImage: `url(${localUrl || url})`,
              paddingTop: `${(size.height / size.width) * 100}%`,
            }}
            className={`bg-no-repeat bg-center bg-cover w-full cursor-pointer ${rounded}`}
          />
        ) : (
          <button
            className="w-full h-[240px] rounded-2xl flex justify-center 
              items-center bg-rs-background-1"
            onClick={(evt) => {
              evt.preventDefault();
              if (!loading) imageInput.current.click();
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <Image01Icon />
              <span>Upload Image</span>
            </div>
          </button>
        )}
        {loading ? (
          <Spinner className="w-full absolute left-0 top-0 h-full bg-white bg-opacity-50 opacity-100" />
        ) : null}
      </div>
    </div>
  );
}
