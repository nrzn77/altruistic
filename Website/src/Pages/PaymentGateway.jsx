import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentGateway = () => {
  const location = useLocation(); // to get post info passed through navigate
  const { postId, currentReachedAmount, targetedAmount } = location.state;
  
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleDonate = async (e) => {
    e.preventDefault();
    
    const donationAmount = parseFloat(amount);
    
    // Validation
    if (donationAmount <= 0 || !amount || !bankAccount || !pin) {
      setMessage('Please enter a valid donation amount, bank account, and PIN.');
      return;
    }

    const newReachedAmount = currentReachedAmount + donationAmount;

    // Update reachedAmount in the database
    const postRef = doc(db, 'NGO_Posts', postId);
    await updateDoc(postRef, { reachedAmount: newReachedAmount });

    // Display success message
    setMessage(`Thank you for your donation! The amount has been updated.`);
    
    // Optionally, navigate back to DonationPosts after a delay
    setTimeout(() => navigate('/donation-posts'), 2000);
  };

  return (
    <div>
      <h2>Payment Gateway</h2>
      <form onSubmit={handleDonate}>
        <div>
          <label>Donation Amount:</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Bank Account:</label>
          <input
            type="text"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="Enter your bank account number"
            required
          />
        </div>
        <div>
          <label>PIN Number:</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter your PIN"
            required
          />
        </div>
        <button type="submit">Donate</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentGateway;
