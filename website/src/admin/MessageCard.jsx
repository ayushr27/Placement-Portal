import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

// Main reusable component for updating a message and image
const MessageCard = ({
  title,
  initialImage,
  initialMessage,
  characterLimit,
}) => {
  // State for the image URL and the drop-zone highlight
  const [image, setImage] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false);

  // State for the message text and character count
  const [message, setMessage] = useState(initialMessage);
  const [charsLeft, setCharsLeft] = useState(
    characterLimit - initialMessage.length
  );

  // A boolean to track if the content has been changed from its initial state
  const hasChanged = image !== initialImage || message !== initialMessage;

  // Handle the drag over event to prevent the default browser behavior
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle the drag leave event
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle the image drop event
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please drop a valid image file.");
    }
  };

  // Handle image selection via file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle message text changes
  const handleMessageChange = (e) => {
    const text = e.target.value;
    if (text.length <= characterLimit) {
      setMessage(text);
      setCharsLeft(characterLimit - text.length);
    }
  };

  // Handle the update action
  const handleUpdate = () => {
    // This is where you would typically send data to an API
    console.log("Updating message:", {
      title,
      image,
      message,
    });
    toast.success(`${title} updated successfully!`);
    // After a successful update, you could reset the 'changed' state
    // For this example, we'll keep the changes to demonstrate persistence
    // setInitialMessage(message);
    // setInitialImage(image);
  };

  // Handle the clear/remove button click
  const handleRemove = () => {
    // This action could remove the item or just reset the fields.
    // Here we'll reset to initial values for a clean card.
    setImage(initialImage);
    setMessage(initialMessage);
    setCharsLeft(characterLimit - initialMessage.length);
    toast.info("Message and image cleared.");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8 max-w-4xl mx-auto">
      {/* Image Upload Section */}
      <div
        className={`w-full md:w-1/3 flex-shrink-0 relative rounded-xl overflow-hidden aspect-square border-2 border-dashed transition-colors
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label
          htmlFor="image-upload"
          className="cursor-pointer block w-full h-full"
        >
          {image ? (
            <img
              src={image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">Drop to Update Image</span>
            </div>
          )}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Message and Controls Section */}
      <div className="flex-1 space-y-4 w-full">
        {/* Title and Close Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center">
            {title}
            <div className="w-3 h-3 rounded-full bg-green-500 ml-3"></div>
          </h3>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Textarea for the message */}
        <div className="relative">
          <textarea
            value={message}
            onChange={handleMessageChange}
            className="w-full h-28 p-4 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none font-[Figtree]"
          />
          <div className="absolute bottom-2 right-4 text-xs text-gray-400">
            {charsLeft}/{characterLimit} characters
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={!hasChanged}
          className={`w-[50%] py-3 rounded-xl font-medium transition-colors
            ${
              hasChanged
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
        >
          Update
        </button>
      </div>
    </div>
  );
};
export default MessageCard;
