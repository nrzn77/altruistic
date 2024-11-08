import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const VolunteerProfile = () => {
    const [name, setName] = useState('');
    const [nid, setNid] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Logic to save volunteer profile (e.g., Firestore)
        alert('Profile saved');
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
                    <Form.Group controlId="nid">
                        <Form.Label>National ID</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your NID"
                            value={nid}
                            onChange={(e) => setNid(e.target.value)}
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
                    <Form.Group controlId="experience">
                        <Form.Label>Previous Experience</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Describe your previous volunteering experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
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
