import { useState, useEffect } from 'react';
import useUserStore from '@/stores/user';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { updateUserInfo } from '@/service/user';
import ImageAutoUploader from '../components/image-auto-uploader';

export default function Profile() {
  const userInfo = useUserStore((state) => state.userInfo);
  const getUserInfo = useUserStore((state) => state.getUserInfo);
  const [editingInfo, setEditingInfo] = useState(
    userInfo || {}
  );
  const [editing, setEditing] = useState(false)

  const disabled = !editingInfo.name || editing;

  useEffect(() => {
    setEditingInfo(userInfo || {});
  }, [userInfo]);

  const update = async () => {
    if (editing) return
    setEditing(true)
    try {
      await updateUserInfo(editingInfo)
      await getUserInfo()
    } finally {
      setEditing(false)
    }
  }

  return (
    <div className="mx-6 my-4">
      <Label>Avator</Label>
      <div className='w-28 mb-4'>
        <ImageAutoUploader
          width={200}
          height={200}
          value={editingInfo?.image}
          rounded="full"
          onChange={(image) => {
            setEditingInfo({ ...editingInfo, image })
          }}
          variant="avator"
        />
      </div>
      <Label htmlFor="name">Name</Label>
      <Input
        className="mb-6 mt-1"
        type="text"
        id="name"
        placeholder="Name"
        value={editingInfo.name}
        onChange={(e) =>
          setEditingInfo({ ...editingInfo, name: e.target.value })
        }
      />
      <Label htmlFor="des">Description</Label>
      <Input
        className="mb-6 mt-1"
        type="text"
        id="des"
        placeholder="Description"
        value={editingInfo.description}
        onChange={(e) =>
          setEditingInfo({ ...editingInfo, description: e.target.value })
        }
      />
      <div className="flex gap-4 justify-end w-full">
        <Button variant="outline" onClick={() => setEditingInfo(userInfo)}>
          Cancle
        </Button>
        <Button disabled={disabled} onClick={update}>Save</Button>
      </div>
    </div>
  );
}
