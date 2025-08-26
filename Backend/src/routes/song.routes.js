const express = require('express');
const multer = require('multer');
const uploadFile = require('../services/storage.service');
const songModel =require('../models/song.model'); 
const { route } = require('../app');

const router = express.Router();
 const upload = multer({storage: multer.memoryStorage()});

router.post('/songs',upload.single('audio'), async (req,res)=>{

    const fileData = await uploadFile(req.file)
    const songs = await songModel.create({
         title: req.body.title,
    artist:req.body.artist,
    audio: fileData.url,
    mood: req.body.mood,
    })
    res.status(201).json({
        message: 'Song created successfully',
        song: songs
    });
});


router.get('/songs', async (req,res)=>{
    const { mood } = req.query;
    const songs = await songModel.find({
        mood: mood,
    })
    res.status(200).json({
        message: 'Songs fetched successfully',
        songs: songs,
    });


})
    // Here you would typically save the song to the database










module.exports = router;