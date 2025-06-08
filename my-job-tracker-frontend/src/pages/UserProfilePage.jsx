// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../api/users'; // API functions

function UserProfilePage() {
  const { id } = useParams(); // Could be current user's ID or an admin viewing another user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // If no ID is in params, assume it's the logged-in user's profile
        // In a real app, you'd fetch current user from auth context or specific endpoint
        const userIdToFetch = id || 'current_user_placeholder_id'; // Replace with actual current user ID logic
        const data = await getUserById(userIdToFetch);
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]); // Re-fetch if ID changes (for admin viewing different users)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const userIdToUpdate = id || user._id; // Use param ID or fetched user ID
      await updateUser(userIdToUpdate, formData);
      setUser(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading profile...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  if (!user) return <div style={{ padding: '20px' }}>User not found.</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>User Profile</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
        <button onClick={() => setIsEditing(!isEditing)} style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form>
          <div style={{ marginBottom: '10px' }}>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Age:</label>
            <input type="number" name="age" value={formData.age} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Preferences (JSON):</label>
            <textarea name="preferences" value={JSON.stringify(formData.preferences || {}, null, 2)} onChange={(e) => setFormData({ ...formData, preferences: JSON.parse(e.target.value) })} rows="5" style={{ width: '100%', padding: '8px', marginTop: '5px' }}></textarea>
          </div>
          <button type="button" onClick={handleUpdate} style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Preferences:</strong> {JSON.stringify(user.preferences || {}, null, 2)}</p>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;