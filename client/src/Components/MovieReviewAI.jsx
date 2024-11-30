import React, { useState } from "react";
import { CircularProgress, Rating, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { toast } from "react-toastify";

const MovieReviewGenerator = ({ movie, post, getAiResponse }) => {
    const [rating, setRating] = useState(3); // Default rating
    const [sentiment, setSentiment] = useState("positive"); // Default sentiment
    const [aiLoading, setAILoading] = useState(false);

    const handleGenerate = () => {
        getAiResponse(rating, sentiment);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "center", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ marginBottom: "10px", fontFamily: "Arial, sans-serif", color: "#333" }}>Generate Movie Review</h2>
            <p style={{ color: "#666" }}>Select your preferences and let AI write the review for you!</p>

            {/* Rating Selection */}
            <div style={{ marginBottom: "20px" }}>
                <Rating
                    name="movie-rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                    size="large"
                />
            </div>

            {/* Sentiment Selection */}
            <ToggleButtonGroup
                value={sentiment}
                exclusive
                onChange={(event, newValue) => setSentiment(newValue)}
                aria-label="sentiment"
                sx={{ marginBottom: "20px" }}
            >
                <ToggleButton value="positive" aria-label="positive" sx={{ textTransform: "none" }}>
                    Positive
                </ToggleButton>
                <ToggleButton value="negative" aria-label="negative" sx={{ textTransform: "none" }}>
                    Negative
                </ToggleButton>
            </ToggleButtonGroup>

            {/* Generate Button */}
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerate}
                    disabled={aiLoading}
                    style={{ textTransform: "none" }}
                >
                    {aiLoading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Generate Review"}
                </Button>
            </div>

            {/* Display generated content */}
            <div id="ai-content" style={{ marginTop: "20px", color: "#333", fontFamily: "Arial, sans-serif" }}></div>
        </div>
    );
};

export default MovieReviewGenerator;
