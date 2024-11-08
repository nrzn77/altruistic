import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Firestore } from 'firebase/firestore';

const MyProjects = () => {
    const [myProjects, setMyProjects] = useState([]);

    useEffect(() => {
        const fetchMyProjects = async () => {
            const volunteerId = 'volunteer-id'; // Use dynamic volunteer ID
            const snapshot = await Firestore
                .collection('projects')
                .where('volunteers', 'array-contains', volunteerId)
                .get();

            const projectsList = snapshot.docs.map(doc => doc.data());
            setMyProjects(projectsList);
        };

        fetchMyProjects();
    }, []);

    return (
        <Row className="mt-3">
            {myProjects.length === 0 ? (
                <p>You are not enrolled in any projects.</p>
            ) : (
                myProjects.map((project, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{project.title}</Card.Title>
                                <Card.Text>{project.description}</Card.Text>
                                <Card.Text>Progress: {project.progress}%</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            )}
        </Row>
    );
};

export default MyProjects;
