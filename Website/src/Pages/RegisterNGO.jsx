import React, { useState } from 'react';
import { auth, db } from '../firebase-config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

const RegisterNGO = () => {
  const [formData, setFormData] = useState({
    ngoID: '',
    name: '',
    aboutUs: '',
    licenseNo: '',
    email: '',
    phone: '',
    paymentInfo: {
      cash: '',
      mobilePayment: '',
      wireTransfer: {
        accountNumber: '',
        branchName: '',
        bankName: '',
      }
    },
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      paymentInfo: {
        ...prevData.paymentInfo,
        [name]: value
      }
    }));
  };

  const handleWireTransferChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      paymentInfo: {
        ...prevData.paymentInfo,
        wireTransfer: {
          ...prevData.paymentInfo.wireTransfer,
          [name]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const userCredential = await createUserWithEmailAndPassword(auth, formData.username, formData.password);
      const user = userCredential.user;

      
      await addDoc(collection(db, 'NGOs'), {
        ngoID: formData.ngoID,
        name: formData.name,
        aboutUs: formData.aboutUs,
        licenseNo: formData.licenseNo,
        contactInfo: {
          email: formData.email,
          phone: formData.phone
        },
        paymentInfo: {
          cash: formData.paymentInfo.cash,
          mobilePayment: formData.paymentInfo.mobilePayment,
          wireTransfer: {
            accountNumber: formData.paymentInfo.wireTransfer.accountNumber,
            branchName: formData.paymentInfo.wireTransfer.branchName,
            bankName: formData.paymentInfo.wireTransfer.bankName,
          }
        },
        userId: user.uid
      });

      alert('NGO registration complete!');
    } catch (error) {
      console.error('Error registering NGO:', error);
      alert('Error registering NGO, please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register Your NGO</h2>

      <label>NGO ID:</label>
      <input type="text" name="ngoID" value={formData.ngoID} onChange={handleInputChange} required />

      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

      <label>About Us (Past Projects, Est. Date, Mission, Aim):</label>
      <textarea name="aboutUs" value={formData.aboutUs} onChange={handleInputChange} required />

      <label>License No:</label>
      <input type="text" name="licenseNo" value={formData.licenseNo} onChange={handleInputChange} required />

      <h3>Contact Info</h3>
      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />

      <label>Phone:</label>
      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />

      <h3>Payment Info</h3>
      <label>Cash (Physical Address):</label>
      <input type="text" name="cash" value={formData.paymentInfo.cash} onChange={handlePaymentInfoChange} />

      <label>Mobile Payment (Mobile Number):</label>
      <input type="text" name="mobilePayment" value={formData.paymentInfo.mobilePayment} onChange={handlePaymentInfoChange} />

      <h4>Wire Transfer Info</h4>
      <label>Account Number:</label>
      <input type="text" name="accountNumber" value={formData.paymentInfo.wireTransfer.accountNumber} onChange={handleWireTransferChange} />

      <label>Branch Name:</label>
      <input type="text" name="branchName" value={formData.paymentInfo.wireTransfer.branchName} onChange={handleWireTransferChange} />

      <label>Bank Name:</label>
      <input type="text" name="bankName" value={formData.paymentInfo.wireTransfer.bankName} onChange={handleWireTransferChange} />

      <h3>Login Credentials</h3>
      <label>Username (Email):</label>
      <input type="email" name="username" value={formData.username} onChange={handleInputChange} required />

      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />

      <button type="submit">Register NGO</button>
    </form>
  );
};

export default RegisterNGO;
