// CreateBounty.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import styles from './styles/BountyForm.module.css';
import SplineEmbed from "./SplineEmbed";

const CreateBounty = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        reward: "",
        company: "",
        deadline: "",
        githubLink: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/bounties/create", formData);
            alert("🎉 Bounty Created Successfully!");
            navigate("/bounty-list");
        } catch (error) {
            console.error("Error creating bounty:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <h2 className={styles.heading}>🏆 Create New Bounty</h2>

            <div className={styles.contentWrapper}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Bounty Title"
                        value={formData.title}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Bounty Description"
                        value={formData.description}
                        onChange={handleChange}
                        className={styles.textarea}
                        required
                    />
                    <input
                        type="number"
                        name="reward"
                        placeholder="Reward in ETH"
                        value={formData.reward}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="text"
                        name="company"
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="url"
                        name="githubLink"
                        placeholder="GitHub Repository Link (Optional)"
                        value={formData.githubLink}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>
                        🚀 Create Bounty
                    </button>
                </form>

                <div className={styles.splineWrapper}>
                    <SplineEmbed />
                </div>
            </div>
        </div>
    );
};

export default CreateBounty;
