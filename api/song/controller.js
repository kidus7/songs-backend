
const Song = require("./model");

const AppError =  require('../errorHandler/appError');

// validation
const { validationResult } = require('express-validator');

// Create song
exports.createSong = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
    }

    try {
        const { title, artist, album, genre } = req.body;

        const newSong = await Song.create({ title, artist, album, genre });

        res.status(200).json({
            status: "SUCCESS",
            data: {
                song: newSong,
            },
            message: "New song successfully created.",
        });
    } catch (error) {
        next(error);
    }
};

// Get all songs
exports.getAllSongs = async (req, res, next) => {
    try {

        const { title, artist, album, genre, pageSize, page } = req.query;

        // Setting pagination parameters
        const options = {
            page: page || 1,
            sort: { createdAt: -1 },
            limit: pageSize || 10,
            lean: true,
        };

        let filter = {};

        if (title) {
            filter.title = { $regex: title, $options: 'i' }
        }

        if (artist) {
            filter.artist = { $regex: artist, $options: 'i' }
        }

        if (album) {
            filter.album = { $regex: album, $options: 'i' }
        }

        if (genre) {
            filter.genre = { $regex: genre, $options: 'i' }
        }

        const result = await Song.paginate(filter, options);

        const { docs, totalDocs, limit, totalPages, nextPage } = result;
        // Respond
        res.status(200).json({
            status: "SUCCESS",
            results: totalDocs,
            data: {
                songs: docs,
            },
            limit,
            totalPages,
            nextPage,
        });
    } catch (error) {
        next(error);
    }
};

// Get single song
exports.getSingleSong = async (req, res, next) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return next(new AppError("Song not found", 404));
        }

        res.status(200).json({
            status: "SUCCESS",
            data: {
                song,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update song
exports.updateSong = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation Error', errors: errors.array() });
    }

    try {
        const { title, artist, album, genre } = req.body;

        const updatedSong = await Song.findByIdAndUpdate(
            req.params.id,
            { title, artist, album, genre },
            { runValidators: true, new: true }
        );

        if (!updatedSong) {
            return next(new AppError("Song not found", 404));
        }

        res.status(200).json({
            status: "SUCCESS",
            data: {
                song: updatedSong,
            },
            message: "Song successfully updated",
        });
    } catch (error) {
        next(error);
    }
};

// Delete single song
exports.deleteSingleSong = async (req, res, next) => {
    try {
        const deletedSong = await Song.findByIdAndDelete(req.params.id);

        if (!deletedSong) {
            return next(new AppError("Song not found", 404));
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Song successfully deleted",
        });
    } catch (error) {
        next(error);
    }
};

// Get songs stat
exports.getStats = async (req, res, next) => {
    try {
        const totalSongs = await Song.countDocuments();

        const artistStats = await Song.aggregate([
            { $group: { _id: "$artist", totalSongs: { $sum: 1 }, albums: { $addToSet: "$album" } } },
            { $project: { _id: 0, artist: "$_id", totalSongs: 1, totalAlbums: { $size: "$albums" } } }
        ]);

        const genreStats = await Song.aggregate([
            { $group: { _id: "$genre", totalSongs: { $sum: 1 } } },
            { $sort: { totalSongs: -1 } }
        ]);

        const albumStats = await Song.aggregate([
            { $group: { _id: { artist: "$artist", album: "$album" }, totalSongs: { $sum: 1 } } },
            { $project: { _id: 0, artist: "$_id.artist", album: "$_id.album", totalSongs: 1 } },
            { $sort: { artist: 1, album: 1 } }
        ]);

        res.status(200).json({
            status: "SUCCESS",
            data: {
                totalSongs,
                artistStats,
                albumStats,
                genreStats
            }
        });
    } catch (error) {
        next(error);
    }
};
