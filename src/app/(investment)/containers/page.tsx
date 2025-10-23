"use client";
import Link from 'next/link';
import React, { useState } from 'react';

interface Property {
  id: number;
  name: string;
  price: number;
  type: string;
  area: string;
  image: string;
  investmentReturn: string;
}

const Containers = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filter, setFilter] = useState('all');

  const properties: Property[] = [
    {
      id: 1,
      name: "Standard 20ft container",
      price: 2710,
      type: "20ft Container",
      area: "Length x Width x Height in mm.",
      image: "/20ft-standard-container-Trident.jpg",
      investmentReturn: "$90-225/month"
    },
    {
      id: 2,
      name: "Standard 40ft container",
      price: 4800,
      type: "40ft Container",
      area: "Length x Width x Height in mm.",
      image: "/pexels-photo-1117210.jpeg",
      investmentReturn: "$160-400/month"
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
      <h1>Invest In Containers</h1>
      <p className="page-description">
        Browse our curated selection of investment containers with high return potential.
      </p>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >
          All Properties
        </button>
        <button 
          className={filter === '20ft Container' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('20ft Container')}
        >
          20ft Container
        </button>
        <button 
          className={filter === '40ft Container' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('40ft Container')}
        >
          40ft Container
        </button>
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
              <div className="property-features">
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

export default Containers;