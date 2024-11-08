import React from 'react';
import { Card, Image } from 'react-bootstrap';

const VolunteerOverview = ({ volunteerData }) => {
    return (
        <Card className="text-center">
            <Card.Body>
                {/* Display Volunteer Image */}
                <Image
                    src={volunteerData.imageURL || "default-profile-image.jpg"} // Replace with a default image if none is uploaded
                    roundedCircle
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />

                {/* Display Volunteer Details */}
                <Card.Title>{volunteerData.name || "Volunteer Name"}</Card.Title>
                <Card.Text>
                    <strong>Skills:</strong> {volunteerData.skills || "No skills listed"}
                </Card.Text>
                <Card.Text>
                    <strong>Experience:</strong> {volunteerData.experience || "No experience listed"}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default VolunteerOverview;
