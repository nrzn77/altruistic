import React, { useState } from 'react';
import { auth } from '../../firebase-config';
import { Form, Button, Card } from 'react-bootstrap';

const VolunteerProfile = ({volunteerData, updateProfile}) => {
    const [name, setName] = useState(volunteerData.name);
    const [area, setArea] = useState(volunteerData.area);
    const [skills, setSkills] = useState(volunteerData.skills);

    const handleSubmit = async (e) => {
        e.preventDefault();
        updateProfile(auth.currentUser.uid, name, area, skills)
    };

    return (
        <Card className="mt-3">
            <Card.Body>
                <Card.Title>Create Your Volunteer Profile</Card.Title>
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
                            type="text"
                            placeholder="Enter your area"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required
                        />
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
                    <Button variant="primary" type="submit">
                        Save Profile
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default VolunteerProfile;
