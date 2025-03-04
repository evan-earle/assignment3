import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PlayerForm from "./PlayerForm";

const PlayerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["players", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_PLAYERS_API_URL}/${id}`
      );
      return response.json();
    },
  });

  const editPlayerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `${import.meta.env.VITE_PLAYERS_API_URL}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
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
      awards: Array.isArray(data.awards)
        ? data.awards // If it's already an array, keep it as is
        : data.awards.split(",").map((award) => award.trim()), // Otherwise, split and trim
      stats: {
        goals: Number(data.goals), // Convert goals to number
        assists: Number(data.assists), // Convert assists to number
        points: Number(data.points), // Convert points to number
      },
    };

    editPlayerMutation.mutate(formattedData);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Edit Player - Id: {data?.id}
      </h2>
      <PlayerForm onDataCollected={processData} initialData={data} />
    </div>
  );
};

export default PlayerEdit;
