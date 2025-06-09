// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, updateUser, getCurrentUserProfile } from '../api/users'; // <--- ADD getCurrentUserProfile

function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        let userData;
        if (id) {
          // If there's an ID in the URL, fetch that specific user (for admin viewing other users)
          userData = await getUserById(id);
        } else {
          // If no ID, fetch the current logged-in user's profile
          userData = await getCurrentUserProfile(); // <--- CALL NEW FUNCTION HERE
        }
        setUser(userData);
        setFormData(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]); // Re-fetch if ID changes (important for both scenarios)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      // Use the ID from params if available, otherwise use the _id from the fetched user data
      const userIdToUpdate = id || user._id;
      await updateUser(userIdToUpdate, formData);
      setUser(formData); // Update local state with new data
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading profile...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  if (!user) return <div style={{ padding: '20px' }}>User not found.</div>; // Could also be "No user data available"

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
            <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Age:</label>
            <input type="number" name="age" value={formData.age || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Preferences (JSON):</label>
            <textarea
              name="preferences"
              value={JSON.stringify(formData.preferences || {}, null, 2)}
              onChange={(e) => {
                try {
                  setFormData({ ...formData, preferences: JSON.parse(e.target.value) });
                } catch (parseError) {
                  console.error('Invalid JSON for preferences:', parseError);
                  // Optionally, set an error state here to inform the user
                }
              }}
              rows="5"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            ></textarea>
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