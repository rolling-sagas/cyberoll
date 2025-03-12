'use client';

import AddComment from './add-comment'
import { useState, useEffect, useCallback, useRef } from 'react';
import { getComments } from '@/service/comment';
import dayjs from '@/utils/day';
import Spinner from '../spinner';
import NoData from '@/components/common/no-data';
import Avatar from '@/components/common/avatar';

export default function Comments({sid}) {
  const [comments, setComments] = useState([])
  const [total, setTotal] = useState(100)
  const commentsRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const fetchComments = useCallback(async (page = 0) => {
    try {
      setLoading(true)
      const res = await getComments(sid)
      if (page === 0 && commentsRef.current) {
        commentsRef.current.scrollTop = 0
      }
      setComments(res.comments)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [sid])
  
  useEffect(() => {
    fetchComments()
  }, [sid])

  return (
    <>
      <div ref={commentsRef} className='mx-6 flex-grow overflow-y-auto relative'>
        {
          comments.map((c) => (<div className='flex my-2 gap-2' key={c.id}>
            <Avatar image={c.user.image} name={c.user.name} size={24} className='mt-2 flex-none' />
            <div>
              <div>
                <strong className='font-semibold text-sm mr-2'>{c.user.name}</strong>
                <span className='text-xs mt-2 text-gray-500'>{dayjs(c.createdAt).fromNow(true)}</span>
              </div>
              <div className='font-normal line-14 text-14px'>
                {c.content}
              </div>
            </div>
          </div>))
        }
        {
          loading ? <Spinner className="absolute top-20"/> : null
        }
        {
          comments.length === 0 && !loading ? <NoData text="No Comments Now!"/> : null
        }
      </div>
      <AddComment sid={sid} onAdd={fetchComments}/>
    </>
  );
}
