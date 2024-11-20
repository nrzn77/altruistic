// import React, { useEffect, useState } from 'react';
// import { collection, onSnapshot } from 'firebase/firestore';
// import { db } from '../firebase-config';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
// import { animated, useSpring } from 'react-spring';

// const Statistics = () => {
//   const [totalCollected, setTotalCollected] = useState(0);
//   const [totalTarget, setTotalTarget] = useState(0);
//   const [volunteerCount, setVolunteerCount] = useState(0);
//   const [ngoCount, setNgoCount] = useState(0);
//   const [collectedHistory, setCollectedHistory] = useState([]);

//   useEffect(() => {
//     fetchStatistics();
//   }, []);

  
//   const fetchStatistics = async () => {
    
//     const unsubscribePosts = onSnapshot(collection(db, 'NGO_Posts'), (snapshot) => {
//       let collected = 0;
//       let target = 0;
//       const collectedHistoryTemp = [];
//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         collected += data.reachedAmount;
//         target += data.targetedAmount;
//         collectedHistoryTemp.push({ name: doc.data().title, reachedAmount: data.reachedAmount });
//       });
//       setTotalCollected(collected);
//       setTotalTarget(target);
//       setCollectedHistory(collectedHistoryTemp);
//     });

    
//     const unsubscribeVolunteers = onSnapshot(collection(db, 'Volunteers'), (snapshot) => {
//       setVolunteerCount(snapshot.size);
//     });

    
//     const unsubscribeNGOs = onSnapshot(collection(db, 'NGOs'), (snapshot) => {
//       setNgoCount(snapshot.size);
//     });

//     return () => {
//       unsubscribePosts();
//       unsubscribeVolunteers();
//       unsubscribeNGOs();
//     };
//   };

  
//   const animatedProps = useSpring({
//     from: { opacity: 0, transform: 'scale(0.9)' },
//     to: { opacity: 1, transform: 'scale(1)' },
//     config: { duration: 500 },
//   });

 
//   const barData = [
//     { name: 'Collected', amount: totalCollected },
//     { name: 'Targeted', amount: totalTarget }
//   ];

//   return (
//     <div>
//       <h1>Project Statistics</h1>
//       <animated.div style={animatedProps} className="chart-container">
        
//         <h2>Total Donations</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="amount" fill="#82ca9d" animationDuration={1500} />
//           </BarChart>
//         </ResponsiveContainer>

       
//         <h2>Donations Over Time</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={collectedHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="reachedAmount" stroke="#8884d8" dot={{ r: 6 }} animationDuration={1500} />
//           </LineChart>
//         </ResponsiveContainer>
//       </animated.div>
//     </div>
//   );
// };

// export default Statistics;


import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { animated, useSpring } from 'react-spring';

const Statistics = () => {
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [ngoCount, setNgoCount] = useState(0);
  const [collectedHistory, setCollectedHistory] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    const unsubscribePosts = onSnapshot(collection(db, 'NGO_Posts'), (snapshot) => {
      let collected = 0;
      let target = 0;

      const collectedHistoryTemp = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        collected += data.reachedAmount;
        target += data.targetedAmount;
        collectedHistoryTemp.push({ name: doc.data().title, reachedAmount: data.reachedAmount });
      });

      setTotalCollected(collected);
      setTotalTarget(target);
      setCollectedHistory(collectedHistoryTemp);
    });

    const unsubscribeVolunteers = onSnapshot(collection(db, 'volunteers'), (snapshot) => {
      setVolunteerCount(snapshot.size); 
    });

    const unsubscribeNGOs = onSnapshot(collection(db, 'NGOs'), (snapshot) => {
      setNgoCount(snapshot.size);
    });

    return () => {
      unsubscribePosts();
      unsubscribeVolunteers();
      unsubscribeNGOs();
    };
  };

  const animatedProps = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { duration: 500 },
  });

  const barData = [
    { name: 'Collected', amount: totalCollected },
    { name: 'Targeted', amount: totalTarget }
  ];

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Statistics</h1>
      <animated.div style={animatedProps}>
        {/* First Row: Volunteers and NGOs Count */}
        <div className="row text-center mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Volunteers</h5>
                <p className="display-4 text-primary">{volunteerCount}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">NGOs</h5>
                <p className="display-4 text-success">{ngoCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Total Collected and Total Target */}
        <div className="row text-center mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Total Collected</h5>
                <p className="display-4 text-warning">{totalCollected}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Total Target</h5>
                <p className="display-4 text-warning">{totalTarget}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">Total Donations</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#82ca9d" animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">Donations Over Time</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={collectedHistory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reachedAmount" stroke="#8884d8" dot={{ r: 6 }} animationDuration={1500} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default Statistics;


