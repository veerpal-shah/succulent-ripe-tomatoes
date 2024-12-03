// Import dependencies
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File, IncomingForm } from 'formidable';
import { createClient } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM!);

export const config = {
    api: {
        bodyParser: false,
    },
};

interface TranscriptionResponse {
    transcript?: string;
    error?: string;
}

// Helper function to parse the form data and return the audio file
const parseForm = async (req: NextApiRequest): Promise<File> => {
    console.log('Parsing form data...');
    return new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio;
            if (audioFile) {
                resolve(audioFile);
            } else {
                reject(new Error('Audio file is missing.'));
            }
        });
    });
};

// API handler for /api/transcribe
const handler = async (req: NextApiRequest, res: NextApiResponse<TranscriptionResponse>) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Only POST requests allowed' });
        return;
    }

    console.log('Transcribing audio...');

    try {
        // Parse the uploaded file from the request
        const audioFile = await parseForm(req);
        const audioPath = audioFile.filepath;


        // Send the audio buffer to Deepgram for transcription
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            fs.createReadStream(audioPath),
            { model: 'nova-2', mimeType: 'audio/wav' }

        );
        
        // Extract and send the transcription result
        const transcript = result?.results.channels[0].alternatives[0].transcript;
        console.log('Transcription:', transcript);
        res.status(200).json({ transcript });

    } catch (error) {
        console.error('Error in Deepgram transcription:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
};

export default handler;
