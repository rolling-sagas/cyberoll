import BaseButton from '@/components/buttons/base-button';

import { useModalStore } from '@/components/modal/dialog-placeholder';
import { useEffect, useState } from 'react';

import { Textarea } from '@/app/components/ui/textarea';
import ImageAutoUploaderBtn from '@/components/columns/components/image-auto-uploader-btn';
import Dialog from '@/components/modal/dialog';
import { feedback } from '@/service/feedback';
import useUserStore from '@/stores/user';
import { toast } from 'react-hot-toast/headless';

export const onReportProblem = ({ type, data }) => {
  const openModal = useModalStore.getState().open;

  openModal(<ReportProblemDIalog type={type} basicData={data} />);
};

export const ReportProblemDIalog = ({ title, type, basicData }) => {
  const userInfo = useUserStore((state) => state.userInfo);
  const closeModal = useModalStore((state) => state.close);

  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    if (!userInfo?.id) {
      toast.error('Please login to report a problem.');
      return;
    }
    try {
      setLoading(true);
      const reqData = {
        ...(basicData || {}),
        content,
        images: image,
        userId: userInfo.id,
        type,
      };
      console.log({ reqData });
      await feedback(reqData);
      toast.success('Thank you for reporting this problem.');
    } catch (error) {
      console.error(error);
      toast.error('Report failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log({ image });
  }, [image]);

  return (
    <Dialog
      title={title ? title : 'Report a problem'}
      header={null}
      width={450}
      body={
        <Textarea
          className="border-none focus:border-none hover:border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none -mt-[15px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Please include as many details as possible..."
        />
      }
      footer={
        <div className="flex w-full justify-between items-center">
          <div className="h-9 max-w-[250px]">
            <div className="cursor-pointer h-9 items-center justify-center flex">
              <ImageAutoUploaderBtn
                value={image}
                onChange={(image) => setImage(image)}
                width={22}
                height={22}
              />
            </div>
          </div>
          <BaseButton
            label="Submit"
            disabled={loading || content.trim().length === 0}
            onClick={async () => {
              closeModal();
              await onConfirm();
            }}
          />
        </div>
      }
    />
  );
};
