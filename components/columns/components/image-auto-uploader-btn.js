import { uploadImage } from '@/service/upload';
import { getImageUrl, parseJson } from '@/utils/utils';
import { Cancel01Icon, Image01Icon } from '@hugeicons/react';
import { useEffect, useRef, useState } from 'react';
import Spinner from '../spinner';

export default function ImageAutoUploaderBtn({
  value,
  onChange = () => {},
  width = 480,
  height = 320,
  variant = 'public',
  returnSize = false,
}) {
  const [pValue, setValue] = useState(parseJson(value, value));
  const imageInput = useRef(null);
  const [localUrl, setLocalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ width, height });
  const [fileName, setFileName] = useState('');

  const url = getImageUrl(pValue?.id || pValue, '', variant);

  const reset = () => {
    setLocalUrl('');
    setValue('');
    onChange('');
    setFileName('');
  };

  useEffect(() => {
    setValue(value);
  }, [value]);

  return (
    <div className="flex flex-row w-full h-full items-center">
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
          setFileName(file?.name || 'uploaded');
          setLoading(true);

          try {
            const uploadedImage = await uploadImage(file);
            console.log({ uploadedImage });
            const { id } = uploadedImage;
            if (!returnSize) onChange(id);
            if (localUrl !== '') {
              URL.revokeObjectURL(localUrl);
            }
            const src = URL.createObjectURL(file);
            setLocalUrl(src);

            if (returnSize) {
              await new Promise((resolve) => {
                var reader = new FileReader();
                reader.onload = function (e) {
                  var img = new Image();
                  img.onload = function () {
                    onChange(
                      JSON.stringify({
                        id,
                        width: img.width,
                        height: img.height,
                      })
                    );
                    setSize({ width: img.width, height: img.height });
                    resolve();
                  };
                  img.src = e.target.result;
                };
                reader.readAsDataURL(file);
              });
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

      <div className="w-full">
        <div className="flex flex-row items-center gap-2">
          <button
            className="w-full  rounded-2xl flex justify-center 
              items-center"
            onClick={(evt) => {
              evt.preventDefault();
              if (!loading) imageInput.current.click();
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <Image01Icon width={width} height={height} />
            </div>
          </button>
          {localUrl || url ? (
            // 设置最长长度，fileName 超长怎截取显式省略号
            <div className="flex flex-row items-center gap-2 max-w-[250px]">
              <span className="text-sm text-rs-text-secondary truncate flex-1 max-w-[250px] overflow-hidden text-ellipsis">
                {fileName}
              </span>
              <button
                className="cursor-pointer text-rs-text-secondary hover:text-rs-text-primary flex-shrink-0"
                onClick={(evt) => {
                  evt.stopPropagation();
                  reset();
                }}
              >
                <Cancel01Icon size={20} />
              </button>
            </div>
          ) : null}
          {loading ? (
            <div>
              <Spinner
                className="w-full left-0 top-0 h-full bg-white bg-opacity-50 opacity-100"
                size={18}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
