import React, { useState } from "react";
import type { EventCardProps } from "../types";
import { getImageUrl } from "../utils/api";

const EventCard: React.FC<EventCardProps> = ({
  event,
  currentUserId,
  onDelete,
  onEdit,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isCreator = currentUserId && event.user_id === currentUserId;

  const handleDelete = async (): Promise<void> => {
    const confirmDelete = window.confirm(`Delete "${event.title}"?`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(event.id);
    } catch (error) {
      console.error("Failed to delete event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageError = (): void => {
    setImageError(true);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {event.image && !imageError ? (
        <img
          src={getImageUrl(event.image)}
          alt={event.title}
          className="w-full h-48 object-cover"
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 mb-3 text-sm line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-1 mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            <span className="truncate">{event.address}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
        </div>

        {isCreator && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(event)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              Edit Event
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
