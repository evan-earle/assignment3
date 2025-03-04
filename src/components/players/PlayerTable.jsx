import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

const PlayerTable = ({ players }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deletePlayerMutation = useMutation({
    mutationFn: async (playerId) => {
      const response = await fetch(
        `${import.meta.env.VITE_PLAYERS_API_URL}/${playerId}`,
        {
          method: "DELETE",
        }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries("playersData");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDelete = (playerId) => {
    if (window.confirm(`Are you sure you want to delete record ${playerId}?`)) {
      deletePlayerMutation.mutate(playerId);
    }
  };

  return (
    <>
      <p>
        <Link to="/admin/players/create">Add New Player</Link>
      </p>
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Position
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Player
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">Team</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Nationality
            </th>
            <th className="border border-gray-300 px-4 py-2">Goals</th>
            <th className="border border-gray-300 px-4 py-2">Assists</th>
            <th className="border border-gray-300 px-4 py-2">Points</th>
            <th className="border border-gray-300 px-4 py-2">Awards</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {players?.players.map((player) => (
            <tr key={player._id} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">
                {player.position}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.team}
              </td>
              <td className="border border-gray-300 px-4 py-2">{player.age}</td>
              <td className="border border-gray-300 px-4 py-2">
                {player.nationality}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.stats.goals}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.stats.assists}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.stats.points}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {player.awards?.length ? player.awards.join(", ") : "None"}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center space-x-1">
                <button className="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600">
                  Details
                </button>
                <button
                  onClick={() => navigate(`/admin/players/${player._id}/edit`)}
                  className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(player._id)}
                  className="bg-red-500 text-white px-2 py-1 text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default PlayerTable;
