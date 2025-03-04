import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import BookForm from "./BookForm";

const BookEdit = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["books", id],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BOOKS_API_URL}/${id}`
      );
      return response.json();
    },
  });

  const editBookMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `${import.meta.env.VITE_BOOKS_API_URL}/${id}`,
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
      queryClient.invalidateQueries(["booksData"]);
      navigate("/admin/books");
    },
  });

  // useEffect(() => {
  //   //pre-populate the form if data is available
  //   setValue("title", data?.title);
  //   setValue("author", data?.author);
  //   setValue("published_year", data?.published_year);
  //   setValue("genre", data?.genre);
  // }, [data]);

  const processData = (data) => {
    editBookMutation.mutate(data);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Edit Book - Id: {data?.id}
      </h2>
      <BookForm onDataCollected={processData} initialData={data} />
    </div>
  );
};
export default BookEdit;
