import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function VolunteerCard({ volunteer }) {
    return (
        <Card className="my-3">
            <Row className="g-0">
                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
                    <Card.Img
                        src={volunteer.photoURL ? volunteer.photoURL : "/images/ProfileiconD.jpg"}
                        alt="Profile image"
                        className="rounded-circle"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                </Col>
                <Col xs={12} md={8}
                    className="d-flex flex-column justify-content-center text-center text-md-start">
                    <Card.Body>
                        <Card.Title>{volunteer.name}</Card.Title>

                        <Card.Text><strong>Gender:</strong> {volunteer.gender}</Card.Text>
                        <Card.Text><strong>Skills:</strong> {volunteer.skills}</Card.Text>
                        <Card.Text><strong>Area:</strong> {volunteer.area}</Card.Text>
                        <Card.Text><strong>Email:</strong> <a href={`mailto:${volunteer.email}`}>{volunteer.email}</a></Card.Text>

                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
}

export default VolunteerCard;
