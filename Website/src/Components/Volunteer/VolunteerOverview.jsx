import React from 'react';
import { FaBirthdayCake } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { Card, Image } from 'react-bootstrap';

const VolunteerOverview = ({ volunteerData }) => {
    return (
        <Card className="text-center">
            <Card.Body>
                {/* Display Volunteer Image */}
                <Image
                    src={volunteerData.photoURL || "default-profile-image.jpg"} // Replace with a default image if none is uploaded
                    roundedCircle
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />

                {/* Display Volunteer Details */}
                <Card.Title>{volunteerData.name || "Volunteer Name"}</Card.Title>
                <Card.Text>
                    {volunteerData.gender || "X"} <FaBirthdayCake /> {volunteerData.dob || "X"}
                </Card.Text>
                <Card.Text>
                    {volunteerData.email && <a href={`mailto:${volunteerData.email}`}><MdEmail />{volunteerData.email}</a>}
                </Card.Text>
                <Card.Text>
                    <MdLocationOn /> {volunteerData.area || "Global"}
                </Card.Text>
                <Card.Text>
                    <strong>Skills:</strong> {volunteerData.skills || "No skills listed"}
                </Card.Text>

            </Card.Body>
        </Card>
    );
};

export default VolunteerOverview;
