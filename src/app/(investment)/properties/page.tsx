"use client";
import Link from 'next/link';
import React, { useState } from 'react';

interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  type: string;
  status: string;
  area: string;
  image: string;
  investmentReturn: string;
}

const BuyProperty = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filter, setFilter] = useState('all');

  const properties: Property[] = [
    {
      id: 1,
      name: "LA Fitness Rock Hill",
      location: "Rock Hill, SC",
      price: 750000,
      type: "Retail Fitness Center",
      status: "Under Management",
      area: "38,000 Square Footage",
      image: "/lafit.webp",
      investmentReturn: "$10,624 / month"
    },
    {
      id: 2,
      name: "LA Fitness Columbus",
      location: "Brooklyn, NY",
      price: 950000,
      type: "Retail Fitness Center",
      status: "1bed, 1bath",
      area: "45,000 Square Footage",
      image: "/colum.webp",
      investmentReturn: "$11,400 / month"
    },
    {
      id: 3,
      name: "Condo For Sale",
      location: "1000 West Ave APT808, Miami Beach, FL 33139",
      price: 405000,
      type: "condo",
      status: "Now Available",
      area: "852 sqft",
      image: "/maimi.webp",
      investmentReturn: "$3,340 / month (est.)"
    },
    {
      id: 4,
      name: "The Metcalf",
      location: "2247 Metcalf Way, Southaven, MS 38672",
      price: 364160,
      type: "house",
      status: "Now Available",
      area: "2009 Sqft",
      image: "/mat.webp",
      investmentReturn: "$3,000 / month (est.)"
    },
    {
      id: 5,
      name: "The Fortress",
      location: "2247 Metcalf Way, Southaven, MS 38672",
      price: 433850,
      type: "house",
      status: "Now Available",
      area: "2223 Sqft",
      image: "/fortress.webp",
      investmentReturn: "$3,500 / month (est.)"
    },
    {
      id: 6,
      name: "The Wendover",
      location: "517 Windsong Drive, Rincon, GA 31326",
      price: 440860,
      type: "house",
      status: "Now Available",
      area: "3261 Sqft",
      image: "/wendove.webp",
      investmentReturn: "$3,660 / month (est.)"
    },
    {
      id: 7,
      name: "The Galleta",
      location: "3402 Saddlebred Drive, Gastonia, NC 28052",
      price: 120570,
      type: "house",
      status: "Now Available",
      area: "1800 Sqft",
      image: "/galleta.webp",
      investmentReturn: "$1,000 / month (est.)"
    },
    {
      id: 8,
      name: "The Blair",
      location: "1425 Willow Springs Drive, Johnson City, TN 37604",
      price: 330720,
      type: "house",
      status: "Now Available",
      area: "1900 Sqft",
      image: "/blair.webp",
      investmentReturn: "$2,660 / month (est.)"
    },
    {
      id: 9,
      name: "The Arbolado",
      location: "3747 Greg Avenue Southwest, Albuquerque, NM 87121",
      price: 400240,
      type: "apartment",
      status: "Now Available",
      area: "1809 Sqft",
      image: "/arba.webp",
      investmentReturn: "$3,160 / month (est.)"
    },
    {
      id: 10,
      name: "The Fizzy",
      location: "31019 Tomahawk Terrace, Johnson City, TN 37604",
      price: 433050,
      type: "apartment",
      status: "Now Available",
      area: "1991 Sqft",
      image: "/flizzy.webp",
      investmentReturn: "$3,500 / month (est.)"
    },
  ];

  const filteredProperties = filter === 'all'
    ? properties
    : properties.filter(prop => prop.type === filter);

  const handleInquiry = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="investment-page">
      <h1>Invest In Properties</h1>
      <p className="page-description">
        Browse our curated selection of investment properties with high return potential.
      </p>

      <div className="filters">
        {['all', 'house', 'condo', 'apartment', 'Retail Fitness Center'].map((cat) => (
          <button
            key={cat}
            className={filter === cat ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'All Properties' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="properties-grid">
        {filteredProperties.map(property => (
          <div key={property.id} className="property-card">
            <div className="property-image">
              <img src={property.image} alt={property.name} />
              <div className="property-type">{property.type}</div>
            </div>
            <div className="property-details">
              <h3>{property.name}</h3>
              <p className="property-location">{property.location}</p>
              <div className="property-features">
                <span><h3>Status:</h3> {property.status}</span>
                <span><h3>Area:</h3> {property.area}</span>
                <span><h3>Type:</h3> {property.type}</span>
              </div>
              <div className="property-financials">
                <div className="property-price">
                  ${property.price.toLocaleString()}
                </div>
                <div className="property-return">
                  Expected Return: {property.investmentReturn}
                </div>
              </div>
              <button
                className="inquiry-btn"
                onClick={() => handleInquiry(property)}
              >
                Make Inquiry
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProperty && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Property Inquiry</h2>
            <p>You're interested in: <strong>{selectedProperty.name}</strong></p>
            <div className="modal-actions">
              <button onClick={() => setSelectedProperty(null)}>Cancel</button>
              <Link href={"https://wa.me/+14642607739"} target="_blank">
                <button className="primary">Contact Agent</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyProperty;
