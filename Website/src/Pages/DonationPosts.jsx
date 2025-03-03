import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import PostImage from '../Components/PostImage';
import './Donation.css';

const DonationPosts = () => {
    const [posts, setPosts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidePanelVisible, setSidePanelVisible] = useState(false);
    const [sortOrder, setSortOrder] = useState('');
    const [total, setTotal] = useState(0);
    const [start, setStart] = useState(false);
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

    const handleStatusChange = (Status) => {
        setSelectedStatus((prevStatus) =>
            prevStatus.includes(Status)
                ? prevStatus.filter((cat) => cat !== Status)
                : [...prevStatus, Status]
        );
    };

    const getNGOData = async (postData) => {
        const ngoRef = collection(db, 'NGOs');
        const q = query(ngoRef, where('userId', '==', postData.createdBy));
        const ngoSnapshots = await getDocs(q);
        return ngoSnapshots.docs[0] ? ngoSnapshots.docs[0].data() : null;
    };

    const fetchPosts = async (isInitialLoad = false) => {
        console.log(start);
        
        setLoading(true);
    
        if (isInitialLoad) {
            setNoMorePosts(false);
            setLastVisible(null);
            setPosts([]);  
            setTotal(0); 
        }
    
        let allPosts = [];
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
    
        if (selectedStatus.length === 1) {
            if (selectedStatus.includes('Completed')) {
                allPosts = allPosts.filter((post) => post.targetedAmount <= post.reachedAmount);
            } else {
                allPosts = allPosts.filter((post) => post.targetedAmount > post.reachedAmount);
            }
        }
    
        if (selectedCategories.length > 0 && selectedCategories.length < 5) {
            const categorySet = new Set(selectedCategories);
            allPosts = allPosts.filter((post) => categorySet.has(post.cause));
        }
    
        // Sort fetched posts based on the selected sort order
        if (sortOrder === 'High to Low') {
            allPosts.sort((a, b) => b.reachedAmount - a.reachedAmount);
        } else if (sortOrder === 'Low to High') {
            allPosts.sort((a, b) => a.reachedAmount - b.reachedAmount);
        }
    
        if (isInitialLoad) {
            setPosts(allPosts);
            setTotal(allPosts.length); 
        } else {
            setPosts((prevPosts) => [...prevPosts, ...allPosts]);
            setTotal((prevTotal) => prevTotal + allPosts.length); 
        }
    
        setLoading(false);
        setStart(true);
    
        if (postsSnapshot.docs.length === 0) {
            setNoMorePosts(true);
        }
    };

    useEffect(() => {
        console.log(1);
        
        fetchPosts(true);
        
    }, [selectedCategories,selectedStatus]);
    
    // Dynamically sort posts when sort order changes
    useEffect(() => {
        console.log(2);
        const sortedPosts = [...posts];
        if (sortOrder === 'High to Low') {
            sortedPosts.sort((a, b) => b.reachedAmount - a.reachedAmount);
        } else if (sortOrder === 'Low to High') {
            sortedPosts.sort((a, b) => a.reachedAmount - b.reachedAmount);
        }
        setPosts(sortedPosts);
    }, [sortOrder]);

    const viewNGOOverview = (ngoId) => {
        navigate('/ngo/' + ngoId);
    };

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

    useEffect(() => {
        console.log(3);
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 5 && !loading && !noMorePosts && start) {
                fetchPosts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, noMorePosts, start]);
    useEffect(() => {
        console.log(4);
        if (start && total < 5 && !loading && !noMorePosts) {
            fetchPosts(); 
        }
    }, [start, total, loading, noMorePosts]);

    return (
        <div className="donations-page">
            <p className='text-center' style={{ fontSize: '45px' }}>Donation Posts</p>

            {/* Filter and Search Options */}
            <div className="filter-search-container">
                <button
                    className="category-button"
                    onClick={toggleSidePanel}
                >
                    Filter
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
                        <h3>By Category</h3>
                        {['Natural Disaster', 'Medical Treatment', 'Education', 'Social Welfare', 'Animal Rescue'].map((category) => (
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
                    <div className="checkbox-container mt-4">
                        <h3>By Completion</h3>
                        {['Completed','In Progress'].map((Status) => (
                            <label key={Status}>
                                <input
                                    type="checkbox"
                                    value={Status}
                                    checked={selectedStatus.includes(Status)}
                                    onChange={() => handleStatusChange(Status)}
                                />
                                {Status}
                            </label>
                        ))}
                    </div>
                </div>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="category-filter"
                >
                    <option value="" disabled>
                        Sort by
                    </option>
                    <option value="High to Low">Maximum to least donation</option>
                    <option value="Low to High">Least to Maximum donation</option>
                </select>
            </div>

            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <h3>{post.title}</h3>
                        <i>{post.cause}</i>
                        <h6 className="post-creator" onClick={() => viewNGOOverview(post.createdBy)}>
                            {post.ngoName}
                        </h6>
                        <PostImage post={post} />
                        <p>{post.description}</p>
                        <p>
                            <strong>Targeted Amount:</strong> {post.targetedAmount}
                        </p>
                        <meter
                            value={post.reachedAmount}
                            min={post.targetedAmount === 0 ? -1 : 0}
                            max={post.targetedAmount}
                            low={post.targetedAmount / 2}
                            style={{ width: '100%', height: '35px' }}
                        ></meter>
                        <p>
                            <strong>Reached Amount:</strong> {post.reachedAmount}
                        </p>
                        {post.reachedAmount < post.targetedAmount && (
                            <button
                                type="button"
                                className="btn btn-primary mt-3 w-100"
                                style={{ backgroundColor: 'var(--blue)', color: 'white' }}
                                onClick={() => goToPayment(post.id, post.reachedAmount, post.targetedAmount, post.ngoName)}
                            >
                                Donate Now!
                            </button>
                        )}
                        {post.reachedAmount >= post.targetedAmount && (
                            <p>Thanks to all our donors, we have reached our target!</p>
                        )}
                        <button
                            type="button"
                            className="btn btn-secondary mt-3 w-100"
                            style={{ backgroundColor: '#a1ddec', color: 'black' }}
                            onClick={() => navigate(`/updates/${post.id}`)}
                        >
                            Updates
                        </button>
                    </div>
                ))}
            </div>

            {loading && <p className='text-center'>Loading more posts...</p>}
            {noMorePosts && <p className='text-center'>No more posts to load.</p>}
        </div>
    );
};

export default DonationPosts;