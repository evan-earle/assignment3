import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PlayerForm from "./PlayerForm";

const PlayerCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createPlayerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`${import.meta.env.VITE_PLAYERS_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["playersData"]);
      navigate("/admin/players");
    },
  });

  const processData = (data) => {
    // Ensure the data is correctly formatted
    const formattedData = {
      ...data,
      age: Number(data.age), // Convert age to number
      awards: data.awards.split(",").map((award) => award.trim()), // Convert awards to array
      stats: {
        goals: Number(data.goals), // Convert goals to number
        assists: Number(data.assists), // Convert assists to number
        points: Number(data.points), // Convert points to number
      },
    };

    createPlayerMutation.mutate(formattedData);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Player</h2>
      <PlayerForm onDataCollected={processData} />
    </div>
  );
};

export default PlayerCreate;
