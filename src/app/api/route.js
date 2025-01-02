import { NextResponse } from "next/server";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import {db} from "../../../services/firebase";
import fs from "fs";
import path from "path";


export async function GET() {
  try {
    const eventCollection = collection(db, "news");
    const snapshot = await getDocs(eventCollection);
    const eventList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ data: eventList });
  } catch (error) {
    console.error("Error fetching event list:", error.message);
    return NextResponse.json({ error: "Failed to fetch event list" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("image");

    // Generate image name and save image to the server
    const imageName = `${Date.now()}-${imageFile.name}`;
    const filePath = `/api/${imageName}`;
    const absolutePath = path.join(process.cwd(), "public", filePath);
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    fs.writeFileSync(absolutePath, buffer);

    const newEvent = { title, description, image: filePath };
    const eventCollection = collection(db, "news");
    const docRef = await addDoc(eventCollection, newEvent);

    return NextResponse.json({ message: "Event added", data: { id: docRef.id, ...newEvent } });
  } catch (error) {
    console.error("Error adding event:", error.message);
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("image");

    const eventDoc = doc(db, "news", id);
    const updateData = { title, description };

    // Check if new image is uploaded and handle the image upload
    if (imageFile && imageFile.size > 0) {
      const imageName = `${Date.now()}-${imageFile.name}`;
      const filePath = `/images/api/${imageName}`;
      const absolutePath = path.join(process.cwd(), "public", filePath);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      fs.writeFileSync(absolutePath, buffer);
      updateData.image = filePath; // Update image path if a new image is uploaded
    }

    await updateDoc(eventDoc, updateData);
    return NextResponse.json({ message: "Event updated", data: { id, ...updateData } });
  } catch (error) {
    console.error("Error updating event:", error.message);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const eventDoc = doc(db, "news", id);

    // Retrieve event data to get the image info to delete
    const eventData = await getDoc(eventDoc);
    const imagePath = eventData.data()?.image;

    if (imagePath) {
      const imageFilePath = path.join(process.cwd(), "public", imagePath);
      // Delete image from disk
      fs.unlinkSync(imageFilePath);
    }

    // Delete event from Firestore
    await deleteDoc(eventDoc);
    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
