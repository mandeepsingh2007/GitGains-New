import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        console.log("Leaderboard Data:", data);
        setLeaders(data);
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "24px",
        background: "#121212",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(255, 255, 255, 0.1)",
        position: "relative",
        overflow: "hidden",
        border: "2px solid #FFD700",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#FFD700",
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "16px",
          textShadow: "2px 2px 8px rgba(255, 215, 0, 0.8)",
        }}
      >
        🏆 Leaderboard
      </h2>
      {leaders.length === 0 ? (
        <p style={{ textAlign: "center", color: "#bbb", fontSize: "18px" }}>No contributions yet</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {leaders.map((leader, index) => (
            <motion.li
              key={leader.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(255, 215, 0, 0.3)",
                background:
                  index === 0
                    ? "#FFD700"
                    : index === 1
                    ? "#C0C0C0"
                    : index === 2
                    ? "#CD7F32"
                    : "#1E1E1E",
                color: index < 3 ? "black" : "#FFD700",
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "8px",
                transition: "transform 0.3s",
              }}
              whileHover={{ scale: 1.05 }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ fontSize: "22px" }}
                >
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🏅"}
                </motion.span>
                {index + 1}. {leader.username}
              </span>
              <span style={{ fontWeight: "bold", fontSize: "18px", color: "#000000" }}>{leader.contributions} PRs</span>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default Leaderboard;
