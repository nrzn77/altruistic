import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import PostImage from '../Components/PostImage';
import PostCard from '../Components/PostCard';

import './Donation.css'; // CSS FILE FOR THE DONATION PAGE

const DonationPosts = () => {
    const [posts, setPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidePanelVisible, setSidePanelVisible] = useState(false);
    const navigate = useNavigate();

    const toggleSidePanel = () => {
        setSidePanelVisible(!sidePanelVisible);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((cat) => cat !== category)
                : [...prevCategories, category]
        );
    };

    const getNGOData = async (postData) => {
        const ngoRef = collection(db, 'NGOs');
        const q = query(ngoRef, where('userId', '==', postData.createdBy));
        const ngoSnapshots = await getDocs(q);
        return ngoSnapshots.docs[0] ? ngoSnapshots.docs[0].data() : null;
    };

    const fetchPosts = async (isInitialLoad = false) => {
        setLoading(true);
        let allPosts = [];

        if (selectedCategories.length > 0) {
            // Fetch posts for each selected category
            for (const category of selectedCategories) {
                let categoryQuery = query(
                    collection(db, 'NGO_Posts'),
                    where('cause', '==', category),
                    orderBy('createdAt', 'desc'),
                    ...(isInitialLoad
                        ? [limit(5)]
                        : [startAfter(lastVisible), limit(5)])
                );

                const categorySnapshot = await getDocs(categoryQuery);

                const categoryPosts = await Promise.all(
                    categorySnapshot.docs.map(async (docSnapshot) => {
                        const postData = docSnapshot.data();
                        const ngoData = await getNGOData(postData);
                        return {
                            ...postData,
                            ngoName: ngoData ? ngoData.name : postData.ngoEmail,
                            id: docSnapshot.id,
                        };
                    })
                );

                allPosts = [...allPosts, ...categoryPosts];
            }
        } else {
            // Fetch all posts if no categories are selected
            let baseQuery = query(
                collection(db, 'NGO_Posts'),
                orderBy('createdAt', 'desc'),
                ...(isInitialLoad
                    ? [limit(5)]
                    : [startAfter(lastVisible), limit(5)])
            );

            const postsSnapshot = await getDocs(baseQuery);

            allPosts = await Promise.all(
                postsSnapshot.docs.map(async (docSnapshot) => {
                    const postData = docSnapshot.data();
                    const ngoData = await getNGOData(postData);
                    return {
                        ...postData,
                        ngoName: ngoData ? ngoData.name : postData.ngoEmail,
                        id: docSnapshot.id,
                    };
                })
            );

            if (postsSnapshot.docs.length > 0) {
                setLastVisible(postsSnapshot.docs[postsSnapshot.docs.length - 1]);
            }
        }

        if (isInitialLoad) {
            setPosts(allPosts);
        } else {
            setPosts((prevPosts) => [...prevPosts, ...allPosts]);
        }

        setLoading(false);
        if (allPosts.length < 5) {
            setNoMorePosts(true);
        }
    };

    useEffect(() => {
        fetchPosts(true);
    }, [selectedCategories]);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && !noMorePosts) {
                fetchPosts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, noMorePosts]);

    return (
        <div className="donations-page">
            <p className='text-center' style={{ fontSize: '45px' }}>Donation Posts</p>

            {/* Filter and Search Options */}
            <div className="filter-search-container">
                <button
                    className="category-button"
                    onClick={toggleSidePanel}
                >
                    Filter by Category
                </button>

                {/* Side Panel */}
                <div className={`side-panel ${sidePanelVisible ? 'visible' : ''}`}>
                    <button
                        className="close-button"
                        onClick={toggleSidePanel}
                    >
                        X
                    </button>
                    <div className="checkbox-container">
                        {[' Natural Disaster', ' Medical Treatment', ' Education', ' Social Welfare', ' Animal Rescue'].map((category) => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    value={category}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>
                <select
                    value={selectedCategories}
                    onChange={(e) => setSelectedCategories([e.target.value])}
                    className="category-filter"
                >
                    <option value="" disabled >
                        Sort by 
                     </option>
                    <option value="High to Low">Maximum to least donation</option>
                    <option value="low to high">Least to Maximum donation</option>
                </ select>
            

            </div>

            <div className="posts-container">
                {posts.map((post, index) => (
                    <PostCard post={post} key={index}/>
                ))}
            </div>

            {loading && <p className='text-center'>Loading more posts...</p>}
            {noMorePosts && <p className='text-center'>No more posts to load.</p>}
        </div>
    );
};

export default DonationPosts;
