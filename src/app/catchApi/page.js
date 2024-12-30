"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function EventList() {
  const [eventList, setEventList] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", image: null });
  const [isUpdating, setIsUpdating] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api");
    const data = await res.json();
    setEventList(data.data);
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.image) {
      setError("Title, description, and image cannot be empty!");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("description", newEvent.description);
    formData.append("image", newEvent.image);

    const res = await fetch("/api", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      setEventList((prev) => [...prev, result.data]);
      setNewEvent({ title: "", description: "", image: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setError("Failed to add event. Try again.");
    }
  };

  const handleUpdateEvent = async (id) => {
    const eventToUpdate = eventList.find((event) => event.id === id);
    const updatedTitle = prompt("Update title", eventToUpdate.title);
    const updatedDescription = prompt("Update description", eventToUpdate.description);

    if (updatedTitle && updatedDescription) {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", updatedTitle);
      formData.append("description", updatedDescription);

      setIsUpdating(true);

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const timeout = setTimeout(async () => {
        const res = await fetch("/api", {
          method: "PUT",
          body: formData,
        });

        setIsUpdating(false);

        if (res.ok) {
          const result = await res.json();
          setEventList((prev) => prev.map((event) => (event.id === id ? result.data : event)));
        }
      }, 300);

      setDebounceTimeout(timeout);
    }
  };

  const handleDeleteEvent = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      const res = await fetch("/api", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setEventList((prev) => prev.filter((event) => event.id !== id));
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Humanity-Charity News List</h1>
        <div className="flex justify-between items-center mb-6">
          <Link
            href="../admin"
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Back to Admin
          </Link>
        </div>

        <ul className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {eventList?.map((event) => (
            <li
              key={event.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <Image
                src={event.image || "/placeholder.png"}
                alt={event.title || "Default Placeholder"}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800">{event.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                <div className="mt-4 flex gap-5 items-center">
                  <button
                    onClick={() => handleUpdateEvent(event.id)}
                    className={`bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New News</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewEvent({ ...newEvent, image: e.target.files[0] })}
              className="border rounded-lg p-3"
              ref={fileInputRef}
            />
            <button
              onClick={handleAddEvent}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add News
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
