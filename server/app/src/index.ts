import { Elysia } from "elysia";
import { MongoClient, ObjectId, Db } from "mongodb";
import { z } from "zod";
import { cors } from "@elysiajs/cors"; // Import CORS
import { join } from "path";
import { fileURLToPath } from "url";
import express from "express";

//MongoDB connection settings
// const mongoUri = "mongodb://localhost:27017";

const mongoUri =
  "mongodb+srv://evanearle:VDMIPcFcgK51s2BH@cluster0.kzwt4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "hockey-players";
let db: Db | null = null;

//MongoDB Client initialization
const client = new MongoClient(mongoUri);

//Function to connect to MongoDB
const connectToDB = async (): Promise<void> => {
  try {
    if (!db) {
      await client.connect();
      console.log("Connected to MongoDB");
      db = client.db(dbName);
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

//Initialize Elysia app
const app = new Elysia();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // If sending cookies/auth headers
  })
);

//Zod validation schemas
//Schema for a player object
const playerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  team: z.string().min(1, "Team is required"),
  age: z.number().min(1, "Age must be a positive number"),
  position: z.string().min(1, "Position is required"),
  nationality: z.string().min(1, "Nationality is required"),
  awards: z.array(z.string()).optional(),
  stats: z.object({
    goals: z.number().min(0, "Goals cannot be negative"),
    assists: z.number().min(0, "Assists cannot be negative"),
    points: z.number().min(0, "Points cannot be negative"),
  }),
});

//Schema for a player ID
const playerIdSchema = z.string().refine((val) => ObjectId.isValid(val), {
  message: "Invalid ID format",
});

//Endpoint to get all players
app.get("/players", async () => {
  //Check if the database connection is initialized
  if (!db) {
    return {
      status: 500,
      error: "Database connection not initialized",
    };
  }

  try {
    //Fetch all players from the database
    const collection = db.collection("players");
    //Convert data to an array
    const players = await collection.find({}).toArray();
    return {
      status: 200,
      players,
    };
  } catch (error) {
    console.error("Error fetching players:", error);
    return {
      status: 500,
      error: "Failed to fetch players",
    };
  }
});

//Endpoint to get a player by ID
app.get("/players/:id", async ({ params }) => {
  //Validate the ID
  const idValidationResult = playerIdSchema.safeParse(params.id);

  //If the ID is invalid, return an error
  if (!idValidationResult.success) {
    return { error: idValidationResult.error.errors[0].message };
  }

  try {
    //Get the ID from the request parameters
    const { id } = params;

    //Check if the database connection is initialized
    if (!db) {
      return { status: 500, error: "Database connection not initialized" };
    }

    //Fetch the player from the database
    const player = await db
      .collection("players")
      .findOne({ _id: new ObjectId(id) });

    //If the player is not found, return an error
    if (!player) {
      return { error: "Player not found" };
    }

    return player;
  } catch (error) {
    console.error("Error fetching player:", error);
    return { error: "Failed to fetch player" };
  }
});

//Endpoint to create a new player
app.post("/players", async ({ body }) => {
  //Validate the request body using the player schema
  const validationResult = playerSchema.safeParse(body);

  //If the request body is invalid, return detailed error messages for each invalid field
  //Had to map over the errors to get the field and message
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));

    return {
      status: 400,
      error: "Validation failed",
      details: errors,
    };
  }

  //Check if the database connection is initialized
  if (!db) {
    return { status: 500, error: "Database connection not initialized" };
  }

  try {
    //Insert the player into the database
    const collection = db.collection("players");
    const result = await collection.insertOne(body);
    return { status: 201, message: "Player created", id: result.insertedId };
  } catch (error) {
    console.error("Error creating player:", error);
    return { status: 500, error: "Failed to create player" };
  }
});

//Endpoint to update a player by ID
app.put("/players/:id", async ({ params, body }) => {
  //Validate the ID parameter
  const idValidationResult = playerIdSchema.safeParse(params.id);

  //If the ID is invalid, return an error
  if (!idValidationResult.success) {
    return { status: 400, error: "Invalid ID format" };
  }

  //Validate the request body using the player schema
  const validationResult = playerSchema.safeParse(body);

  //If the request body is invalid, return detailed error messages for each invalid field
  //Had to map over the errors to get the field and message
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));

    return {
      status: 400,
      error: "Validation failed",
      details: errors,
    };
  }

  //Check if the database connection is initialized
  if (!db) {
    return { status: 500, error: "Database connection not initialized" };
  }

  try {
    const { id } = params;

    //Update the player in the database
    const result = await db
      .collection("players")
      .updateOne({ _id: new ObjectId(id) }, { $set: body });

    //If the player is not found, return an error
    if (result.matchedCount === 0) {
      return { status: 404, error: "Player not found" };
    }

    return { status: 200, message: "Player updated successfully" };
  } catch (error) {
    console.error("Error updating player:", error);
    return { status: 500, error: "Failed to update player" };
  }
});

//Endpoint to delete a player by ID
app.delete("/players/:id", async ({ params }) => {
  //Validate the ID
  const idValidationResult = playerIdSchema.safeParse(params.id);

  //If the ID is invalid, return an error
  if (!idValidationResult.success) {
    return { status: 400, error: "Invalid ID format" };
  }

  //Check if the database connection is initialized
  if (!db) {
    return { status: 500, error: "Database connection not initialized" };
  }

  try {
    const { id } = params;

    //Delete the player from the database
    const result = await db
      .collection("players")
      .deleteOne({ _id: new ObjectId(id) });

    //If the player is not found, return an error
    if (result.deletedCount === 0) {
      return { status: 404, error: "Player not found" };
    }

    return { status: 200, message: "Player deleted successfully" };
  } catch (error) {
    console.error("Error deleting player:", error);
    return { status: 500, error: "Failed to delete player" };
  }
});

const __dirname = fileURLToPath(new URL(".", import.meta.url));
app.use(express.static(join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

//Start the server and connect to MongoDB
const port = 3000;

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
