import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import PostCard from "../Components/PostCard";

const SearchEngine = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { searchTerm } = useParams();

    // Function to check if a string contains any of the search words
    const containsSearchTerm = (text, searchTerm) => {
        const searchWords = searchTerm.toLowerCase().split(' ');
        const textLower = text.toLowerCase();
        return searchWords.some(word => textLower.includes(word));
    };

    // Function to handle searching
    const handleSearch = async (searchTerm) => {
        if (!searchTerm) return;
        setLoading(true);

        try {
            const postsRef = collection(db, 'NGO_Posts');
            const querySnapshot = await getDocs(postsRef);

            // Filter posts based on partial matches in title or description
            const posts = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(post => 
                    containsSearchTerm(post.title, searchTerm) || 
                    containsSearchTerm(post.description, searchTerm)
                );

            // Query for NGOs
            const ngosRef = collection(db, 'NGOs');
            const ngoSnapshot = await getDocs(ngosRef);

            // Filter NGOs based on partial matches in name
            const ngos = ngoSnapshot.docs
                .map(doc => doc.data())
                .filter(ngo => containsSearchTerm(ngo.name, searchTerm));

            // For each NGO found, search for posts associated with that NGO
            for (const ngo of ngos) {
                const ngoPostsQuery = query(postsRef, where('createdBy', '==', ngo.userId));
                const ngoPostsSnapshot = await getDocs(ngoPostsQuery);
                const ngoPosts = ngoPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                posts.push(...ngoPosts);
            }

            // Remove duplicates if any
            const uniquePosts = [...new Map(posts.map(post => [post.id, post])).values()];

            // Set the results
            setSearchResults(uniquePosts);
        } catch (error) {
            console.error("Error searching for posts: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm]);

    return (
        <div className="search-page">
            <h1 style={{ textAlign: "center" }}>Searched NGO Posts: {searchTerm}</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {searchResults.length > 0 ? (
                        <div className="posts-container">
                            {searchResults.map((post, index) => (
                                <PostCard post={post} key={index} />
                            ))}
                        </div>
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchEngine;