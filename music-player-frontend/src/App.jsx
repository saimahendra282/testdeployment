import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [name, setName] = useState('');
    const [pic, setPic] = useState(null);
    const [audio, setAudio] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [music, setMusic] = useState(null);
    const [musicList, setMusicList] = useState([]); // New state for music list

    // Handle form submission to upload the music
   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !pic || !audio) {
        alert('Please fill all fields and upload files.');
        return;
    }

    const picBase64 = await toBase64(pic); // Convert image file to base64
    const audioBase64 = await toBase64(audio); // Convert audio file to base64

    const musicData = {
        name,
        pic: picBase64,
        audio: audioBase64,
    };

    setLoading(true);
    setError(null);

    try {
        const res = await axios.post('http://localhost:5000/upload', musicData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Uploaded:', res.data);
        setMusic(res.data.music);
    } catch (err) {
        console.error('Error uploading files:', err);
        setError('Error uploading files. Please try again.');
    } finally {
        setLoading(false);
    }
};

// Helper function to convert a file to base64
const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

    // Handle music list retrieval
    const handleRetrieveMusic = async () => {
        try {
            const res = await axios.get('http://localhost:5000/music'); // Fetch all music metadata
            setMusicList(res.data); // Update music list
        } catch (err) {
            console.error('Error retrieving music list:', err);
            alert('Error retrieving music list.');
        }
    };

    // Play the audio using the provided audio URL
    const handlePlayAudio = (audioUrl) => {
        const audioElement = new Audio(audioUrl);
        audioElement.play(); // Play audio
    };

    return (
        <div className="App">
            <h1>Upload Music</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPic(e.target.files[0])}
                    required
                />
                <input
                    type="file"
                    accept="audio/mpeg"
                    onChange={(e) => setAudio(e.target.files[0])}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {music && (
                <div>
                    <h3>Uploaded Music: {music.name}</h3>
                    <img src={music.picUrl} alt={music.name} width={100} />
                    <button onClick={() => handlePlayAudio(music.audioUrl)}>Play Audio</button>
                </div>
            )}

            <button onClick={handleRetrieveMusic}>Show Music List</button>

            {musicList.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {musicList.map((musicItem) => (
                            <tr key={musicItem._id}>
                                <td>{musicItem.name}</td>
                                <td>
                                    <img src={musicItem.picUrl} alt={musicItem.name} width={50} />
                                </td>
                                <td>
                                    <button onClick={() => handlePlayAudio(musicItem.audioUrl)}>
                                        Play Audio
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;
