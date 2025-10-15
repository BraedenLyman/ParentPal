import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Image, Card, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from "@heroui/react";
import { ArrowLeftIcon, TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Navbar from "../../nav-bar/navbar";
import { auth } from "../../../firebase/firebaseAuth";
import axios from "axios";
import API_URL from "../../../config/api";
import { FiBell } from "react-icons/fi";
import "../settings/settings.css";
import "./photo-gallery.css";

export default function PhotoGallery() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [photos, setPhotos] = useState([]);
    const [accountId, setAccountId] = useState(null);
    const [babies, setBabies] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedBabyId, setSelectedBabyId] = useState("");
    const [caption, setCaption] = useState("");
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const idToken = await currentUser.getIdToken();
                const userResponse = await axios.post(
                    `${API_URL}/api/sign-in`,
                    { idToken },
                    { withCredentials: true }
                );

                const userId = userResponse.data.user.account_id;
                setAccountId(userId);

                // Fetch babies
                const babiesResponse = await axios.get(
                    `${API_URL}/api/babies/${userId}`,
                    { withCredentials: true }
                );
                setBabies(babiesResponse.data);

                if (babiesResponse.data.length > 0) {
                    setSelectedBabyId(babiesResponse.data[0].baby_id);
                }

                // Fetch all photos for this parent
                const photosResponse = await axios.get(
                    `${API_URL}/api/photo-gallery/parent/${userId}`,
                    { withCredentials: true }
                );
                setPhotos(photosResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedBabyId) {
            alert("Please select a photo and baby");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);
            formData.append('baby_id', selectedBabyId);
            formData.append('parent_id', accountId);
            formData.append('caption', caption);

            await axios.post(
                `${API_URL}/api/photo-gallery/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                }
            );

            // Refresh photos
            const photosResponse = await axios.get(
                `${API_URL}/api/photo-gallery/parent/${accountId}`,
                { withCredentials: true }
            );
            setPhotos(photosResponse.data);

            // Reset form
            setSelectedFile(null);
            setPreviewUrl(null);
            setCaption("");
            setIsUploadModalOpen(false);
        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };

    const openDeleteModal = (photo) => {
        setPhotoToDelete(photo);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!photoToDelete) return;

        setDeleting(true);
        try {
            await axios.delete(
                `${API_URL}/api/photo-gallery/${photoToDelete.photo_id}`,
                { withCredentials: true }
            );

            // Refresh photos
            const photosResponse = await axios.get(
                `${API_URL}/api/photo-gallery/parent/${accountId}`,
                { withCredentials: true }
            );
            setPhotos(photosResponse.data);
            setIsDeleteModalOpen(false);
            setPhotoToDelete(null);
        } catch (error) {
            console.error("Error deleting photo:", error);
            alert("Failed to delete photo");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="header">
                <div className="headerContainer">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => navigate("/parent-dashboard")}
                        className="back-button-header"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Button>
                    <Image
                        alt="Parent Pal Logo"
                        src="/images/ParentPal.png"
                        width={80}
                        className="logo"
                    />
                    <FiBell className="notification" />
                </div>
                <div className="headerTitle">
                    <h1>Photo Gallery</h1>
                </div>
            </div>

            <div className="photo-gallery-content">
                <Button
                    color="primary"
                    onPress={() => setIsUploadModalOpen(true)}
                    className="upload-photo-button"
                    startContent={<PhotoIcon className="w-5 h-5" />}
                >
                    Upload Photo
                </Button>

                {loading ? (
                    <p>Loading photos...</p>
                ) : photos.length === 0 ? (
                    <div className="no-photos-message">
                        <PhotoIcon className="w-16 h-16" style={{ margin: '0 auto', color: '#999' }} />
                        <p>No photos yet. Start building memories!</p>
                    </div>
                ) : (
                    <div className="photos-grid">
                        {photos.map((photo) => (
                            <Card
                                key={photo.photo_id}
                                shadow="sm"
                                className="photo-card"
                            >
                                <div className="photo-card-image">
                                    <img
                                        src={`${API_URL}${photo.photo_url}`}
                                        alt={photo.caption || "Baby photo"}
                                    />
                                    <Button
                                        isIconOnly
                                        variant="flat"
                                        size="sm"
                                        color="danger"
                                        onPress={() => openDeleteModal(photo)}
                                        className="delete-photo-btn"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="photo-card-details">
                                    <div className="photo-info">
                                        <span className="photo-baby-name">
                                            {photo.first_name} {photo.last_name}
                                        </span>
                                        <span className="photo-date">
                                            {new Date(photo.uploaded_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {photo.caption && (
                                        <p className="photo-caption">{photo.caption}</p>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <Modal isOpen={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} className="settings-modal">
                <ModalContent>
                    <ModalHeader>Upload Photo</ModalHeader>
                    <ModalBody>
                        <div className="upload-form">
                            <div className="form-field">
                                <label className="form-label">Select Baby</label>
                                <select
                                    value={selectedBabyId}
                                    onChange={(e) => setSelectedBabyId(e.target.value)}
                                    className="baby-select"
                                >
                                    {babies.map((baby) => (
                                        <option key={baby.baby_id} value={baby.baby_id}>
                                            {baby.first_name} {baby.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label className="form-label">Select Photo (Max 5MB)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="file-input"
                                />
                            </div>

                            {previewUrl && (
                                <div className="photo-preview">
                                    <img src={previewUrl} alt="Preview" />
                                </div>
                            )}

                            <Textarea
                                label="Caption (Optional)"
                                placeholder="Add a caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="primary"
                            onPress={handleUpload}
                            isLoading={uploading}
                            isDisabled={!selectedFile}
                        >
                            Upload
                        </Button>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={() => {
                                setIsUploadModalOpen(false);
                                setSelectedFile(null);
                                setPreviewUrl(null);
                                setCaption("");
                            }}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} className="settings-modal">
                <ModalContent>
                    <ModalHeader>Delete Photo</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete this photo?</p>
                        {photoToDelete && (
                            <div className="delete-preview">
                                <img
                                    src={`${API_URL}${photoToDelete.photo_url}`}
                                    alt="Photo to delete"
                                    style={{
                                        width: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                                    {photoToDelete.first_name} {photoToDelete.last_name} - {new Date(photoToDelete.uploaded_at).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                        <p style={{ fontSize: '0.875rem', color: '#999', marginTop: '0.5rem' }}>
                            This action cannot be undone.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            onPress={confirmDelete}
                            isLoading={deleting}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="light"
                            onPress={() => {
                                setIsDeleteModalOpen(false);
                                setPhotoToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Navbar />
        </div>
    );
}
