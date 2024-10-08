import { fetchFromTMDB } from "../services/tmbd.service.js";

export const getTrendingTV = async (req, res) => {
    try {
        const data = await fetchFromTMDB(
            "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
        );
        const randomTV = data.results[Math.floor(Math.random() * data.results?.length)];

        res.status(200).json({ success: true, content: randomTV });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getTVTrailers = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`
        );

        res.status(200).json({ success: true, trailers: data.results });
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getTVDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);

        res.status(200).json({ success: true, content: data });
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getSimilarTVs = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`
        );

        res.status(200).json({ success: true, similar: data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getTVsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`
        );

        res.status(200).json({ success: true, content: data.results });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
