import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertImageSchema, insertProcessingJobSchema, imageEnhancementSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload image endpoint
  app.post('/api/images/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const imageData = {
        filename: req.file.originalname,
        originalPath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
        width: null,
        height: null,
      };

      const image = await storage.createImage(imageData);
      res.json(image);
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  });

  // Apply enhancements endpoint
  app.post('/api/images/:id/enhance', async (req, res) => {
    try {
      const imageId = parseInt(req.params.id);
      const enhancements = imageEnhancementSchema.parse(req.body);

      const image = await storage.getImage(imageId);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      // Create processing job
      const jobData = {
        imageId,
        jobType: 'enhance',
        parameters: enhancements,
      };

      const job = await storage.createProcessingJob(jobData);
      
      // In a real implementation, this would trigger background processing
      // For now, we'll just return the job
      res.json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid enhancement parameters', errors: error.errors });
      }
      console.error('Enhancement error:', error);
      res.status(500).json({ message: 'Failed to process enhancement' });
    }
  });

  // Background removal endpoint
  app.post('/api/images/:id/remove-background', async (req, res) => {
    try {
      const imageId = parseInt(req.params.id);

      const image = await storage.getImage(imageId);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      const jobData = {
        imageId,
        jobType: 'background_removal',
        parameters: {},
      };

      const job = await storage.createProcessingJob(jobData);
      res.json(job);
    } catch (error) {
      console.error('Background removal error:', error);
      res.status(500).json({ message: 'Failed to process background removal' });
    }
  });

  // Get processing job status
  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const job = await storage.getProcessingJob(jobId);
      
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json(job);
    } catch (error) {
      console.error('Job status error:', error);
      res.status(500).json({ message: 'Failed to get job status' });
    }
  });

  // Get user images
  app.get('/api/images', async (req, res) => {
    try {
      const images = await storage.getUserImages();
      res.json(images);
    } catch (error) {
      console.error('Get images error:', error);
      res.status(500).json({ message: 'Failed to get images' });
    }
  });

  // Get specific image
  app.get('/api/images/:id', async (req, res) => {
    try {
      const imageId = parseInt(req.params.id);
      const image = await storage.getImage(imageId);
      
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }

      res.json(image);
    } catch (error) {
      console.error('Get image error:', error);
      res.status(500).json({ message: 'Failed to get image' });
    }
  });

  // Serve uploaded images
  app.use('/uploads', (req, res, next) => {
    // Add CORS headers for images
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
