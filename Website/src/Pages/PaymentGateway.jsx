import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const PaymentGateway = () => {
  const location = useLocation(); 
  const { postId, currentReachedAmount, targetedAmount, ngoName } = location.state;
  
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');
  const [showDownloadButton, setShowDownloadButton] = useState(false); 
  const navigate = useNavigate();

  const handleDonate = async (e) => {
    e.preventDefault();
    
    const donationAmount = parseFloat(amount);
    
    // Validation hudai
    if (donationAmount <= 0 || !amount || !bankAccount || !pin) {
      setMessage('Please enter a valid donation amount, bank account, and PIN.');
      return;
    }

    const newReachedAmount = currentReachedAmount + donationAmount;

    // Update reachedAmount in the database
    const postRef = doc(db, 'NGO_Posts', postId);
    await updateDoc(postRef, { reachedAmount: newReachedAmount });

    // taka disos
    setMessage(`Thank you for your donation! The amount has been updated.`);
    setShowDownloadButton(true);
    
    // hoise bhai back ja
    setTimeout(() => navigate('/donation-posts'), 4000);
  };

  // Generate PDF invoice
  const generateInvoice = () => {
    const doc = new jsPDF();

    const transactionDate = format(new Date(), 'dd/MM/yyyy HH:mm');

    // Add Title and organization info
    doc.setFontSize(22);
    doc.setTextColor(128,0,128);
    doc.text('ClearAid', 105, 15, null, null, 'center');
    doc.setFontSize(14);
    doc.setTextColor(128,0,0);
    doc.text('IUT, Gazipur', 105, 25, null, null, 'center');
    doc.setFontSize(16);
    doc.text('Altruism, Discretion, Transparency', 105, 35, null, null, 'center');

    // Invoice title
    doc.setFontSize(18);
    doc.setTextColor(255,0,0);
    doc.text('Payment Invoice', 105, 50, null, null, 'center');

    // Add transaction details in a table
    doc.autoTable({
      startY: 60,
      head: [['Details', 'Information']],
      body: [
        ['Bank Account', bankAccount],
        ['NGO Name', ngoName],
        ['Donation Amount', `${amount} Taka`],
        ['Transaction Date', transactionDate]
      ],
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your contribution!', 105, doc.internal.pageSize.height - 20, null, null, 'center');

    // Save PDF
    doc.save('Invoice.pdf');
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
      
      
      {showDownloadButton && (
        <button onClick={generateInvoice}>Download Invoice</button>
      )}
    </div>
  );
};

export default PaymentGateway;
