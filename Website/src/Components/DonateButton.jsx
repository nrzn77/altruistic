import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function DonateButton({ post }) {

    const navigate = useNavigate()

    const goToPayment = (postId, reachedAmount, targetedAmount, ngoName) => {
        navigate('/payment-gateway', {
            state: {
                postId,
                currentReachedAmount: reachedAmount,
                targetedAmount,
                ngoName
            }
        });
    };

    return (<>
        {post.reachedAmount < post.targetedAmount && <button
            type="button"
            className="btn btn-primary mt-3 w-100"
            style={{ backgroundColor: 'var(--blue)', color: 'white' }}
            onClick={() => goToPayment(post.id, post.reachedAmount, post.targetedAmount, post.ngoName)}
        >
            Donate Now!
        </button>}
        {post.reachedAmount >= post.targetedAmount && <p>Thanks to all our donors, we have reached our target!</p>}
    </>
    )
}
