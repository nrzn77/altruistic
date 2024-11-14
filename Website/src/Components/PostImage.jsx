import React from "react";

export default function PostImage({ post }) {
    return (<>
        {post.photoURL && (
            <div className="d-flex justify-content-center mb-3" style={{ backgroundColor: 'black', borderRadius: '5px' }}>
                <img
                    src={post.photoURL}
                    alt="Post image"
                    className="img-fluid"
                    style={{ maxWidth: '80vmin', width: '100%' }}
                />
            </div>
        )}
    </>
    )
}