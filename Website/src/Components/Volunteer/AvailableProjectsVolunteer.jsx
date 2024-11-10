import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Firestore } from 'firebase/firestore';

const AvailableProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const snapshot = await Firestore.collection('projects').get();
            const projectsList = snapshot.docs.map(doc => doc.data());
            setProjects(projectsList);
        };

        fetchProjects();
    }, []);

    return (
        <Row className="mt-3">
            {projects.length === 0 ? (
                <p>No available projects.</p>
            ) : (
                projects.map((project, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{project.title}</Card.Title>
                                <Card.Text>{project.description}</Card.Text>
                                <Button variant="success">Enroll</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            )}
        </Row>
    );
};

export default AvailableProjects;
