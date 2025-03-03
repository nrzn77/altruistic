import React, { useState } from 'react';
import { auth } from '../../firebase-config';
import { Form, Button, Card } from 'react-bootstrap';

const VolunteerProfile = ({volunteerData, updateProfile}) => {
    const [name, setName] = useState(volunteerData.name);
    const [area, setArea] = useState(volunteerData.area || '');  // Ensure it's never undefined or null
    const [skills, setSkills] = useState(volunteerData.skills);

    const handleSubmit = async (e) => {
        e.preventDefault();
        updateProfile(auth.currentUser.uid, name, area, skills);
    };

    return (
        <Card style={{border:'none'}}>
            <Card.Body>
                <Card.Title className='text-center'>Edit Your Volunteer Profile</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="area">
                        <Form.Label>Area</Form.Label>
                        <Form.Control
                            as="select"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required
                        >
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chattogram">Chittagong</option>
                            <option value="Khulna">Khulna</option>
                            <option value="Rajshahi">Rajshahi</option>
                            <option value="Barishal">Barisal</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rangpur">Rangpur</option>
                            <option value="Mymensingh">Mymensingh</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="skills">
                        <Form.Label>Skills</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter your skills"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" type="submit" className='mt-3'>
                            Save Profile
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default VolunteerProfile;
