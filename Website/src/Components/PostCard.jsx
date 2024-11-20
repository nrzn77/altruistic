import React from 'react'
import PostImage from './PostImage'
import DonateButton from './DonateButton'
import GoToUpdatesButton from './GoToUpdatesButton';
import { useNavigate } from 'react-router-dom';


export default function PostCard({ post }) {

    const navigate = useNavigate()
    const viewNGOOverview = (ngoId) => {
        navigate('/ngo/' + ngoId);
    };

    return (
        <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <i>{post.cause}</i>
            <h6 className="post-creator" onClick={() => viewNGOOverview(post.createdBy)}>
                {post.ngoName ? post.ngoName : <i>Author</i>}
            </h6>
            <PostImage post={post} />
            <p>{post.description}</p>
            <p>
                <strong>Targeted Amount:</strong> {post.targetedAmount}
            </p>
            <meter
                value={post.reachedAmount}
                min="0"
                max={post.targetedAmount}
                low={post.targetedAmount / 2}
                style={{ width: '100%', height: '35px' }}
            ></meter>
            <p>
                <strong>Reached Amount:</strong> {post.reachedAmount}
            </p>
            <DonateButton post={post} />
            <GoToUpdatesButton post={post} />
        </div>
    )
}
