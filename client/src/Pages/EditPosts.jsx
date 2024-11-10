/* eslint-disable no-unused-vars */
import {useEffect, useState} from 'react'
import { PostForm} from '../Components'
import { useNavigate,  useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPosts] = useState(null)
    // const {slug} = useParams()
    // const navigate = useNavigate()

    // useEffect(() => {
    //     if (slug) {
    //         postServices.getPost(slug).then((post) => {
    //             if (post) {
    //                 setPosts(post)
    //             }
    //         })
    //     } else {
    //         navigate('/')
    //     }
    // }, [slug, navigate])
  return post ? (
    <div className=''>
        <>
            <PostForm post={post} />
        </>
    </div>
  ) : null
}

export default EditPost;