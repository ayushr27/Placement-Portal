import React from "react";
import MessageCard from "./MessageCard";
import ManageCoordinators from "./ManageCoordinators";
import PlacementAdministration from "./PlacementAdministration";

const HomePageControl = () => {
  const directorMessage =
    "Indian Institute of Information Technology Design and Manufacturing Kurnool is the youngest among five centrally funded IIITDMs and established as part of Andhra Pradesh reorganization act...";
  const ficMessage =
    "This is a placeholder message for the FIC. You can edit this text to provide a new message to the visitors of the website. The character limit is 500 characters.";
  const anotherFicMessage =
    "This is another placeholder for a different FIC. I can update my message here.";

  return (
    <div className="bg-[#DED9D9] min-h-screen p-8 font-[Figtree] space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
        Home Page Control
      </h1>

      <MessageCard
        title="Update Director's Message"
        initialImage="https://placehold.co/150x150/d1d5db/374151?text=Director"
        initialMessage={directorMessage}
        characterLimit={500}
      />

      <MessageCard
        title="Update FIC's Message"
        initialImage="https://placehold.co/150x150/d1d5db/374151?text=FIC+1"
        initialMessage={ficMessage}
        characterLimit={500}
      />

      <MessageCard
        title="Update FIC's Message"
        initialImage="https://placehold.co/150x150/d1d5db/374151?text=FIC+2"
        initialMessage={anotherFicMessage}
        characterLimit={500}
      />
      <ManageCoordinators />
      <PlacementAdministration />
    </div>
  );
};

export default HomePageControl;
