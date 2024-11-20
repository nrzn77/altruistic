import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import "./AdminDash.css";

const AdminDash = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    navigate("/admin");
  };

  const fetchNgos = async () => {
    try {
      const ngoQuery = query(
        collection(db, "NGOs"),
        where("verified_status", "==", false) // Fetch only NGOs with verified_status as false
      );
      const querySnapshot = await getDocs(ngoQuery);
      const ngoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNgos(ngoList);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const ngoDoc = doc(db, "NGOs", id);
      await updateDoc(ngoDoc, { verified_status: true }); // Update verified_status to true
      alert("NGO approved successfully!");
      fetchNgos(); // Refresh the list after update
    } catch (error) {
      console.error("Error approving NGO:", error);
      alert("Error approving NGO. Please try again.");
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  return (
    <div className="admin-container">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <div className="admin-content">
        <h1>Admin Dashboard</h1>
        {loading ? (
          <p>Loading NGOs...</p>
        ) : ngos.length > 0 ? (
          <table className="ngo-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>About Us</th>
                <th>License No</th>
                <th>Contact Email</th>
                <th>Phone</th>
                <th>Cash Payment Info</th>
                <th>Mobile Payment Info</th>
                <th>Wire Transfer (Account No)</th>
                <th>Wire Transfer (Branch)</th>
                <th>Wire Transfer (Bank)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ngos.map((ngo, index) => (
                <tr key={ngo.id}>
                  <td>{index + 1}</td>
                  <td>{ngo.name}</td>
                  <td>{ngo.aboutUs}</td>
                  <td>{ngo.licenseNo}</td>
                  <td>{ngo.contactInfo?.email}</td>
                  <td>{ngo.contactInfo?.phone}</td>
                  <td>{ngo.paymentInfo?.cash}</td>
                  <td>{ngo.paymentInfo?.mobilePayment}</td>
                  <td>{ngo.paymentInfo?.wireTransfer?.accountNumber}</td>
                  <td>{ngo.paymentInfo?.wireTransfer?.branchName}</td>
                  <td>{ngo.paymentInfo?.wireTransfer?.bankName}</td>
                  <td>
                    <button
                      className="approve-button"
                      onClick={() => handleApprove(ngo.id)}
                    >
                      Approve
                    </button>
                    <button className="reject-button">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No NGOs found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDash;
