import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

const RegisterNGO = ({ setUserRole }) => {
  const [photo, setPhoto] = useState(null);
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
      },
    },
    username: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [useSameNumberForPayment, setUseSameNumberForPayment] = useState(false);
  const [useSameEmailForUsername, setUseSameEmailForUsername] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone' && useSameNumberForPayment) {
      setFormData({
        ...formData,
        phone: value,
        paymentInfo: {
          ...formData.paymentInfo,
          mobilePayment: value,
        },
      });
    }
    else if (name === 'email' && useSameEmailForUsername) {
      setFormData({
        ...formData,
        email: value,
        username: value,
      });
    }
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      paymentInfo: {
        ...prevData.paymentInfo,
        [name]: value,
      },
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
          [name]: value,
        },
      },
    }));
  };

  const handleCheckboxChange = () => {
    const newUseSameNumberForPayment = !useSameNumberForPayment;
    setUseSameNumberForPayment(newUseSameNumberForPayment);

    if (!newUseSameNumberForPayment) {
      setFormData((prevData) => ({
        ...prevData,
        paymentInfo: {
          ...prevData.paymentInfo,
          mobilePayment: '',
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        paymentInfo: {
          ...prevData.paymentInfo,
          mobilePayment: prevData.phone,
        },
      }));
    }
  };

  const handleUsernameCheckboxChange = () => {
    const newUseSameEmailForUsername = !useSameEmailForUsername;
    setUseSameEmailForUsername(newUseSameEmailForUsername);
    if (!newUseSameEmailForUsername) {
      setFormData((prevData) => ({
        ...prevData,
        username: '',
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        username: prevData.email,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|iut-dhaka\.edu)$/;
    if (!emailRegex.test(formData.email)) {
      alert("Invalid email address");
      return;
    }

    const passwordRegex = /^(?!.*(\d)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      alert("Password does not meet criteria: at least 8 characters, includes one lowercase letter, one uppercase letter, one digit, one special character, and no consecutive identical digits.");
      return;
    }


    const phoneRegex = /^(013|014|015|016|017|018|019)\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Invalid phone number");
      return;
    }


    if (
      !useSameNumberForPayment &&
      (!formData.paymentInfo.mobilePayment || !phoneRegex.test(formData.paymentInfo.mobilePayment))
    ) {
      alert("Invalid mobile payment number");
      return;
    }

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!photo) {
      alert("Submit a picture of your license");
      return;
    }

    let photoURL;

    if (photo) {
      const formData = new FormData();
      formData.append('image', photo);
      console.log(photo)

      try {
        const response = await axios.post('http://localhost:3000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoURL = response.data.url;
      } catch (error) {
        console.error('Error uploading the image:', error);
        alert("Error uploading the image");
        return;
      }
    }

    try {
      setUserRole("ngo");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.username,
        formData.password
      );
      const user = userCredential.user;

      await addDoc(collection(db, "NGOs"), {
        name: formData.name,
        aboutUs: formData.aboutUs,
        licenseNo: formData.licenseNo,
        contactInfo: {
          email: formData.email,
          phone: formData.phone,
        },
        paymentInfo: formData.paymentInfo,
        userId: user.uid,
        role: "NGO",
        verified_status: false,
        photoURL
      });

      alert("NGO registration complete!");
    } catch (error) {
      setUserRole(null);
      console.error("Error registering NGO:", error);
      alert("Error registering NGO, please try again.");
    }
  };

  const isPasswordValid =
      /^(?!.*(\d)\1)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password);


  const isPasswordMatching =
    formData.password && confirmPassword === formData.password;

  const isMobilePaymentValid =
    !useSameNumberForPayment &&
    formData.paymentInfo.mobilePayment &&
    /^(013|014|015|016|017|018|019)\d{8}$/.test(formData.paymentInfo.mobilePayment);

  const isUserNameValid =
    !useSameEmailForUsername &&
    formData.username &&
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|iut-dhaka\.edu)$/.test(formData.username);


  return (
    <Container className="mt-4" style={{ paddingBottom: '50px' }}>
      <h1 className="text-center mb-4" style={{ color: '#211940' }}>NGO Registration</h1>
      <Form onSubmit={handleSubmit} className="border p-4 rounded-shadow-sm" style={{ backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '15px' }}>
        {/* <h2 className="mb-4 text-center" style={{color: '#211940'}}>Register Your NGO</h2> */}

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

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formLicenseImage">
            <Form.Label>License Image</Form.Label>
            <Form.Control
              type="file"
              name="licenseImage"
              onChange={e => setPhoto(e.target.files[0])}
              required
            />
          </Form.Group>
        </Row>

        <h3>Contact Info</h3>
        <Row className="mb-3">
          <Form.Group as={Col} sm={12} md={6} controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                borderColor:
                  !formData.email
                    ? '#ced4da'
                    : /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|iut-dhaka\.edu)$/.test(formData.email)
                      ? 'green'
                      : 'red',
              }}
            />
            {formData.email &&
              !/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|iut-dhaka\.edu)$/.test(formData.email) && (
                <Form.Text style={{ color: 'red' }}>
                  Invalid Email
                </Form.Text>
              )}
          </Form.Group>

          <Form.Group as={Col} sm={12} md={6} controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={{
                borderColor:
                  !formData.phone
                    ? '#ced4da'
                    : /^(013|014|015|016|017|018|019)\d{8}$/.test(formData.phone)
                      ? 'green'
                      : 'red',
              }}
            />
            {formData.phone &&
              !/^(013|014|015|016|017|018|019)\d{8}$/.test(formData.phone) && (
                <Form.Text style={{ color: 'red' }}>
                  Invalid phone number
                </Form.Text>
              )}
          </Form.Group>
        </Row>

        <h3>Payment Info</h3>
        <Row className="mb-3">
          <Form.Group as={Col} sm={12} md={6} controlId="formCash">
            <Form.Label>Cash (Physical Address)</Form.Label>
            <Form.Control
              type="text"
              name="cash"
              value={formData.paymentInfo.cash}
              onChange={handlePaymentInfoChange}
            />
          </Form.Group>

          <Form.Group as={Col} sm={12} md={6} controlId="formMobilePayment">
            <Form.Label>Mobile Payment (Mobile Number)</Form.Label>
            <Form.Control
              type="text"
              name="mobilePayment"
              value={formData.paymentInfo.mobilePayment}
              onChange={handlePaymentInfoChange}
              disabled={useSameNumberForPayment}
              style={{
                borderColor:
                  !formData.paymentInfo.mobilePayment || useSameNumberForPayment
                    ? '#ced4da'
                    : isMobilePaymentValid
                      ? 'green'
                      : 'red',
              }}
            />
            <Form.Check
              type="checkbox"
              label="Use same number for payment"
              checked={useSameNumberForPayment}
              onChange={handleCheckboxChange}
            />

            {formData.paymentInfo.mobilePayment &&
              !/^(013|014|015|016|017|018|019)\d{8}$/.test(formData.paymentInfo.mobilePayment) && (
                <Form.Text style={{ color: 'red' }}>
                  Invalid phone number
                </Form.Text>
              )}
          </Form.Group>
        </Row>

        <h4>Bank Transfer Info</h4>
        <Row className="mb-3">
          <Form.Group as={Col} sm={12} md={4} controlId="formBankName">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              type="text"
              name="bankName"
              value={formData.paymentInfo.wireTransfer.bankName}
              onChange={handleWireTransferChange}
            />
          </Form.Group>

          <Form.Group as={Col} sm={12} md={4} controlId="formBranchName">
            <Form.Label>Branch Name</Form.Label>
            <Form.Control
              type="text"
              name="branchName"
              value={formData.paymentInfo.wireTransfer.branchName}
              onChange={handleWireTransferChange}
            />
          </Form.Group>

          <Form.Group as={Col} sm={12} md={4} controlId="formAccountNumber">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              name="accountNumber"
              value={formData.paymentInfo.wireTransfer.accountNumber}
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
              disabled={useSameEmailForUsername}
              style={{
                borderColor:
                  !formData.username || useSameEmailForUsername
                    ? '#ced4da'
                    : isUserNameValid
                      ? 'green'
                      : 'red',
              }}
            />
            <Form.Check
              type="checkbox"
              label="Use same email as username"
              checked={useSameEmailForUsername}
              onChange={handleUsernameCheckboxChange}
            />
            {formData.username &&
              !/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|iut-dhaka\.edu)$/.test(formData.username) && (
                <Form.Text style={{ color: 'red' }}>
                  Invalid Email
                </Form.Text>
              )}
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} sm={12} md={6} controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                borderColor: !formData.password
                  ? '#ced4da'
                  : isPasswordValid
                    ? 'green'
                    : 'red',
              }}
            />
            {formData.password && !isPasswordValid &&(<Form.Text
              style={{
                color: 'red'
              }}
            >
              Invalid password
            </Form.Text>
            )}
          </Form.Group>
              


          <Form.Group as={Col} sm={12} md={6} controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={!formData.password}
              style={{
                borderColor: !formData.password
                  ? '#ced4da'
                  : isPasswordMatching
                    ? 'green'
                    : 'red',
              }}
            />
            {formData.password && !isPasswordMatching && (<Form.Text
              style={{
                color: 'red'
              }}
            >
              Password does not match
            </Form.Text>
            )}
          </Form.Group>
        </Row>
        <Row className='text-center mb-2'
        style={{color: 'grey'}}>
          *Password must contain atleast 8 characters including one uppercase letter, one lowercase letter, one special character, one number and no consecutive same number
        </Row>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mt-1 mb-4"
          style={{ backgroundColor: 'var(--blue)', color: 'white' }}
        >
          Register NGO
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterNGO;
