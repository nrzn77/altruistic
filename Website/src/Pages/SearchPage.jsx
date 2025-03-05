// import React from "react";
import { useParams } from "react-router-dom";import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import React, { useState, useEffect } from 'react';
import PostCard from "../Components/PostCard";



//export default function SearchEngine(){
    //const { searchTerm } = useParams();
   // return <h1>You searched for {searchTerm}</h1>
//}
const SearchEngine = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { searchTerm } = useParams();
  
    // Function to handle searching
    const handleSearch = async (searchTerm) => {
      if (!searchTerm) return;
      setLoading(true);
  
      try {
        
        const postsRef = collection(db, 'NGO_Posts');
        const q = query(postsRef, where('title', '>=', searchTerm), where('title', '<=', searchTerm + '\uf8ff'));
        const qDesc = query(postsRef, where('description', '>=', searchTerm), where('description', '<=', searchTerm + '\uf8ff'));
        const querySnapshot = await getDocs(q);
        const queryDescSnapshot = await getDocs(qDesc);
        
        // Combine results
        let posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        let descPosts = queryDescSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        // Filter out duplicates
        posts = [...new Map([...posts, ...descPosts].map(post => [post.id, post])).values()];
  
        
        const ngosRef = collection(db, 'NGOs');
        const ngoQuery = query(ngosRef, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
        const ngoSnapshot = await getDocs(ngoQuery);
        const ngos = ngoSnapshot.docs.map(doc => doc.data());
  
        // For each NGO found, search for posts associated with that NGO
        for (const ngo of ngos) {
          const ngoPostsQuery = query(postsRef, where('createdBy', '==', ngo.userId));
          const ngoPostsSnapshot = await getDocs(ngoPostsQuery);
          const ngoPosts = ngoPostsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          posts = [...posts, ...ngoPosts];
        }
  
        // Remove duplicates if any
        posts = [...new Map(posts.map(post => [post.id, post])).values()];
  
        // Set the results
        setSearchResults(posts);
      } catch (error) {
        console.error("Error searching for posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(()=>{
        handleSearch(searchTerm)
    }, [searchTerm])
  
    return (
      <div className="search-page">
        <h1 style={{textAlign:"center"}}>Searched NGO Posts: {searchTerm}</h1>
  
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