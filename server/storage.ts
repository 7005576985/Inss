import { users, images, processingJobs, type User, type InsertUser, type Image, type InsertImage, type ProcessingJob, type InsertProcessingJob } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Image operations
  createImage(image: InsertImage): Promise<Image>;
  getImage(id: number): Promise<Image | undefined>;
  getUserImages(userId?: number): Promise<Image[]>;
  updateImage(id: number, updates: Partial<Image>): Promise<Image | undefined>;
  
  // Processing job operations
  createProcessingJob(job: InsertProcessingJob): Promise<ProcessingJob>;
  getProcessingJob(id: number): Promise<ProcessingJob | undefined>;
  updateProcessingJob(id: number, updates: Partial<ProcessingJob>): Promise<ProcessingJob | undefined>;
  getUserProcessingJobs(userId?: number): Promise<ProcessingJob[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private images: Map<number, Image>;
  private processingJobs: Map<number, ProcessingJob>;
  private currentUserId: number;
  private currentImageId: number;
  private currentJobId: number;

  constructor() {
    this.users = new Map();
    this.images = new Map();
    this.processingJobs = new Map();
    this.currentUserId = 1;
    this.currentImageId = 1;
    this.currentJobId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createImage(insertImage: InsertImage): Promise<Image> {
    const id = this.currentImageId++;
    const image: Image = {
      ...insertImage,
      id,
      processedPath: null,
      enhancements: {},
      createdAt: new Date(),
    };
    this.images.set(id, image);
    return image;
  }

  async getImage(id: number): Promise<Image | undefined> {
    return this.images.get(id);
  }

  async getUserImages(userId?: number): Promise<Image[]> {
    // For now, return all images since we don't have user sessions
    return Array.from(this.images.values());
  }

  async updateImage(id: number, updates: Partial<Image>): Promise<Image | undefined> {
    const image = this.images.get(id);
    if (!image) return undefined;

    const updatedImage = { ...image, ...updates };
    this.images.set(id, updatedImage);
    return updatedImage;
  }

  async createProcessingJob(insertJob: InsertProcessingJob): Promise<ProcessingJob> {
    const id = this.currentJobId++;
    const job: ProcessingJob = {
      ...insertJob,
      id,
      status: 'pending',
      result: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.processingJobs.set(id, job);
    
    // Simulate processing completion after a delay
    setTimeout(() => {
      this.completeJob(id);
    }, 2000);
    
    return job;
  }

  async getProcessingJob(id: number): Promise<ProcessingJob | undefined> {
    return this.processingJobs.get(id);
  }

  async updateProcessingJob(id: number, updates: Partial<ProcessingJob>): Promise<ProcessingJob | undefined> {
    const job = this.processingJobs.get(id);
    if (!job) return undefined;

    const updatedJob = { ...job, ...updates };
    this.processingJobs.set(id, updatedJob);
    return updatedJob;
  }

  async getUserProcessingJobs(userId?: number): Promise<ProcessingJob[]> {
    // For now, return all jobs since we don't have user sessions
    return Array.from(this.processingJobs.values());
  }

  private async completeJob(jobId: number) {
    const job = this.processingJobs.get(jobId);
    if (!job) return;

    const updatedJob: ProcessingJob = {
      ...job,
      status: 'completed',
      completedAt: new Date(),
      result: { success: true, message: 'Processing completed successfully' },
    };
    
    this.processingJobs.set(jobId, updatedJob);
  }
}

export const storage = new MemStorage();
