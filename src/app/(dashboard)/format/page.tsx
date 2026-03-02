'use client';

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { LuBrain } from "react-icons/lu";
import { useAuth } from '@clerk/nextjs';

interface Format {
  _id: string;
  clerkId: string;
  title: string;
  description: string;
  form_id: string;
  approved: boolean;
  type: 'first' | 'second' | 'third'; // Added 'third' type
  createdAt?: Date;
  updatedAt?: Date;
}

const Page = () => {
  const { userId } = useAuth();
  const [formats, setFormats] = useState<Format[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<{ 
    first: { title: string; description: string; _id?: string };
    second: { title: string; description: string; _id?: string };
    third: { title: string; description: string; _id?: string }; // Added third format
  }>({
    first: { title: '', description: '', _id: '' },
    second: { title: '', description: '', _id: '' },
    third: { title: '', description: '', _id: '' } // Added third format
  });

  useEffect(() => {
    if (userId) {
      fetchFormats();
    }
  }, [userId]);

  const fetchFormats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/formats');
      
      if (response.ok) {
        const data = await response.json();
        setFormats(data.formats || []);
        
        // Initialize form data with current values from database
        const firstFormat = data.formats?.find((format: Format) => format.type === 'first');
        const secondFormat = data.formats?.find((format: Format) => format.type === 'second');
        const thirdFormat = data.formats?.find((format: Format) => format.type === 'third'); // Added third format
        
        setFormData({
          first: {
            title: firstFormat?.title || '',
            description: firstFormat?.description || '',
            _id: firstFormat?._id || ''
          },
          second: {
            title: secondFormat?.title || '',
            description: secondFormat?.description || '',
            _id: secondFormat?._id || ''
          },
          third: { // Added third format
            title: thirdFormat?.title || '',
            description: thirdFormat?.description || '',
            _id: thirdFormat?._id || ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching formats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (formatType: 'first' | 'second' | 'third', field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      [formatType]: {
        ...prev[formatType],
        [field]: value
      }
    }));
  };

  const updateFormat = async (formatType: 'first' | 'second' | 'third') => {
    if (!userId) return;
    
    try {
      setUpdating(prev => ({ ...prev, [formatType]: true }));
      
      const data = formData[formatType];
      const response = await fetch('/api/formats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: data._id,
          title: data.title,
          description: data.description,
          type: formatType
        }),
      });

      if (response.ok) {
        alert('Format updated successfully!');
        fetchFormats(); // Refresh data to get updated values
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating format:', error);
      alert('Failed to update format');
    } finally {
      setUpdating(prev => ({ ...prev, [formatType]: false }));
    }
  };

  if (loading) {
    return (
      <div className='dashboard'>
        <div className="transfer_p">
          <div className="transfer_p-top">
            <Link className='flex items-center gap-2' href={'/dashboard'}>
              <FaArrowLeftLong />
              <p>Back to Dashboard</p>
            </Link>
            <h1>Billing Format</h1>
          </div>
          <div className="transfer_p-container">
            <p>Loading formats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard'>
      <div className="transfer_p">
        <div className="transfer_p-top">
          <Link className='flex items-center gap-2' href={'/dashboard'}>
            <FaArrowLeftLong />
            <p>Back to Dashboard</p>
          </Link>
          <h1>Billing Format</h1>
        </div>
        <div className="transfer_p-container">
          <div className='flex items-center gap-1.5'> 
            <LuBrain className='text-3xl' /> 
            <h1>Logistics</h1>
          </div>

          {/* First Format */}
          <div className="transfer_p-content">
            <div className="recipient">
              <span className='flex items-center gap-1.5'>
                <FiUser /> 
                <h2>First Format</h2>
              </span>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Title *</h3>
                  <input 
                    type="text" 
                    placeholder='Format title...' 
                    value={formData.second.title}
                    onChange={(e) => handleInputChange('second', 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Description *</h3>
                  <textarea 
                    placeholder='Format Description...' 
                    value={formData.second.description}
                    onChange={(e) => handleInputChange('second', 'description', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={() => updateFormat('second')}
              disabled={updating.second || !formData.second.title || !formData.second.description}
              className={`px-4 py-2 rounded-md ${
                updating.second || !formData.second.title || !formData.second.description
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {updating.second ? 'Updating...' : 'Update Second Format'}
            </button>
          </div>

          {/* Second Format */}
          <div className="transfer_p-content transfer_p-content2">
            <div className="recipient">
              <span className='flex items-center gap-1.5'>
                <FiUser /> 
                <h2>Secon Format</h2>
              </span>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Title *</h3>
                  <input 
                    type="text" 
                    placeholder='Format title...' 
                    value={formData.first.title}
                    onChange={(e) => handleInputChange('first', 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Description *</h3>
                  <textarea 
                    placeholder='Format Description...' 
                    value={formData.first.description}
                    onChange={(e) => handleInputChange('first', 'description', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={() => updateFormat('first')}
              disabled={updating.first || !formData.first.title || !formData.first.description}
              className={`px-4 py-2 rounded-md ${
                updating.first || !formData.first.title || !formData.first.description
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {updating.first ? 'Updating...' : 'Update First Format'}
            </button>
          </div>

          {/* Third Format - Added this section */}
          <div className="transfer_p-content transfer_p-content3">
            <div className="recipient">
              <span className='flex items-center gap-1.5'>
                <FiUser /> 
                <h2>Third Format</h2>
              </span>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Title *</h3>
                  <input 
                    type="text" 
                    placeholder='Format title...' 
                    value={formData.third.title}
                    onChange={(e) => handleInputChange('third', 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Description *</h3>
                  <textarea 
                    placeholder='Format Description...' 
                    value={formData.third.description}
                    onChange={(e) => handleInputChange('third', 'description', e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <button 
              onClick={() => updateFormat('third')}
              disabled={updating.third || !formData.third.title || !formData.third.description}
              className={`px-4 py-2 rounded-md ${
                updating.third || !formData.third.title || !formData.third.description
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {updating.third ? 'Updating...' : 'Update Third Format'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;