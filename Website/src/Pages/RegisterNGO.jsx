// import React, { useState } from 'react';
// import { auth, db } from '../firebase-config'; 
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { collection, addDoc } from 'firebase/firestore';

// const RegisterNGO = () => {
//   const [formData, setFormData] = useState({
    
//     name: '',
//     aboutUs: '',
//     licenseNo: '',
//     email: '',
//     phone: '',
   
//     paymentInfo: {
//       cash: '',
//       mobilePayment: '',
//       wireTransfer: {
//         accountNumber: '',
//         branchName: '',
//         bankName: '',
//       }
//     },
//     username: '',
//     password: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handlePaymentInfoChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       paymentInfo: {
//         ...prevData.paymentInfo,
//         [name]: value
//       }
//     }));
//   };

//   const handleWireTransferChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       paymentInfo: {
//         ...prevData.paymentInfo,
//         wireTransfer: {
//           ...prevData.paymentInfo.wireTransfer,
//           [name]: value
//         }
//       }
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
     
//       const userCredential = await createUserWithEmailAndPassword(auth, formData.username, formData.password);
//       const user = userCredential.user;

      
//       await addDoc(collection(db, 'NGOs'), {
        
//         name: formData.name,
//         aboutUs: formData.aboutUs,
//         licenseNo: formData.licenseNo,
//         contactInfo: {
//           email: formData.email,
//           phone: formData.phone
//         },
//         paymentInfo: {
//           cash: formData.paymentInfo.cash,
//           mobilePayment: formData.paymentInfo.mobilePayment,
//           wireTransfer: {
//             accountNumber: formData.paymentInfo.wireTransfer.accountNumber,
//             branchName: formData.paymentInfo.wireTransfer.branchName,
//             bankName: formData.paymentInfo.wireTransfer.bankName,
//           }
//         },
//         userId: user.uid,
//         role: 'NGO'
//       });

//       alert('NGO registration complete!');
//     } catch (error) {
//       console.error('Error registering NGO:', error);
//       alert('Error registering NGO, please try again.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Register Your NGO</h2>

     

//       <label>Name:</label>
//       <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

//       <label>About Us (Past Projects, Est. Date, Mission, Aim):</label>
//       <textarea name="aboutUs" value={formData.aboutUs} onChange={handleInputChange} required />

//       <label>License No:</label>
//       <input type="text" name="licenseNo" value={formData.licenseNo} onChange={handleInputChange} required />

//       <h3>Contact Info</h3>
//       <label>Email:</label>
//       <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />

//       <label>Phone:</label>
//       <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />

//       <h3>Payment Info</h3>
//       <label>Cash (Physical Address):</label>
//       <input type="text" name="cash" value={formData.paymentInfo.cash} onChange={handlePaymentInfoChange} />

//       <label>Mobile Payment (Mobile Number):</label>
//       <input type="text" name="mobilePayment" value={formData.paymentInfo.mobilePayment} onChange={handlePaymentInfoChange} />

//       <h4>Wire Transfer Info</h4>
//       <label>Account Number:</label>
//       <input type="text" name="accountNumber" value={formData.paymentInfo.wireTransfer.accountNumber} onChange={handleWireTransferChange} />

//       <label>Branch Name:</label>
//       <input type="text" name="branchName" value={formData.paymentInfo.wireTransfer.branchName} onChange={handleWireTransferChange} />

//       <label>Bank Name:</label>
//       <input type="text" name="bankName" value={formData.paymentInfo.wireTransfer.bankName} onChange={handleWireTransferChange} />

//       <h3>Login Credentials</h3>
//       <label>Username (Email):</label>
//       <input type="email" name="username" value={formData.username} onChange={handleInputChange} required />

//       <label>Password:</label>
//       <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />

//       <button type="submit">Register NGO</button>
//     </form>
//   );
// };

// export default RegisterNGO;


import React, { useState } from 'react';
import { auth, db } from '../firebase-config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { setRole } from '../Components/role';

const RegisterNGO = () => {
  const [formData, setFormData] = useState({
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
      setRole('ngo')
      const userCredential = await createUserWithEmailAndPassword(auth, formData.username, formData.password);
      const user = userCredential.user;

      await addDoc(collection(db, 'NGOs'), {
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
        userId: user.uid,
        role: 'NGO'
      });

      alert('NGO registration complete!');
    } catch (error) {
      setRole(null)
      console.error('Error registering NGO:', error);
      alert('Error registering NGO, please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit}>
        <h2 className="mb-4">Register Your NGO</h2>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formAboutUs">
            <Form.Label>About Us (Past Projects, Est. Date, Mission, Aim)</Form.Label>
            <Form.Control
              as="textarea"
              name="aboutUs"
              value={formData.aboutUs}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formLicenseNo">
            <Form.Label>License No</Form.Label>
            <Form.Control
              type="text"
              name="licenseNo"
              value={formData.licenseNo}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Row>

        <h3>Contact Info</h3>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Row>

        <h3>Payment Info</h3>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formCash">
            <Form.Label>Cash (Physical Address)</Form.Label>
            <Form.Control
              type="text"
              name="cash"
              value={formData.paymentInfo.cash}
              onChange={handlePaymentInfoChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formMobilePayment">
            <Form.Label>Mobile Payment (Mobile Number)</Form.Label>
            <Form.Control
              type="text"
              name="mobilePayment"
              value={formData.paymentInfo.mobilePayment}
              onChange={handlePaymentInfoChange}
            />
          </Form.Group>
        </Row>

        <h4>Wire Transfer Info</h4>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formAccountNumber">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              name="accountNumber"
              value={formData.paymentInfo.wireTransfer.accountNumber}
              onChange={handleWireTransferChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formBranchName">
            <Form.Label>Branch Name</Form.Label>
            <Form.Control
              type="text"
              name="branchName"
              value={formData.paymentInfo.wireTransfer.branchName}
              onChange={handleWireTransferChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formBankName">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              type="text"
              name="bankName"
              value={formData.paymentInfo.wireTransfer.bankName}
              onChange={handleWireTransferChange}
            />
          </Form.Group>
        </Row>

        <h3>Login Credentials</h3>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formUsername">
            <Form.Label>Username (Email)</Form.Label>
            <Form.Control
              type="email"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: 'var(--blue)', color: 'white' }} >
          Register NGO
        </Button>
        <br />
        <br />
      </Form>
    </Container>
  );
};

export default RegisterNGO;





