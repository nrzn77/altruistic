import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function GoToUpdatesButton({ post }) {

    const navigate = useNavigate()

    return (<>
        <button
            type="button"
            className="btn btn-secondary mt-3 w-100"
            style={{ backgroundColor: '#a1ddec', color: 'black' }}
            onClick={() => navigate(`/updates/${post.id}`)}
        >
            Updates
        </button>
    </>
    )
}
